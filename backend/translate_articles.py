"""
Mindful News v2 - Translate existing articles to Portuguese (PT-PT)

One-time migration script to translate all existing English articles
to Portuguese, including titles, summaries, content, and category names.
"""

import anthropic
import json
import re
import time
from typing import Optional, Dict
import config
import database

client = anthropic.Anthropic(api_key=config.ANTHROPIC_API_KEY)

# Category translation map (English -> Portuguese)
CATEGORY_MAP = {
    "Diplomacy & Peace": "Diplomacia e Paz",
    "Environment & Climate": "Ambiente e Clima",
    "Health & Wellbeing": "Saúde e Bem-estar",
    "Social Progress": "Progresso Social",
    "Science & Innovation": "Ciência e Inovação",
    "Economy & Trade": "Economia e Comércio",
    "Culture & Arts": "Cultura e Artes",
    "Solutions & Good News": "Soluções e Boas Notícias",
    "World Affairs": "Assuntos Globais",
}

TRANSLATION_PROMPT = """Traduz o seguinte artigo noticioso de inglês para português de Portugal (PT-PT).

REGRAS:
- Usa português europeu, NUNCA português do Brasil
- Mantém o tom calmo e construtivo do original
- Segue o estilo jornalístico do Público: frases curtas e directas, voz activa, vocabulário preciso
- Evita estrangeirismos quando existe equivalente português
- Preserva a exactidão factual — não acrescentes nem remova informação
- Mantém a estrutura e os parágrafos do original
- O resumo deve ter no máximo 200 caracteres

Artigo em inglês:

TÍTULO: {title}

RESUMO: {summary}

CONTEÚDO:
{content}

Devolve APENAS JSON, sem explicação:
{{
  "title": "Título traduzido em português",
  "summary": "Resumo traduzido em português (máx. 200 caracteres)",
  "content": "Conteúdo completo traduzido em português..."
}}"""


def translate_article(article: Dict) -> Optional[Dict]:
    """Translate a single article from English to Portuguese using Claude."""
    prompt = TRANSLATION_PROMPT.format(
        title=article["title"],
        summary=article["summary"],
        content=article["content"]
    )

    try:
        response = client.messages.create(
            model=config.CLAUDE_MODEL,
            max_tokens=4000,
            messages=[{"role": "user", "content": prompt}]
        )

        text = response.content[0].text.strip()

        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        if json_match:
            result = json.loads(json_match.group())
            if all(k in result for k in ["title", "summary", "content"]):
                return result

        print(f"  ⚠️ Could not parse translation response")
        return None

    except Exception as e:
        print(f"  ❌ Translation error: {e}")
        return None


def main():
    """Translate all existing articles to Portuguese."""
    supabase = database.get_client()

    # Step 1: Update category names
    print("\n📋 Updating category names to Portuguese...")
    for eng, pt in CATEGORY_MAP.items():
        result = supabase.table("articles").update(
            {"category": pt}
        ).eq("category", eng).execute()
        count = len(result.data) if result.data else 0
        if count > 0:
            print(f"  ✅ '{eng}' → '{pt}' ({count} articles)")

    # Step 2: Translate article content
    print("\n📰 Fetching articles to translate...")
    result = supabase.table("articles").select(
        "id, title, summary, content"
    ).order("published_at", desc=True).execute()

    articles = result.data or []
    print(f"  Found {len(articles)} articles to translate")

    translated = 0
    errors = 0

    for i, article in enumerate(articles):
        # Skip if already in Portuguese (simple heuristic: check for common PT words)
        title_lower = article["title"].lower()
        if any(w in title_lower for w in [" de ", " da ", " do ", " para ", " que ", " com "]):
            print(f"  ⏭️ [{i+1}/{len(articles)}] Already in Portuguese: {article['title'][:50]}...")
            continue

        print(f"\n  🔄 [{i+1}/{len(articles)}] Translating: {article['title'][:60]}...")

        result = translate_article(article)

        if result:
            # Update in database
            supabase.table("articles").update({
                "title": result["title"],
                "summary": result["summary"][:200],
                "content": result["content"],
            }).eq("id", article["id"]).execute()

            translated += 1
            print(f"  ✅ Translated: {result['title'][:60]}...")
        else:
            errors += 1

        # Rate limiting — avoid hitting API limits
        time.sleep(1)

    print(f"\n✅ Translation complete: {translated} translated, {errors} errors, {len(articles) - translated - errors} skipped")


if __name__ == "__main__":
    main()

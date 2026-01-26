"""
Mindful News v2 - Claude API Processing
"""

import anthropic
import json
import re
from datetime import datetime, timezone
from typing import List, Dict, Optional, Tuple
from bs4 import BeautifulSoup
import config
import database


# Initialize Claude client
client = anthropic.Anthropic(api_key=config.ANTHROPIC_API_KEY)


# ===================
# Prompts
# ===================

CLUSTERING_PROMPT = """You are a news editor for Mindful News, an internationally-focused constructive news service. Your job is to organize articles into thematic clusters that will each become a single synthesized article.

Given these article titles from sources worldwide, group them by global theme. Each cluster should have 2-7 related articles.

Categories (choose the most fitting — use these EXACT Portuguese names):
- Diplomacia e Paz
- Ambiente e Clima
- Saúde e Bem-estar
- Progresso Social
- Ciência e Inovação
- Economia e Comércio
- Cultura e Artes
- Soluções e Boas Notícias
- Assuntos Globais

IMPORTANT rules:
1. Group by GLOBAL THEME, never by country or region. A cluster about "climate action" should combine articles from different continents.
2. PRIORITIZE international stories over local/national ones. Skip articles that are purely local news unless they have global relevance.
3. Articles about solutions, progress, innovation, or positive developments should go to "Soluções e Boas Notícias".
4. Avoid creating clusters dominated by a single country. Mix geographies within each theme.
5. Skip articles that are sports scores, entertainment gossip, or purely domestic politics of any single country.
6. Each article can only be in ONE cluster.
7. Aim for 6-10 clusters total with good thematic variety.

Output JSON only, no explanation:
[
  {{
    "category": "Nome da Categoria",
    "articles": ["title1", "title2"]
  }}
]

Article titles:
{titles}"""


SYNTHESIS_PROMPT = """És um jornalista construtivo do Mindful News, um serviço noticioso internacional que pratica jornalismo construtivo. Não te limitas a reportar o que correu mal — forneces contexto, nuance e destaque ao que está a ser feito para resolver.

A tua tarefa: sintetizar estes artigos relacionados num ÚNICO artigo noticioso original e bem escrito, EM PORTUGUÊS DE PORTUGAL.

PRINCÍPIOS DE JORNALISMO CONSTRUTIVO:
1. REENQUADRA, não copies. Encontra a história mais profunda — as causas, as respostas, o impacto humano, o caminho a seguir.
2. FOCO NAS SOLUÇÕES: Mesmo em notícias difíceis, inclui o que pessoas, organizações ou governos estão a fazer. O que funciona? O que está a ser tentado?
3. CONTEXTO: Ajuda os leitores a compreender PORQUÊ que isto importa globalmente. Liga pontos entre regiões. Fornece contexto histórico.
4. TOM CALMO: Escreve como um amigo ponderado e bem informado a explicar as notícias. Sem alarmismo, sem sensacionalismo, sem catastrofismo.
5. PERSPECTIVA GLOBAL: Enquadra as notícias internacionalmente, não do ponto de vista de um único país.
6. EMPODERAMENTO: Deixa os leitores informados e capacitados, não ansiosos nem impotentes.

ESTILO (baseado no Livro de Estilo do Público):
- Frases curtas e directas, voz activa
- Vocabulário preciso e concreto, sem adjectivação excessiva
- Evita estrangeirismos quando existe equivalente português
- Nunca uses "diz-se que", "consta que", "parece que"
- Um parágrafo = uma ideia
- Lead informativo que responde a quem, o quê, quando, onde
- Informação organizada por ordem decrescente de importância (pirâmide invertida)

ESTRUTURA:
- Abertura: O desenvolvimento-chave, declarado de forma clara e calma
- Contexto: 2-3 parágrafos com antecedentes, causas e significado global
- Resposta: O que está a ser feito — acções, soluções, iniciativas
- Perspectiva: Um fecho construtivo — o que observar, razões para optimismo cauteloso, ou como as pessoas podem participar

REGRAS:
- IDIOMA: Escreve OBRIGATORIAMENTE em português de Portugal (PT-PT), nunca em português do Brasil nem em inglês.
- COMPRIMENTO: Pelo menos {min_chars} caracteres
- FORMATO: Apenas parágrafos de texto simples. Sem HTML, sem markdown, sem listas com bullets.
- EXACTIDÃO: Indica apenas factos sustentados pelos artigos-fonte. Sem especulação.
- ORIGINALIDADE: Escreve na tua própria voz. NÃO copies frases das fontes.

PONTUAÇÃO DE POSITIVIDADE (sê honesto mas procura o ângulo construtivo):
- 5: Muito positiva (avanços, soluções a funcionar, progresso significativo)
- 4: Positiva (desenvolvimentos construtivos, tendências encorajadoras)
- 3: Neutra (equilibrada, situação complexa com desafios e respostas)
- 2: Preocupante (problemas reais, mas com contexto e esforços de resposta notados)
- 1: Crise (emergência aguda, mas ainda enquadrada com dignidade e contexto)

Formato de saída (apenas JSON):
{{
  "title": "Título claro e informativo em português, enquadramento internacional",
  "summary": "Uma frase-resumo construtiva em português (máx. 200 caracteres)",
  "content": "Texto completo do artigo em português com parágrafos...",
  "positivity_score": 3
}}

Artigos-fonte:
{articles}"""


def cluster_articles(articles: List[Dict]) -> List[Dict]:
    """
    Use Claude to cluster articles by theme.
    Returns list of clusters with category and article titles.
    """
    if not articles:
        return []
    
    titles = [a["title"] for a in articles]
    prompt = CLUSTERING_PROMPT.format(titles=json.dumps(titles, indent=2))
    
    print("\n🧠 Clustering articles with Claude...")
    
    try:
        response = client.messages.create(
            model=config.CLAUDE_MODEL,
            max_tokens=4000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        content = response.content[0].text.strip()
        
        # Extract JSON from response
        json_match = re.search(r'\[.*\]', content, re.DOTALL)
        if json_match:
            clusters = json.loads(json_match.group())
            print(f"✅ Created {len(clusters)} clusters")
            return clusters
        else:
            print("⚠️ Could not parse clustering response")
            return []
            
    except Exception as e:
        print(f"❌ Clustering error: {e}")
        return []


def synthesize_cluster(
    cluster: Dict,
    articles: List[Dict]
) -> Optional[Dict]:
    """
    Synthesize a cluster of articles into one coherent piece.
    Returns dict with title, summary, content, positivity_score.
    """
    # Find articles that match this cluster
    cluster_titles = set(cluster.get("articles", []))
    matched = [a for a in articles if a["title"] in cluster_titles]
    
    if not matched:
        return None
    
    # Prepare article data for prompt
    articles_text = json.dumps([{
        "title": a["title"],
        "summary": a["summary"][:500],
        "link": a["link"]
    } for a in matched], indent=2)
    
    prompt = SYNTHESIS_PROMPT.format(
        min_chars=config.MIN_CHARACTERS,
        articles=articles_text
    )
    
    category = cluster.get("category", "Assuntos Globais")
    print(f"\n📝 Synthesizing: {category} ({len(matched)} articles)")
    
    try:
        response = client.messages.create(
            model=config.CLAUDE_MODEL,
            max_tokens=4000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        content = response.content[0].text.strip()
        
        # Parse JSON response
        json_match = re.search(r'\{.*\}', content, re.DOTALL)
        if json_match:
            result = json.loads(json_match.group())
            
            # Validate required fields
            if all(k in result for k in ["title", "summary", "content", "positivity_score"]):
                result["category"] = category
                result["source_articles"] = matched
                
                # Ensure positivity score is valid
                score = result["positivity_score"]
                if not isinstance(score, int) or score < 1 or score > 5:
                    result["positivity_score"] = 3
                
                print(f"  ✅ Generated: {result['title'][:50]}... (positivity: {result['positivity_score']})")
                return result
        
        print(f"  ⚠️ Could not parse synthesis response")
        return None
        
    except Exception as e:
        print(f"  ❌ Synthesis error: {e}")
        return None


def get_best_image(articles: List[Dict]) -> Optional[str]:
    """Get the best image URL from a list of articles."""
    for article in articles:
        if article.get("image_url"):
            url = article["image_url"]
            if url.startswith("http"):
                return url
    return None


def get_latest_date(articles: List[Dict]) -> datetime:
    """Get the most recent publication date from articles."""
    from dateutil import parser as dateparser
    
    dates = []
    for article in articles:
        try:
            if article.get("published_at"):
                d = article["published_at"]
                if isinstance(d, str):
                    d = dateparser.parse(d)
                if d.tzinfo is None:
                    d = d.replace(tzinfo=timezone.utc)
                dates.append(d)
        except Exception:
            pass
    
    return max(dates) if dates else datetime.now(timezone.utc)


def balance_articles(articles: List[Dict], limit: int) -> List[Dict]:
    """
    Select a balanced subset of articles across different sources.
    Ensures no single source dominates the processing batch.
    Uses round-robin selection from each source.
    """
    if len(articles) <= limit:
        return articles

    # Group by source
    by_source = {}
    for a in articles:
        sid = a.get("source_id", "unknown")
        by_source.setdefault(sid, []).append(a)

    # Round-robin: take one from each source until we hit the limit
    balanced = []
    source_lists = list(by_source.values())
    idx = 0
    while len(balanced) < limit:
        added_this_round = False
        for source_articles in source_lists:
            if idx < len(source_articles) and len(balanced) < limit:
                balanced.append(source_articles[idx])
                added_this_round = True
        idx += 1
        if not added_this_round:
            break

    print(f"  📊 Balanced: {len(balanced)} articles from {len(by_source)} sources")
    return balanced


def process_articles() -> Tuple[int, int]:
    """
    Main processing function.
    Fetches unprocessed articles, clusters them, synthesizes, and saves.
    Returns (processed_count, created_count).
    """
    # Get unprocessed articles (fetch more than needed for balancing)
    raw_articles = database.get_unprocessed_articles(limit=config.MAX_ARTICLES * 3)

    if not raw_articles:
        print("\n📭 No unprocessed articles found")
        return 0, 0

    # Balance across sources to prevent any single source from dominating
    raw_articles = balance_articles(raw_articles, config.MAX_ARTICLES)

    print(f"\n📰 Processing {len(raw_articles)} articles...")
    
    # Cluster articles
    clusters = cluster_articles(raw_articles)
    
    if not clusters:
        print("⚠️ No clusters created")
        return len(raw_articles), 0
    
    # Process each cluster
    created = 0
    processed_ids = []
    
    for cluster in clusters:
        result = synthesize_cluster(cluster, raw_articles)
        
        if result:
            # Get metadata from source articles
            source_articles = result.get("source_articles", [])
            image_url = get_best_image(source_articles)
            published_at = get_latest_date(source_articles)
            original_links = [a["link"] for a in source_articles]
            
            # Save to database
            article_id = database.insert_article(
                title=result["title"],
                summary=result["summary"],
                content=result["content"],
                category=result["category"],
                positivity_score=result["positivity_score"],
                original_links=original_links,
                image_url=image_url,
                published_at=published_at
            )
            
            if article_id:
                created += 1
                # Track processed raw articles
                processed_ids.extend([a["id"] for a in source_articles])
    
    # Mark raw articles as processed
    if processed_ids:
        database.mark_articles_processed(list(set(processed_ids)))
    
    print(f"\n✅ Processing complete: {created} articles created")
    
    return len(raw_articles), created

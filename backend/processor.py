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

CLUSTERING_PROMPT = """You are a news editor for Mindful News, an internationally-focused constructive news service that seeks the BEST of humanity. Your job is to organize articles into thematic clusters that will each become a single synthesized article.

Given these article titles from sources worldwide, group them by SPECIFIC TOPIC. Each cluster should have 2-7 related articles that genuinely cover the same story, event, or closely related topic.

Categories (choose the most fitting — use these EXACT Portuguese names):
- Diplomacia e Paz
- Ambiente e Clima
- Saúde e Bem-estar
- Progresso Social
- Ciência e Inovação
- Economia e Comércio
- Cultura e Artes
- Histórias Humanas
- Soluções e Boas Notícias
- Assuntos Globais

CRITICAL rules:
1. ONLY group articles that are genuinely about the SAME specific topic, event, or closely related subject. Two articles in the same broad category (e.g. both "human stories") are NOT enough — they must share a concrete connection. Example: "Man donates field for orchard" and "Holocaust survivor speaks at parliament" are BOTH human stories but completely unrelated — they MUST NOT be in the same cluster.
2. It is BETTER to have a cluster with a single article than to force unrelated articles together. If an article has no match, create a cluster with just that one article.
3. Group by GLOBAL THEME, never by country or region. A cluster about "climate action" should combine articles from different continents.
4. PRIORITIZE international stories over local/national ones. Skip articles that are purely local news unless they have global relevance.
5. Articles about solutions, progress, innovation, or positive developments should go to "Soluções e Boas Notícias".
6. Articles about human kindness, solidarity, community, volunteering, acts of courage, or inspiring individuals should go to "Histórias Humanas".
7. Avoid creating clusters dominated by a single country. Mix geographies within each theme.
8. Skip articles that are sports scores, entertainment gossip, or purely domestic politics of any single country.
9. Each article can only be in ONE cluster.
10. Aim for 6-10 clusters total with good thematic variety.
11. ALWAYS try to create at least one "Soluções e Boas Notícias" cluster and one "Histórias Humanas" cluster per batch. Look actively for these angles.
12. When in doubt about categorization, prefer the more constructive/positive category.

Output JSON only, no explanation:
[
  {{
    "category": "Nome da Categoria",
    "articles": ["title1", "title2"]
  }}
]

Article titles:
{titles}"""


SYNTHESIS_PROMPT = """És um jornalista construtivo do Mindful News, um serviço noticioso internacional que pratica jornalismo construtivo. A tua missão vai além de reportar: procuras activamente o melhor da humanidade — a resiliência, a solidariedade, a inovação, a coragem — mesmo nas histórias mais difíceis.

A tua tarefa: sintetizar estes artigos relacionados num ÚNICO artigo noticioso original e bem escrito, EM PORTUGUÊS DE PORTUGAL.

FILOSOFIA MINDFUL NEWS:
- Acreditamos que as notícias podem informar sem deprimir, alertar sem alarmar, e inspirar acção sem criar ansiedade.
- Procuramos sempre a história HUMANA por trás dos factos: quem são as pessoas envolvidas, o que as move, como estão a responder.
- O leitor deve terminar cada artigo a sentir-se mais informado, mais esperançoso e mais ligado ao mundo — nunca impotente.

PRINCÍPIOS DE JORNALISMO CONSTRUTIVO:
1. PROCURA O MELHOR: Em cada história, encontra os actos de coragem, solidariedade, inovação ou resiliência. Quem está a ajudar? Quem está a resolver? Quem está a resistir com dignidade?
2. REENQUADRA COM HUMANIDADE: Não copies — encontra a história mais profunda. As causas, sim, mas sobretudo as respostas humanas, o impacto nas pessoas reais, o caminho a seguir.
3. FOCO NAS SOLUÇÕES: Mesmo em notícias difíceis, dedica pelo menos um terço do artigo ao que está a ser feito. O que funciona? O que está a ser tentado? Que progressos existem, mesmo que pequenos?
4. CONTEXTO E PROGRESSO: Ajuda os leitores a compreender PORQUÊ que isto importa globalmente. Quando possível, mostra como a situação MELHOROU em relação ao passado. Liga pontos entre regiões.
5. TOM CALMO E CALOROSO: Escreve como um amigo sábio e empático a explicar as notícias. Sem alarmismo, sem sensacionalismo, sem catastrofismo. Com calma, clareza e genuíno cuidado pelo leitor.
6. PERSPECTIVA GLOBAL: Enquadra as notícias internacionalmente, destacando como comunidades em diferentes partes do mundo enfrentam desafios semelhantes.
7. EMPODERAMENTO: Termina sempre com uma nota que capacita o leitor. O que pode observar, apoiar, ou fazer? Dá razões concretas para esperança cautelosa.

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
- Resposta Humana: O que está a ser feito — acções, soluções, iniciativas, histórias de pessoas que fazem a diferença
- Perspectiva Construtiva: Um fecho que inspira — razões concretas para optimismo, o que observar, como cada pessoa pode contribuir ou participar

REGRAS:
- IDIOMA: Escreve OBRIGATORIAMENTE em português de Portugal (PT-PT), nunca em português do Brasil nem em inglês.
- COMPRIMENTO: Pelo menos {min_chars} caracteres
- FORMATO: Apenas parágrafos de texto simples. Sem HTML, sem markdown, sem listas com bullets.
- EXACTIDÃO: Indica apenas factos sustentados pelos artigos-fonte. Sem especulação.
- ORIGINALIDADE: Escreve na tua própria voz. NÃO copies frases das fontes.
- NUNCA termines um artigo com tom negativo ou de impotência. Encontra sempre uma nota de esperança, acção ou resiliência baseada nos factos.

PONTUAÇÃO DE POSITIVIDADE (sê honesto mas procura activamente o ângulo construtivo):
- 5: Inspiradora (avanços notáveis, soluções a funcionar, histórias de solidariedade e coragem humana)
- 4: Positiva (desenvolvimentos construtivos, tendências encorajadoras, progresso visível)
- 3: Equilibrada (situação complexa com desafios E respostas, contexto construtivo)
- 2: Desafiante (problemas reais, mas sempre com contexto de esforços de resposta e resiliência)
- 1: Urgente (emergência aguda, enquadrada com dignidade, contexto e foco na resposta humana)

SELECÇÃO DE IMAGEM:
- Cada artigo-fonte inclui um campo "image_urls" com TODAS as imagens disponíveis nesse artigo.
- Analisa todas as imagens disponíveis de todos os artigos-fonte.
- Escolhe a imagem que MELHOR representa o artigo sintetizado. A imagem deve ser relevante para o tema principal do texto que escreveste.
- Prefere imagens do artigo-fonte que mais contribuiu para a síntese.
- Entre várias opções, prefere a imagem mais positiva, construtiva e esperançosa — pessoas a sorrir, natureza, soluções em acção, comunidades unidas.
- NUNCA escolhas uma imagem que não tenha relação directa com o conteúdo do artigo sintetizado.
- Se nenhuma imagem for adequada, devolve null.

MOMENTO DE REFLEXÃO:
- Escreve uma reflexão curta (1-2 frases) que seja específica a ESTA notícia.
- Deve convidar o leitor a pensar sobre um aspecto concreto da história — uma acção, uma atitude, uma ideia — e como pode aplicar isso no seu dia-a-dia.
- NÃO uses frases genéricas como "Esta história mostra o melhor da humanidade". Sê concreto e ligado aos factos do artigo.
- Tom: caloroso, pessoal, como um convite gentil à reflexão.

EM RESUMO:
- Escreve 4 pontos-chave do artigo, cada um com no máximo uma frase curta.
- Devem permitir ao leitor perceber o essencial da notícia em segundos.
- Usa linguagem directa e factual, sem adjectivos desnecessários.

Formato de saída (apenas JSON):
{{
  "title": "Título claro e informativo em português, enquadramento construtivo e internacional",
  "summary": "Uma frase-resumo construtiva e esperançosa em português (máx. 200 caracteres)",
  "content": "Texto completo do artigo em português com parágrafos...",
  "positivity_score": 3,
  "image_url": "URL da imagem mais relevante ou null",
  "reflection": "Reflexão específica sobre esta notícia (1-2 frases)",
  "at_a_glance": ["Ponto-chave 1", "Ponto-chave 2", "Ponto-chave 3", "Ponto-chave 4"]
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
    prompt = CLUSTERING_PROMPT.format(titles=json.dumps(titles, indent=2, ensure_ascii=False))
    
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
    
    # Prepare article data for prompt (include all image URLs for selection)
    articles_text = json.dumps([{
        "title": a["title"],
        "summary": a["summary"][:500],
        "link": a["link"],
        "image_urls": a.get("image_urls") or ([a["image_url"]] if a.get("image_url") else [])
    } for a in matched], indent=2, ensure_ascii=False)
    
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

                # Use Claude's image choice if valid, fallback to first available
                chosen_image = result.get("image_url")
                if chosen_image and isinstance(chosen_image, str) and chosen_image.startswith("http"):
                    result["chosen_image"] = chosen_image
                else:
                    result["chosen_image"] = None
                
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
    Positive/constructive sources get extra weight to ensure more
    constructive content in the final output.
    """
    if len(articles) <= limit:
        return articles

    # Group by source, tracking which are positive sources
    by_source = {}
    positive_sources = set()
    for a in articles:
        sid = a.get("source_id", "unknown")
        by_source.setdefault(sid, []).append(a)
        if a.get("source_region") == "Positive":
            positive_sources.add(sid)

    # Round-robin: positive sources get extra picks per round
    weight = config.POSITIVE_SOURCE_WEIGHT
    balanced = []
    source_ids = list(by_source.keys())
    source_lists = [by_source[sid] for sid in source_ids]
    source_idx = [0] * len(source_lists)  # per-source index
    while len(balanced) < limit:
        added_this_round = False
        for i, source_articles in enumerate(source_lists):
            # Positive sources get 'weight' picks per round
            picks = weight if source_ids[i] in positive_sources else 1
            for _ in range(picks):
                if source_idx[i] < len(source_articles) and len(balanced) < limit:
                    balanced.append(source_articles[source_idx[i]])
                    source_idx[i] += 1
                    added_this_round = True
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
            image_url = result.get("chosen_image") or get_best_image(source_articles)
            published_at = get_latest_date(source_articles)
            original_links = [a["link"] for a in source_articles]
            reflection = result.get("reflection")
            at_a_glance = result.get("at_a_glance")

            # Save to database
            article_id = database.insert_article(
                title=result["title"],
                summary=result["summary"],
                content=result["content"],
                category=result["category"],
                positivity_score=result["positivity_score"],
                original_links=original_links,
                image_url=image_url,
                published_at=published_at,
                reflection=reflection,
                at_a_glance=at_a_glance
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

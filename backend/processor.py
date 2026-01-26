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

CLUSTERING_PROMPT = """You are organizing news articles into thematic clusters for a calm, mindful news service.

Given these article titles, group them by theme. Each cluster should have 2-7 related articles.

Categories to use:
- Diplomacy & Peace
- Conflict & Crisis
- Environment & Climate
- Health & Wellbeing
- Social Progress
- Science & Innovation
- Economy & Trade
- Culture & Arts
- Positive News
- World Affairs

Rules:
1. Group by THEME, not geography
2. Positive/uplifting articles should go to "Positive News" category
3. Create a "World Affairs" cluster for miscellaneous items
4. Each article can only be in ONE cluster

Output JSON only, no explanation:
[
  {
    "category": "Category Name",
    "articles": ["title1", "title2"]
  }
]

Article titles:
{titles}"""


SYNTHESIS_PROMPT = """You are a calm, mindful news writer. Your task is to synthesize these related articles into ONE coherent news piece.

Guidelines:
1. TONE: Calm, clear, constructive. No sensationalism or alarmism.
2. FACTS: Accurate summary of key facts. No speculation.
3. STRUCTURE: 
   - Opening paragraph with the main story
   - 2-3 paragraphs of context and details
   - Closing with constructive perspective or next steps
4. LENGTH: At least {min_chars} characters
5. FORMAT: Plain text with paragraph breaks. No HTML tags, no markdown.

Also assess the positivity of this news:
- 5: Very positive (solutions, progress, hope)
- 4: Positive (constructive, encouraging)
- 3: Neutral (balanced, factual)
- 2: Slightly negative (concerning but informative)
- 1: Negative (conflict, disaster, crisis)

Output format (JSON):
{{
  "title": "Clear, informative headline",
  "summary": "One sentence summary (max 200 chars)",
  "content": "Full article text with paragraphs...",
  "positivity_score": 3
}}

Source articles:
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
    
    category = cluster.get("category", "World Affairs")
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


def process_articles() -> Tuple[int, int]:
    """
    Main processing function.
    Fetches unprocessed articles, clusters them, synthesizes, and saves.
    Returns (processed_count, created_count).
    """
    # Get unprocessed articles
    raw_articles = database.get_unprocessed_articles(limit=config.MAX_ARTICLES)
    
    if not raw_articles:
        print("\n📭 No unprocessed articles found")
        return 0, 0
    
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

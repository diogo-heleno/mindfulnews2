"""
Mindful News v2 - Database Operations
"""

from supabase import create_client, Client
from datetime import datetime, timezone
from typing import List, Dict, Optional
import config


def get_client() -> Client:
    """Get Supabase client with service role key."""
    return create_client(config.SUPABASE_URL, config.SUPABASE_SERVICE_KEY)


def get_active_sources() -> List[Dict]:
    """Fetch all active RSS sources."""
    client = get_client()
    response = client.table("sources").select("*").eq("is_active", True).execute()
    return response.data


def update_source_fetched(source_id: str):
    """Update last_fetched_at timestamp for a source."""
    client = get_client()
    client.table("sources").update({
        "last_fetched_at": datetime.now(timezone.utc).isoformat()
    }).eq("id", source_id).execute()


def article_exists(link: str) -> bool:
    """Check if a raw article with this link already exists."""
    client = get_client()
    response = client.table("raw_articles").select("id").eq("link", link).execute()
    return len(response.data) > 0


def insert_raw_article(
    source_id: str,
    title: str,
    link: str,
    summary: str,
    image_url: Optional[str],
    published_at: datetime
) -> Optional[str]:
    """Insert a raw article. Returns ID if successful, None if duplicate."""
    if article_exists(link):
        return None
    
    client = get_client()
    response = client.table("raw_articles").insert({
        "source_id": source_id,
        "title": title,
        "link": link,
        "summary": summary or "",
        "image_url": image_url,
        "published_at": published_at.isoformat(),
        "processed": False
    }).execute()
    
    if response.data:
        return response.data[0]["id"]
    return None


def get_unprocessed_articles(limit: int = 100) -> List[Dict]:
    """Get unprocessed raw articles with source region info."""
    client = get_client()
    response = client.table("raw_articles")\
        .select("*, sources(region)")\
        .eq("processed", False)\
        .order("published_at", desc=True)\
        .limit(limit)\
        .execute()
    # Flatten the source region into the article dict
    for article in response.data:
        source_info = article.pop("sources", None)
        article["source_region"] = source_info.get("region", "Unknown") if source_info else "Unknown"
    return response.data


def mark_articles_processed(article_ids: List[str]):
    """Mark raw articles as processed."""
    client = get_client()
    for article_id in article_ids:
        client.table("raw_articles").update({
            "processed": True
        }).eq("id", article_id).execute()


def generate_slug(title: str) -> str:
    """Generate a URL-friendly slug from title."""
    import re
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'\s+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    slug = slug.strip('-')
    # Add timestamp for uniqueness
    timestamp = datetime.now(timezone.utc).strftime('%Y%m%d%H%M')
    return f"{slug[:80]}-{timestamp}"


def insert_article(
    title: str,
    summary: str,
    content: str,
    category: str,
    positivity_score: int,
    original_links: List[str],
    image_url: Optional[str],
    published_at: datetime,
    reflection: Optional[str] = None
) -> Optional[str]:
    """Insert a processed article. Returns ID if successful."""
    client = get_client()

    slug = generate_slug(title)

    data = {
        "title": title,
        "slug": slug,
        "summary": summary,
        "content": content,
        "category": category,
        "positivity_score": positivity_score,
        "original_links": original_links,
        "image_url": image_url,
        "published_at": published_at.isoformat()
    }
    if reflection:
        data["reflection"] = reflection

    response = client.table("articles").insert(data).execute()
    
    if response.data:
        return response.data[0]["id"]
    return None


def get_articles(
    min_positivity: int = 1,
    limit: int = 50,
    offset: int = 0,
    category: Optional[str] = None
) -> List[Dict]:
    """Get published articles with filtering."""
    client = get_client()
    query = client.table("articles")\
        .select("*")\
        .gte("positivity_score", min_positivity)\
        .order("published_at", desc=True)\
        .limit(limit)\
        .offset(offset)
    
    if category:
        query = query.eq("category", category)
    
    response = query.execute()
    return response.data


def get_article_by_slug(slug: str) -> Optional[Dict]:
    """Get a single article by slug."""
    client = get_client()
    response = client.table("articles").select("*").eq("slug", slug).single().execute()
    return response.data if response.data else None


def start_processing_run() -> str:
    """Start a new processing run. Returns run ID."""
    client = get_client()
    response = client.table("processing_runs").insert({
        "started_at": datetime.now(timezone.utc).isoformat(),
        "status": "running"
    }).execute()
    return response.data[0]["id"]


def complete_processing_run(
    run_id: str,
    articles_fetched: int,
    articles_processed: int,
    articles_created: int,
    status: str = "completed",
    error_message: Optional[str] = None
):
    """Complete a processing run with stats."""
    client = get_client()
    client.table("processing_runs").update({
        "completed_at": datetime.now(timezone.utc).isoformat(),
        "articles_fetched": articles_fetched,
        "articles_processed": articles_processed,
        "articles_created": articles_created,
        "status": status,
        "error_message": error_message
    }).eq("id", run_id).execute()


def cleanup_old_raw_articles(days: int = 7):
    """Delete processed raw articles older than X days."""
    client = get_client()
    cutoff = datetime.now(timezone.utc).replace(
        hour=0, minute=0, second=0, microsecond=0
    )
    cutoff = cutoff.replace(day=cutoff.day - days)
    
    client.table("raw_articles")\
        .delete()\
        .eq("processed", True)\
        .lt("created_at", cutoff.isoformat())\
        .execute()

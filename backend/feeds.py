"""
Mindful News v2 - RSS Feed Fetching
"""

import feedparser
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timezone, timedelta
from dateutil import parser as dateparser
from typing import List, Dict, Optional, Tuple
import config
import database


def fetch_og_image(url: str, timeout: int = 10) -> Optional[str]:
    """Try to fetch Open Graph image from article URL."""
    try:
        response = requests.get(url, timeout=timeout, headers={
            "User-Agent": "MindfulNews/2.0 (+https://mindfulnews.media)"
        })
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            
            # Try og:image first
            og_image = soup.find("meta", property="og:image")
            if og_image and og_image.get("content"):
                return og_image["content"]
            
            # Fallback to first large image
            for img in soup.find_all("img"):
                src = img.get("src", "")
                if src and ("http" in src) and not ("icon" in src.lower()):
                    return src
    except Exception:
        pass
    return None


def parse_published_date(entry: dict, default: datetime) -> datetime:
    """Parse published date from feed entry."""
    pub_date = entry.get("published") or entry.get("updated")
    
    if pub_date:
        try:
            parsed = dateparser.parse(pub_date)
            if parsed.tzinfo is None:
                parsed = parsed.replace(tzinfo=timezone.utc)
            return parsed
        except Exception:
            pass
    
    return default


def get_entry_image(entry: dict) -> Optional[str]:
    """Extract image URL from feed entry."""
    # Try media_content
    if hasattr(entry, "media_content") and entry.media_content:
        return entry.media_content[0].get("url")
    
    # Try media_thumbnail
    if hasattr(entry, "media_thumbnail") and entry.media_thumbnail:
        return entry.media_thumbnail[0].get("url")
    
    # Try enclosure
    if hasattr(entry, "enclosures") and entry.enclosures:
        for enc in entry.enclosures:
            if enc.get("type", "").startswith("image"):
                return enc.get("href") or enc.get("url")
    
    # Try to find image in content
    content = entry.get("summary", "") or entry.get("description", "")
    if content:
        soup = BeautifulSoup(content, "html.parser")
        img = soup.find("img")
        if img and img.get("src"):
            return img["src"]
    
    return None


def clean_summary(content: str) -> str:
    """Clean HTML from summary text."""
    if not content:
        return ""
    
    soup = BeautifulSoup(content, "html.parser")
    text = soup.get_text(separator=" ", strip=True)
    
    # Remove excessive whitespace
    import re
    text = re.sub(r'\s+', ' ', text)
    
    return text[:1000]  # Limit length


def fetch_source(source: Dict) -> Tuple[int, int]:
    """
    Fetch articles from a single RSS source.
    Returns (fetched_count, new_count).
    """
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(hours=config.FETCH_HOURS)
    
    fetched = 0
    new = 0
    
    try:
        print(f"  📡 Fetching: {source['name']}")
        feed = feedparser.parse(source["url"])
        
        for entry in feed.entries:
            fetched += 1
            
            # Parse date
            pub_date = parse_published_date(entry, now)
            
            # Skip old articles
            if pub_date < cutoff:
                continue
            
            # Get basic info
            title = entry.get("title", "").strip()
            link = entry.get("link", "").strip()
            
            if not title or not link:
                continue
            
            # Get image
            image_url = get_entry_image(entry)
            if not image_url:
                # Try to fetch from page (slow, so only if missing)
                image_url = fetch_og_image(link)
            
            # Clean summary
            summary = clean_summary(entry.get("summary", "") or entry.get("description", ""))
            
            # Insert to database
            article_id = database.insert_raw_article(
                source_id=source["id"],
                title=title,
                link=link,
                summary=summary,
                image_url=image_url,
                published_at=pub_date
            )
            
            if article_id:
                new += 1
                print(f"    ✅ New: {title[:60]}...")
        
        # Update source timestamp
        database.update_source_fetched(source["id"])
        
    except Exception as e:
        print(f"    ❌ Error fetching {source['name']}: {e}")
    
    return fetched, new


def fetch_all_sources() -> Tuple[int, int]:
    """
    Fetch articles from all active sources.
    Returns (total_fetched, total_new).
    """
    sources = database.get_active_sources()
    
    total_fetched = 0
    total_new = 0
    
    print(f"\n🌍 Fetching from {len(sources)} sources...")
    
    for source in sources:
        fetched, new = fetch_source(source)
        total_fetched += fetched
        total_new += new
    
    print(f"\n📊 Fetch complete: {total_fetched} entries checked, {total_new} new articles")
    
    return total_fetched, total_new

#!/usr/bin/env python3
"""
Mindful News v2 - Main Worker Script

This script:
1. Fetches RSS feeds from all active sources
2. Clusters related articles using Claude
3. Synthesizes clusters into coherent articles
4. Assigns positivity scores
5. Saves to Supabase

Run manually or via cron every 6 hours.
"""

import sys
from datetime import datetime, timezone

import config
import database
import feeds
import processor


VERSION = "2.0.0"


def print_banner():
    """Print startup banner."""
    print("""
╔══════════════════════════════════════════════════════════╗
║                   MINDFUL NEWS v{version}                   ║
║         A calm, constructive news aggregator             ║
╚══════════════════════════════════════════════════════════╝
    """.format(version=VERSION))


def validate_config():
    """Validate required configuration."""
    errors = []
    
    if not config.ANTHROPIC_API_KEY:
        errors.append("ANTHROPIC_API_KEY is not set")
    
    if not config.SUPABASE_URL:
        errors.append("SUPABASE_URL is not set")
    
    if not config.SUPABASE_SERVICE_KEY:
        errors.append("SUPABASE_SERVICE_KEY is not set")
    
    if errors:
        print("❌ Configuration errors:")
        for error in errors:
            print(f"   - {error}")
        sys.exit(1)
    
    print("✅ Configuration validated")


def run_pipeline():
    """Run the complete news processing pipeline."""
    start_time = datetime.now(timezone.utc)
    print(f"\n🚀 Starting pipeline at {start_time.strftime('%Y-%m-%d %H:%M:%S UTC')}")
    
    # Start processing run
    run_id = database.start_processing_run()
    
    try:
        # Step 1: Fetch RSS feeds
        print("\n" + "="*60)
        print("STEP 1: FETCHING RSS FEEDS")
        print("="*60)
        
        fetched, new = feeds.fetch_all_sources()
        
        # Step 2: Process articles with Claude
        print("\n" + "="*60)
        print("STEP 2: PROCESSING WITH CLAUDE")
        print("="*60)
        
        processed, created = processor.process_articles()
        
        # Step 3: Cleanup old raw articles
        print("\n" + "="*60)
        print("STEP 3: CLEANUP")
        print("="*60)
        
        database.cleanup_old_raw_articles(days=7)
        print("✅ Cleaned up old raw articles")
        
        # Complete run
        database.complete_processing_run(
            run_id=run_id,
            articles_fetched=fetched,
            articles_processed=processed,
            articles_created=created,
            status="completed"
        )
        
        # Summary
        end_time = datetime.now(timezone.utc)
        duration = (end_time - start_time).total_seconds()
        
        print("\n" + "="*60)
        print("PIPELINE COMPLETE")
        print("="*60)
        print(f"""
📊 Summary:
   - Articles fetched: {fetched}
   - New articles: {new}
   - Articles processed: {processed}
   - Articles created: {created}
   - Duration: {duration:.1f} seconds
        """)
        
        return True
        
    except Exception as e:
        # Log error
        database.complete_processing_run(
            run_id=run_id,
            articles_fetched=0,
            articles_processed=0,
            articles_created=0,
            status="failed",
            error_message=str(e)
        )
        
        print(f"\n❌ Pipeline failed: {e}")
        raise


def main():
    """Main entry point."""
    print_banner()
    validate_config()
    
    try:
        success = run_pipeline()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n⚠️ Pipeline interrupted by user")
        sys.exit(130)
    except Exception as e:
        print(f"\n❌ Fatal error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()

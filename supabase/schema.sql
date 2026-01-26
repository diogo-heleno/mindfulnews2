-- Mindful News v2 - Database Schema
-- Run this in your Supabase SQL Editor

-- ===================
-- Extensions
-- ===================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================
-- Tables
-- ===================

-- RSS Feed Sources
CREATE TABLE IF NOT EXISTS sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    region TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_fetched_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Processed Articles
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Content
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    
    -- Metadata
    category TEXT NOT NULL,
    positivity_score INTEGER NOT NULL CHECK (positivity_score >= 1 AND positivity_score <= 5),
    
    -- Source info
    original_links TEXT[] NOT NULL DEFAULT '{}',
    image_url TEXT,
    
    -- Timestamps
    published_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Raw articles (before processing) - for deduplication
CREATE TABLE IF NOT EXISTS raw_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    link TEXT NOT NULL UNIQUE,
    summary TEXT,
    image_url TEXT,
    
    published_at TIMESTAMPTZ NOT NULL,
    processed BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Processing runs log
CREATE TABLE IF NOT EXISTS processing_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    
    articles_fetched INTEGER DEFAULT 0,
    articles_processed INTEGER DEFAULT 0,
    articles_created INTEGER DEFAULT 0,
    
    status TEXT DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed')),
    error_message TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================
-- Indexes
-- ===================

CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_positivity ON articles(positivity_score);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);

CREATE INDEX IF NOT EXISTS idx_raw_articles_processed ON raw_articles(processed);
CREATE INDEX IF NOT EXISTS idx_raw_articles_published ON raw_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_articles_link ON raw_articles(link);

CREATE INDEX IF NOT EXISTS idx_sources_active ON sources(is_active);

-- ===================
-- Functions
-- ===================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Generate URL-friendly slug from title
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
DECLARE
    slug TEXT;
BEGIN
    -- Convert to lowercase, replace spaces with hyphens, remove special chars
    slug := lower(title);
    slug := regexp_replace(slug, '[^a-z0-9\s-]', '', 'g');
    slug := regexp_replace(slug, '\s+', '-', 'g');
    slug := regexp_replace(slug, '-+', '-', 'g');
    slug := trim(both '-' from slug);
    
    -- Add timestamp suffix for uniqueness
    slug := slug || '-' || to_char(NOW(), 'YYYYMMDDHH24MI');
    
    RETURN slug;
END;
$$ language 'plpgsql';

-- ===================
-- Triggers
-- ===================

CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON articles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sources_updated_at
    BEFORE UPDATE ON sources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===================
-- Row Level Security
-- ===================

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE raw_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE processing_runs ENABLE ROW LEVEL SECURITY;

-- Public read access for articles
CREATE POLICY "Articles are publicly readable"
    ON articles FOR SELECT
    USING (true);

-- Public read access for sources (for transparency)
CREATE POLICY "Sources are publicly readable"
    ON sources FOR SELECT
    USING (true);

-- Service role only for writes
CREATE POLICY "Service role can insert articles"
    ON articles FOR INSERT
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update articles"
    ON articles FOR UPDATE
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete articles"
    ON articles FOR DELETE
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage sources"
    ON sources FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage raw_articles"
    ON raw_articles FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage processing_runs"
    ON processing_runs FOR ALL
    USING (auth.role() = 'service_role');

-- ===================
-- Views
-- ===================

-- Public articles view with computed fields
CREATE OR REPLACE VIEW public_articles AS
SELECT 
    id,
    title,
    slug,
    summary,
    content,
    category,
    positivity_score,
    CASE 
        WHEN positivity_score >= 4 THEN 'uplifting'
        WHEN positivity_score >= 3 THEN 'balanced'
        ELSE 'cautionary'
    END as tone,
    image_url,
    original_links,
    published_at,
    created_at
FROM articles
ORDER BY published_at DESC;

-- Stats view
CREATE OR REPLACE VIEW articles_stats AS
SELECT 
    COUNT(*) as total_articles,
    COUNT(*) FILTER (WHERE positivity_score >= 4) as uplifting_count,
    COUNT(*) FILTER (WHERE positivity_score = 3) as neutral_count,
    COUNT(*) FILTER (WHERE positivity_score < 3) as cautionary_count,
    COUNT(DISTINCT category) as categories_count,
    MIN(published_at) as oldest_article,
    MAX(published_at) as newest_article
FROM articles;

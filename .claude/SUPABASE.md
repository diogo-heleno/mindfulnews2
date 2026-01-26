# Supabase Documentation

Database schema, configuration, and operations for Mindful News v2.

## Setup

1. Open the Supabase SQL Editor
2. Run `supabase/schema.sql` — creates everything (tables, indexes, RLS, views, functions)
3. Run `supabase/seed.sql` — inserts 22 RSS feed sources

## Tables

### `sources` — RSS Feed Sources

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | TEXT | Human-readable feed name |
| `url` | TEXT | RSS feed URL (unique) |
| `region` | TEXT | Geographic region |
| `is_active` | BOOLEAN | Whether to fetch from this source |
| `last_fetched_at` | TIMESTAMPTZ | Last successful fetch time |
| `created_at` | TIMESTAMPTZ | Row creation time |
| `updated_at` | TIMESTAMPTZ | Auto-updated on change |

**Regions**: Europe, Middle East, Africa, Asia, Americas, Pacific, Positive

### `articles` — Processed Articles (Public)

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `title` | TEXT | Synthesized article title |
| `slug` | TEXT | URL-friendly slug (unique) |
| `summary` | TEXT | Short summary |
| `content` | TEXT | Full article content |
| `category` | TEXT | News category |
| `positivity_score` | INTEGER | 1 (negative) to 5 (very positive) |
| `original_links` | TEXT[] | Array of source article URLs |
| `image_url` | TEXT | Featured image URL |
| `published_at` | TIMESTAMPTZ | Publication timestamp |
| `created_at` | TIMESTAMPTZ | Row creation time |
| `updated_at` | TIMESTAMPTZ | Auto-updated on change |

**Categories**: Climate & Environment, Technology & Innovation, Global Politics, Economy & Business, Health & Science, Conflict & Security, Society & Culture, Education & Development, Energy & Resources, Sports & Entertainment

### `raw_articles` — Temporary Storage

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `source_id` | UUID | FK to `sources.id` |
| `title` | TEXT | Original article title |
| `link` | TEXT | Original article URL (unique) |
| `summary` | TEXT | Original article summary |
| `image_url` | TEXT | Original image URL |
| `published_at` | TIMESTAMPTZ | Original publish date |
| `processed` | BOOLEAN | Whether it's been processed |
| `created_at` | TIMESTAMPTZ | Row creation time |

Raw articles are cleaned up 7 days after processing.

### `processing_runs` — Execution Log

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `started_at` | TIMESTAMPTZ | Run start time |
| `completed_at` | TIMESTAMPTZ | Run end time |
| `articles_fetched` | INTEGER | RSS articles fetched |
| `articles_processed` | INTEGER | Articles sent to Claude |
| `articles_created` | INTEGER | Synthesized articles created |
| `status` | TEXT | `running`, `completed`, or `failed` |
| `error_message` | TEXT | Error details (if failed) |

## Views

### `public_articles`

Adds a computed `tone` field based on positivity score:
- Score >= 4 → `'uplifting'`
- Score >= 3 → `'balanced'`
- Score < 3 → `'cautionary'`

### `articles_stats`

Aggregate statistics:
- `total_articles`: Total count
- `uplifting_count`: Score >= 4
- `neutral_count`: Score = 3
- `cautionary_count`: Score < 3
- `categories_count`: Distinct categories
- `oldest_article` / `newest_article`: Date range

## Row Level Security (RLS)

All tables have RLS enabled.

| Table | Public (anon) | Service Role |
|-------|--------------|-------------|
| `articles` | SELECT | ALL |
| `sources` | SELECT | ALL |
| `raw_articles` | None | ALL |
| `processing_runs` | None | ALL |

The frontend uses the **anon key** (read-only). The backend uses the **service key** (full access).

## Keys

- **Anon Key**: Safe to expose in frontend. Only allows SELECT on articles and sources.
- **Service Key**: Secret. Used by backend. Allows all operations on all tables. Never expose publicly.

## Useful Queries

### Check recent processing runs
```sql
SELECT id, started_at, completed_at, articles_fetched, articles_processed,
       articles_created, status, error_message
FROM processing_runs
ORDER BY started_at DESC
LIMIT 10;
```

### Check article statistics
```sql
SELECT * FROM articles_stats;
```

### Check active sources
```sql
SELECT name, url, region, last_fetched_at
FROM sources
WHERE is_active = true
ORDER BY region, name;
```

### Check unprocessed raw articles
```sql
SELECT COUNT(*) as pending FROM raw_articles WHERE processed = false;
```

### Articles by category
```sql
SELECT category, COUNT(*) as count
FROM articles
GROUP BY category
ORDER BY count DESC;
```

### Articles by positivity score
```sql
SELECT positivity_score, COUNT(*) as count
FROM articles
GROUP BY positivity_score
ORDER BY positivity_score DESC;
```

### Clean up old raw articles manually
```sql
DELETE FROM raw_articles
WHERE processed = true
AND created_at < NOW() - INTERVAL '7 days';
```

## RSS Feed Sources (Seed Data)

| Region | Sources |
|--------|---------|
| Europe | Euronews, Politico EU, The Guardian, Reuters, Observador |
| Middle East | Al Jazeera, Reuters ME, France24 ME |
| Africa | Africanews, AllAfrica |
| Asia | SCMP, Reuters Asia |
| Americas | BBC Mundo |
| Pacific | ABC Australia |
| Positive | Positive News, Good Good Good, Reasons to be Cheerful, Yes Magazine, Science Daily (Environment + Health) |

To add a new source:
```sql
INSERT INTO sources (name, url, region, is_active)
VALUES ('Source Name', 'https://example.com/rss', 'Region', true);
```

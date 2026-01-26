# Coolify Deployment Guide

This guide explains how to deploy Mindful News v2 using Coolify.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Coolify                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌──────────────┐         ┌──────────────────────────┐    │
│   │   Frontend   │         │   Supabase (self-hosted)  │    │
│   │   (Next.js)  │◄───────►│   - PostgreSQL            │    │
│   │   Port 3000  │         │   - Auth                  │    │
│   └──────────────┘         │   - API                   │    │
│                            └──────────────────────────┘    │
│   ┌──────────────┐                    ▲                    │
│   │   Backend    │                    │                    │
│   │   (Python)   │────────────────────┘                    │
│   │   Cron Job   │         ┌──────────────────┐           │
│   └──────────────┘         │   Claude API     │           │
│          │                 │   (External)     │           │
│          └─────────────────►                  │           │
│                            └──────────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Steps

### 1. Prepare Supabase

1. In your Supabase instance, run the SQL files:
   - `supabase/schema.sql` - Creates tables, indexes, RLS policies
   - `supabase/seed.sql` - Adds initial RSS feed sources

2. Note down your Supabase credentials:
   - URL: `https://your-project.supabase.co`
   - Anon Key: For frontend (public, read-only)
   - Service Key: For backend (private, full access)

### 2. Deploy Frontend

1. Create a new service in Coolify
2. Select "Docker Compose" or "Dockerfile"
3. Point to the `frontend/` directory
4. Set environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   NEXT_PUBLIC_SITE_URL=https://mindfulnews.media
   ```
5. Configure domain: `mindfulnews.media`
6. Enable HTTPS (Let's Encrypt)
7. Deploy

### 3. Deploy Backend Worker

The backend is a cron job, not a long-running service.

**Option A: Coolify Scheduled Jobs**

1. Create a new scheduled job in Coolify
2. Schedule: `0 */6 * * *` (every 6 hours)
3. Command: `docker compose run --rm backend`
4. Set environment variables:
   ```
   ANTHROPIC_API_KEY=sk-ant-api03-...
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=eyJ...
   FETCH_HOURS=12
   MAX_ARTICLES=50
   MIN_CHARACTERS=2000
   ```

**Option B: System Cron**

1. Build the backend image:
   ```bash
   cd backend
   docker build -t mindfulnews-backend .
   ```

2. Add to system crontab:
   ```bash
   crontab -e
   ```
   
   Add:
   ```
   0 */6 * * * docker run --rm \
     -e ANTHROPIC_API_KEY=sk-ant-api03-... \
     -e SUPABASE_URL=https://your-project.supabase.co \
     -e SUPABASE_SERVICE_KEY=eyJ... \
     mindfulnews-backend
   ```

### 4. Test Deployment

1. Visit your domain to check the frontend
2. Manually trigger the backend to test:
   ```bash
   docker compose run --rm backend
   ```
3. Verify articles appear on the frontend
4. Test RSS feeds:
   - `https://mindfulnews.media/feed.xml`
   - `https://mindfulnews.media/feed.xml?filter=uplifting`
   - `https://mindfulnews.media/feed.xml?filter=all`

## Environment Variables Reference

### Frontend
| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | Yes |
| `NEXT_PUBLIC_SITE_URL` | Your site URL | Yes |

### Backend
| Variable | Description | Default |
|----------|-------------|---------|
| `ANTHROPIC_API_KEY` | Claude API key | Required |
| `SUPABASE_URL` | Supabase project URL | Required |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | Required |
| `FETCH_HOURS` | Hours back to fetch articles | 12 |
| `MAX_ARTICLES` | Max articles per run | 50 |
| `MIN_CHARACTERS` | Min chars per synthesized article | 2000 |

## Monitoring

### Backend Logs

Check the `processing_runs` table in Supabase for run history:

```sql
SELECT * FROM processing_runs ORDER BY started_at DESC LIMIT 10;
```

### Article Stats

```sql
SELECT * FROM articles_stats;
```

## Troubleshooting

### No articles appearing

1. Check backend logs for errors
2. Verify Supabase credentials are correct
3. Ensure RSS sources are active: `SELECT * FROM sources WHERE is_active = true`
4. Check `raw_articles` table for fetched content

### Backend fails

1. Check Claude API key is valid
2. Verify Supabase service key has write permissions
3. Check network connectivity to RSS feeds

### Frontend errors

1. Verify anon key allows read access
2. Check RLS policies are correctly set
3. Ensure articles exist in database

## Cost Estimates

- **Claude API**: ~$0.50-2.00 per run (depends on article count)
- **Supabase**: Free tier usually sufficient
- **VPS**: €5-10/month for Coolify hosting

## Updates

To update the deployment:

```bash
git pull
docker compose build
docker compose up -d
```

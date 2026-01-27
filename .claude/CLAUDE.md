# Claude Code Project Guide

Instructions and context for Claude Code when working on this project.

## Project Overview

Mindful News v2 is a constructive news aggregator that seeks the best of humanity. It fetches international news from RSS feeds (with emphasis on constructive/solutions journalism sources), clusters related articles by theme, rewrites them with a mindful and hopeful tone using Claude API, and assigns positivity scores (1-5). The philosophy: inform without depressing, alert without alarming, inspire action without creating anxiety.

## Tech Stack

- **Backend**: Python 3.11 (one-shot cron worker, not a server)
- **Frontend**: Next.js 14.2.5, React 18, TypeScript 5.5, Tailwind CSS 3.4
- **Database**: Supabase (PostgreSQL) with RLS
- **AI**: Claude Sonnet (`claude-sonnet-4-20250514`) for clustering + synthesis
- **Deployment**: Docker multi-stage builds, Coolify on VPS

## Project Structure

```
mindfulnews2/
├── backend/           # Python worker (runs every 4 hours)
│   ├── main.py        # Entry point, orchestrates 5-step pipeline
│   ├── config.py      # Environment config, constants
│   ├── feeds.py       # RSS fetching, parsing, image extraction
│   ├── processor.py   # Claude API prompts, clustering, synthesis
│   └── database.py    # Supabase CRUD operations
├── frontend/          # Next.js app
│   ├── src/app/       # App Router pages
│   ├── src/components/ # React components
│   ├── src/lib/       # supabase.ts, utils.ts
│   └── Dockerfile     # Multi-stage build (deps → builder → runner)
├── supabase/
│   ├── schema.sql     # Tables, indexes, RLS, views, functions
│   └── seed.sql       # 34 RSS sources (14 international + 13 constructive + 7 general)
├── docker-compose.yml
└── .env.example
```

## Key Conventions

- Frontend uses `output: 'standalone'` in `next.config.js` for Docker
- All colors use custom Tailwind palette: `cream`, `sage`, `ocean`, `stone`
- The backend is NOT a long-running service - it's a one-shot job
- Positivity scores: 1 (urgente) to 5 (inspiradora) - always constructive framing
- Filter modes: uplifting/inspiradoras (>=4, default), balanced/equilibradas (>=3), all/todas (>=1)
- Positive news sources get 2x weight in article selection
- Synthesis prompt has dual modes: CONSTRUTIVO (positive sources) and FACTUAL (general sources)
- Source regions: Europe, Middle East, Africa, Asia, Americas, Pacific, Positive, General

## Common Pitfalls

- `npm ci` (not `npm ci install`) in Dockerfile
- `frontend/public/` must exist for Docker COPY stage
- Tailwind custom colors must be complete (50-900) if referenced in CSS
- TypeScript: use `Array.from(new Set(...))` instead of `[...new Set(...)]` to avoid downlevelIteration issues
- The `package-lock.json` must be committed for `npm ci` to work

## Build & Test

```bash
# Frontend local dev
cd frontend && npm install && npm run dev

# Backend local run
cd backend && pip install -r requirements.txt && python main.py

# Docker build
docker compose build
docker compose up frontend    # long-running
docker compose run --rm backend  # one-shot
```

## Environment Variables

See `.env.example` for all required variables. Key ones:
- `ANTHROPIC_API_KEY` - Claude API (backend only)
- `SUPABASE_URL` / `SUPABASE_SERVICE_KEY` - Backend DB access
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Frontend DB access
- `NEXT_PUBLIC_SITE_URL` - Public URL for SEO/RSS

## Documentation

All project documentation is in `.claude/`:
- `CHANGELOG.md` - Change history
- `DECISIONS.md` - Architecture decisions
- `DEPLOYMENT.md` - Coolify deployment guide
- `TODO.md` - Pending tasks
- `TROUBLESHOOTING.md` - Known issues and fixes
- `SUPABASE.md` - Database documentation

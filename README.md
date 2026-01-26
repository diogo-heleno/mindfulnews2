# Mindful News v2

A calm, constructive news aggregator that rewrites international news in a mindful tone.

## Stack

- **Backend Worker**: Python + Claude API
- **Database**: Supabase (self-hosted)
- **Frontend**: Next.js 14
- **Deployment**: Coolify on VPS

## Features

- Fetches news from international RSS feeds
- Clusters related articles by theme
- Rewrites in calm, constructive tone using Claude API
- Assigns positivity score (1-5) to each article
- Filterable feed: "Uplifting", "Balanced", "All News"
- Dynamic RSS feed generation

## Project Structure

```
mindfulnews-v2/
├── backend/
│   ├── main.py              # Main worker script
│   ├── config.py            # Configuration
│   ├── feeds.py             # RSS feed fetching
│   ├── processor.py         # Claude API processing
│   ├── database.py          # Supabase operations
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   ├── components/      # React components
│   │   └── lib/             # Utilities
│   ├── package.json
│   └── Dockerfile
├── supabase/
│   ├── schema.sql           # Database schema
│   └── seed.sql             # Initial feeds data
├── docker-compose.yml
└── .env.example
```

## Setup

### 1. Environment Variables

Copy `.env.example` to `.env` and fill in:

```bash
cp .env.example .env
```

### 2. Database Setup

Run the SQL files in your Supabase instance:

```bash
# In Supabase SQL Editor, run:
# 1. supabase/schema.sql
# 2. supabase/seed.sql
```

### 3. Deploy with Coolify

1. Create a new project in Coolify
2. Add the repository
3. Set environment variables
4. Deploy both services (backend + frontend)

### 4. Manual Local Development

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py

# Frontend
cd frontend
npm install
npm run dev
```

## Positivity Scores

- **5**: Very positive, uplifting, solutions-focused
- **4**: Positive, constructive tone
- **3**: Neutral, balanced reporting
- **2**: Slightly negative but informative
- **1**: Negative news (conflicts, disasters)

## Filter Modes

- **Uplifting** (score >= 4): Only positive news
- **Balanced** (score >= 3): Positive and neutral
- **All News** (score >= 1): Everything

## Update Frequency

The backend worker runs every 6 hours (4x per day).

## License

MIT

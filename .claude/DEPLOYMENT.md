# Deployment Guide (Coolify)

Step-by-step guide for deploying Mindful News v2 on Coolify.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Coolify (VPS)                        │
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

## Prerequisites

1. A VPS with Coolify installed
2. A Supabase instance (self-hosted or cloud)
3. An Anthropic API key for Claude
4. A domain name pointed to your VPS

## Step 1: Prepare Supabase

1. Open the Supabase SQL Editor
2. Run `supabase/schema.sql` — creates tables, indexes, RLS policies, views
3. Run `supabase/seed.sql` — inserts 27 RSS feed sources (14 international + 13 constructive/positive)
4. Note down credentials:
   - **URL**: `https://your-project.supabase.co`
   - **Anon Key**: For frontend (public, read-only)
   - **Service Key**: For backend (private, full access)

See `.claude/SUPABASE.md` for detailed database documentation.

## Step 2: Deploy Frontend

1. In Coolify, create a new service
2. Select "Dockerfile" and point to the repository
3. Set **Base Directory** to `frontend/`
4. Configure build arguments:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   NEXT_PUBLIC_SITE_URL=https://mindfulnews.media
   ```
5. Configure domain: `mindfulnews.media`
6. Enable HTTPS via Let's Encrypt
7. Deploy

The frontend Dockerfile uses a multi-stage build:
- **deps**: Installs npm dependencies with `npm ci`
- **builder**: Copies source and runs `next build`
- **runner**: Minimal production image with standalone output

## Step 3: Deploy Backend Worker

The backend is a one-shot cron job, NOT a long-running service.

### Recommended: Coolify Scheduled Job

1. In Coolify, create a new scheduled job
2. Schedule: `0 */4 * * *` (every 4 hours)
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

### Alternative: System Cron

```bash
# Build image
cd backend && docker build -t mindfulnews-backend .

# Add to crontab
crontab -e
# Add line:
0 */4 * * * docker run --rm \
  -e ANTHROPIC_API_KEY=sk-ant-api03-... \
  -e SUPABASE_URL=https://your-project.supabase.co \
  -e SUPABASE_SERVICE_KEY=eyJ... \
  mindfulnews-backend
```

Coolify Scheduled Jobs is preferred over system cron — see `.claude/DECISIONS.md` for rationale.

## Step 4: Verify Deployment

1. Visit your domain to check the frontend loads
2. Manually trigger the backend:
   ```bash
   docker compose run --rm backend
   ```
3. Verify articles appear on the frontend
4. Test RSS feeds:
   - `https://mindfulnews.media/feed.xml`
   - `https://mindfulnews.media/feed.xml?filter=uplifting`
   - `https://mindfulnews.media/feed.xml?filter=all`

## Environment Variables

### Frontend

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | Yes |
| `NEXT_PUBLIC_SITE_URL` | Public site URL | Yes |

### Backend

| Variable | Description | Default |
|----------|-------------|---------|
| `ANTHROPIC_API_KEY` | Claude API key | Required |
| `SUPABASE_URL` | Supabase project URL | Required |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | Required |
| `FETCH_HOURS` | Hours back to fetch articles | `12` |
| `MAX_ARTICLES` | Max articles per run | `50` |
| `MIN_CHARACTERS` | Min chars per synthesized article | `2000` |

## Monitoring

### Processing Runs

```sql
SELECT * FROM processing_runs ORDER BY started_at DESC LIMIT 10;
```

### Article Stats

```sql
SELECT * FROM articles_stats;
```

## VPS Operations

The project is deployed at `/opt/mindfulnews2` on the VPS (Ubuntu).

### Atualizar código na VPS

```bash
cd /opt/mindfulnews2
git pull origin main
```

### Reconstruir e relançar o frontend

```bash
cd /opt/mindfulnews2
docker compose build frontend
docker compose up -d frontend
```

### Correr o backend manualmente (atualizar notícias)

```bash
cd /opt/mindfulnews2
docker compose run --rm backend
```

O backend demora ~3 minutos, processa ~50 artigos e cria ~5-9 artigos sintetizados por execução.

### Configurar cron job (execução automática)

```bash
crontab -e
# Adicionar a linha:
0 */4 * * * cd /opt/mindfulnews2 && docker compose run --rm backend >> /var/log/mindfulnews.log 2>&1
```

Isto corre o backend a cada 4 horas (00:00, 04:00, 08:00, 12:00, 16:00, 20:00 UTC).

**Nota**: O ficheiro de log em `/var/log/` requer permissões para o user do cron:
```bash
sudo touch /var/log/mindfulnews.log
sudo chown diogo:diogo /var/log/mindfulnews.log
```

### Verificar se o backend correu

```sql
-- Últimas execuções
SELECT started_at, status, articles_created, error_message
FROM processing_runs ORDER BY started_at DESC LIMIT 5;

-- Estatísticas gerais
SELECT * FROM articles_stats;

-- Fontes que nunca foram fetched
SELECT name, region FROM sources
WHERE is_active = true AND last_fetched_at IS NULL;
```

## Cost Estimates

- **Claude API**: ~$0.50-2.00 per run (depends on article count)
- **Supabase**: Free tier usually sufficient
- **VPS**: ~$5-10/month for Coolify hosting

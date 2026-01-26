# Architecture Decisions

Record of key design decisions for Mindful News v2.

## ADR-001: One-Shot Backend Worker (Not a Server)

**Decision**: The backend is a cron job that runs every 6 hours, not a long-running API server.

**Rationale**: The backend only needs to fetch RSS feeds, process them with Claude, and write to Supabase. There's no need for an HTTP server. A cron job is simpler, cheaper (no idle compute), and easier to debug. The frontend reads directly from Supabase.

**Consequence**: Backend uses `restart: "no"` in Docker Compose. Must be triggered externally (Coolify scheduled job or system cron).

## ADR-002: Supabase as Shared Database

**Decision**: Both frontend and backend connect directly to Supabase. No backend API layer.

**Rationale**: Supabase provides a REST API, auth, and RLS policies out of the box. The frontend uses the anon key (read-only), the backend uses the service key (full access). This eliminates the need for a custom API and simplifies the architecture.

**Consequence**: RLS policies are critical for security. The anon key must only allow SELECT on `articles` and `sources`.

## ADR-003: Claude API for Content Processing

**Decision**: Use Claude Sonnet for both article clustering and synthesis.

**Rationale**: Two-stage pipeline: (1) cluster related articles by theme, (2) synthesize each cluster into a single mindful article. Claude produces high-quality, constructive rewrites with consistent tone.

**Consequence**: Each run costs ~$0.50-2.00 in API calls. The `processor.py` prompts are carefully tuned and should be modified with care.

## ADR-004: Next.js Standalone Output

**Decision**: Use `output: 'standalone'` in `next.config.js`.

**Rationale**: Produces a minimal production build that includes only the necessary files. This reduces the Docker image size significantly compared to copying the full `node_modules`.

**Consequence**: The Dockerfile must copy `.next/standalone` and `.next/static` separately. The `public/` directory must also be copied explicitly.

## ADR-005: Custom Tailwind Color Palette

**Decision**: Use a custom calm color palette (`cream`, `sage`, `ocean`, `stone`) instead of Tailwind defaults.

**Rationale**: The project's identity is built around calmness and mindfulness. Default Tailwind colors (blue, red, green) feel generic. The custom palette reinforces the brand: earthy greens, warm creams, and soft ocean blues.

**Consequence**: All color shades (50-900) must be defined if referenced. Custom colors are in `tailwind.config.js`.

## ADR-006: Positivity Scoring System

**Decision**: Each article receives a positivity score from 1-5, assigned by Claude during synthesis.

**Rationale**: Allows users to filter news by emotional tone. Score 5 = very positive/uplifting, score 1 = negative/distressing. This is the core differentiator of Mindful News.

**Consequence**: The scoring prompt in `processor.py` must be carefully maintained. Filter modes map to score thresholds: uplifting (>=4), balanced (>=3), all (>=1).

## ADR-007: Dynamic RSS Feed Generation

**Decision**: The RSS feed (`/feed.xml`) is generated dynamically via a Next.js route handler, with query parameter filtering.

**Rationale**: Allows users to subscribe to filtered feeds (e.g., only uplifting news). Static RSS generation would require rebuilding on every article update.

**Consequence**: The route handler queries Supabase on each request. Cache headers (`max-age=3600`) prevent excessive DB queries.

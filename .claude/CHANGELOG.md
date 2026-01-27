# Changelog

All notable changes to Mindful News v2.

## [2026-01-27] - Documentation Update

### Fixed
- **TODO.md**: Marked RSS feed verification as complete — all 25 active sources are being fetched successfully.
- **TODO.md**: Corrected cron interval from 6h to 4h (matches actual `crontab` config).
- **DEPLOYMENT.md**: Updated seed source count from 22 to 27 (14 international + 13 constructive/positive).
- **DEPLOYMENT.md**: Corrected cron schedule from `*/6` to `*/4` across all examples.
- **DEPLOYMENT.md**: Added note about log file permissions for `/var/log/mindfulnews.log`.

### Added
- **TROUBLESHOOTING.md**: Added `Could not find column in schema cache` issue (PostgREST PGRST204 error after `ALTER TABLE`), with fix via `NOTIFY pgrst, 'reload schema'`.
- **TROUBLESHOOTING.md**: Added cron log file permissions issue (`/var/log/` owned by root), with fix via `chown` or alternative log path.

## [2026-01-26] - Mindful Experience Enhancement

### Changed
- **Synthesis prompt**: Strengthened constructive journalism principles with explicit focus on human stories, resilience, hope, and actionable insights. Articles now always end with a note of empowerment.
- **Clustering prompt**: Added "Historias Humanas" category for stories of kindness, solidarity, and courage. Clustering now actively seeks constructive angles and ensures at least one positive cluster per batch.
- **Positivity scale**: Updated terminology from negative framing (Negativa/Preocupante) to constructive framing (Urgente/Desafiante/Equilibrada/Positiva/Inspiradora).
- **Default filter**: Changed from "balanced" (score >= 3) to "uplifting" (score >= 4) so readers see the best of humanity first.
- **FilterBar**: Updated labels ("Inspiradoras", not "Positivas") and descriptions to be more mindful and inviting.
- **Homepage tagline**: "O melhor da humanidade, todos os dias."
- **Site description**: Updated to reflect the positive mission.
- **Source balancing**: Positive/constructive news sources now get 2x weight in the round-robin article selection algorithm.

### Added
- **5 new constructive news sources**: Good News Network, The Optimist Daily, Global Citizen, Borgen Magazine, and Guardian Global Development (total: 27 sources, 11 positive).
- **"Destaque Positivo" section**: Homepage now features a prominent highlight of the most inspiring recent article, displayed above the article list.
- **"Momento de Reflexao" section**: Each article page now ends with a mindful reflection prompt that adapts to the article's positivity score, encouraging readers to find hope and actionable takeaways.
- **Positivity visual indicators**: Article cards now show subtle sun (inspirational) or heart (positive) icons next to category badges for highly rated articles.
- **`getPositivityIndicator` utility**: New helper function for mapping positivity scores to visual icons.
- **`getMostInspiringArticle` query**: New Supabase query to fetch the highest-positivity most recent article.
- **`DailyHighlight` component**: New homepage component for the positive article spotlight.
- **`POSITIVE_SOURCE_WEIGHT` config**: Configurable weight multiplier for constructive news sources in the balancing algorithm (default: 2).

## [2026-01-26] - Deployment Fixes

### Fixed
- **Docker build: `npm ci install` syntax** - Changed `npm ci install` to `npm ci` in `frontend/Dockerfile`. The word "install" is not a valid argument to `npm ci`.
- **Missing `package-lock.json`** - Generated `frontend/package-lock.json` required by `npm ci` for deterministic installs.
- **Tailwind CSS: missing sage color shades** - Added `sage-800` (`#2D442D`) and `sage-900` (`#1A2E1A`) to `frontend/tailwind.config.js`. The `globals.css` used `text-sage-900` but the palette only went up to `700`.
- **TypeScript Set iteration error** - Changed `[...new Set(...)]` to `Array.from(new Set(...))` in `frontend/src/lib/supabase.ts:89` to avoid `--downlevelIteration` requirement.
- **Missing `public/` directory** - Created `frontend/public/.gitkeep` so the Dockerfile `COPY --from=builder /app/public ./public` stage doesn't fail.

## [2026-01-26] - Initial Upload

### Added
- Backend Python worker with Claude API integration
- Frontend Next.js 14 application
- Supabase schema and seed data
- Docker Compose configuration
- 22 RSS feed sources across 7 regions

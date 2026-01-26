# Changelog

All notable changes to Mindful News v2.

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

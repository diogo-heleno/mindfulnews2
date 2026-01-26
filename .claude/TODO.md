# TODO

Pending tasks and improvements for Mindful News v2.

## High Priority

- [ ] Upgrade Next.js from 14.2.5 to latest patched version (security vulnerability: https://nextjs.org/blog/security-update-2025-12-11)
- [ ] Set up Coolify scheduled job for backend worker (every 6 hours)
- [ ] Verify all 22 RSS feed sources are accessible and returning data
- [ ] Test full pipeline end-to-end: fetch → cluster → synthesize → display

## Medium Priority

- [ ] Add error alerting (email/webhook) when backend processing fails
- [ ] Add favicon and Open Graph image to `frontend/public/`
- [ ] Implement article search functionality
- [ ] Add pagination to article detail page (next/previous article)
- [ ] Consider adding `sitemap.xml` for SEO

## Low Priority

- [ ] Remove Docker ARG/ENV warnings for secrets (use Docker BuildKit secrets instead)
- [ ] Add health check endpoint for backend monitoring
- [ ] Implement article caching in frontend to reduce Supabase queries
- [ ] Add dark mode support
- [ ] Add multi-language support (PT, EN, FR)
- [ ] Add article sharing buttons (Twitter, LinkedIn, email)

## Technical Debt

- [ ] Add frontend unit tests
- [ ] Add backend integration tests
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Add rate limiting for RSS feed endpoint
- [ ] Review and optimize Supabase RLS policies

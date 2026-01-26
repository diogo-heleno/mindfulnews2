-- Mindful News v2 - Seed Data
-- Run this after schema.sql

-- ===================
-- RSS Feed Sources
-- ===================

INSERT INTO sources (name, url, region, is_active) VALUES
-- Europe
('Euronews World', 'https://www.euronews.com/rss?level=theme&name=world', 'Europe', true),
('Politico EU', 'https://www.politico.eu/feed/', 'Europe', true),
('The Guardian World', 'https://www.theguardian.com/world/rss', 'Europe', true),
('Reuters World', 'https://www.reuters.com/rssFeed/worldNews', 'Europe', true),
('Observador PT', 'https://observador.pt/feed/', 'Europe', true),

-- Middle East
('Al Jazeera', 'https://www.aljazeera.com/xml/rss/all.xml', 'Middle East', true),
('Reuters Middle East', 'https://www.reuters.com/rssFeed/middle-eastNews', 'Middle East', true),
('France24 Middle East', 'https://www.france24.com/en/middle-east/rss', 'Middle East', true),

-- Africa
('Africanews', 'https://www.africanews.com/feed/rss', 'Africa', true),
('AllAfrica', 'https://allafrica.com/tools/headlines/rdf/latest/headlines.rdf', 'Africa', true),

-- Asia
('SCMP Asia', 'https://www.scmp.com/rss/asia-all.xml', 'Asia', true),
('Reuters Asia', 'https://www.reuters.com/rssFeed/asiaNews', 'Asia', true),

-- Americas
('BBC Mundo', 'https://www.bbc.com/mundo/america_latina/rss.xml', 'Americas', true),

-- Pacific
('ABC Australia', 'https://www.abc.net.au/news/feed/51120/rss.xml', 'Pacific', true),

-- Constructive & Solutions Journalism
('Positive News', 'https://www.positive.news/feed/', 'Positive', true),
('Good Good Good', 'https://www.goodgoodgood.co/rss', 'Positive', true),
('Reasons to be Cheerful', 'https://reasonstobecheerful.world/feed/', 'Positive', true),
('Yes Magazine', 'https://www.yesmagazine.org/feeds/all', 'Positive', true),
('Good News Network', 'https://www.goodnewsnetwork.org/feed/', 'Positive', true),
('The Optimist Daily', 'https://www.optimistdaily.com/feed/', 'Positive', true),
('Global Citizen', 'https://www.globalcitizen.org/en/feed/', 'Positive', true),
('Borgen Magazine', 'https://www.borgenmagazine.com/feed/', 'Positive', true),

-- Science & Progress
('Science Daily Environment', 'https://www.sciencedaily.com/rss/top/environment.xml', 'Positive', true),
('Science Daily Health', 'https://www.sciencedaily.com/rss/top/health.xml', 'Positive', true),

-- Constructive Sections of Major Outlets
('Guardian Global Development', 'https://www.theguardian.com/global-development/rss', 'Positive', true)

ON CONFLICT (url) DO UPDATE SET
    name = EXCLUDED.name,
    region = EXCLUDED.region,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

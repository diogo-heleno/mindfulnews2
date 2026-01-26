import { NextRequest } from 'next/server'
import { getArticles, FilterMode, filterMinScore } from '@/lib/supabase'
import { formatRSSDate, siteConfig, generateExcerpt } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const filter = (searchParams.get('filter') as FilterMode) || 'balanced'
  
  // Validate filter
  const validFilters: FilterMode[] = ['uplifting', 'balanced', 'all']
  const activeFilter = validFilters.includes(filter) ? filter : 'balanced'
  
  // Get articles
  const articles = await getArticles(activeFilter, 50, 0)
  
  // Build RSS XML
  const feedTitle = `Mindful News - ${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}`
  const feedDescription = getFilterDescription(activeFilter)
  const buildDate = new Date().toUTCString()
  
  const rssItems = articles.map((article) => `
    <item>
      <title><![CDATA[${escapeXml(article.title)}]]></title>
      <link>${siteConfig.url}/article/${article.slug}</link>
      <guid isPermaLink="true">${siteConfig.url}/article/${article.slug}</guid>
      <pubDate>${formatRSSDate(article.published_at)}</pubDate>
      <description><![CDATA[${escapeXml(article.summary)}]]></description>
      <content:encoded><![CDATA[${escapeXml(generateExcerpt(article.content, 500))}]]></content:encoded>
      <category><![CDATA[${escapeXml(article.category)}]]></category>
      ${article.image_url ? `<media:content url="${escapeXml(article.image_url)}" medium="image" />` : ''}
      <mindful:positivity>${article.positivity_score}</mindful:positivity>
    </item>
  `).join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:media="http://search.yahoo.com/mrss/"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:mindful="https://mindfulnews.media/ns/1.0">
  <channel>
    <title>${feedTitle}</title>
    <link>${siteConfig.url}</link>
    <description>${feedDescription}</description>
    <language>pt-pt</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <generator>Mindful News v2.0</generator>
    <docs>https://www.rssboard.org/rss-specification</docs>
    <image>
      <url>${siteConfig.url}/logo.png</url>
      <title>${feedTitle}</title>
      <link>${siteConfig.url}</link>
    </image>
    ${rssItems}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

function getFilterDescription(filter: FilterMode): string {
  switch (filter) {
    case 'uplifting':
      return 'Notícias positivas e inspiradoras de todo o mundo. Apenas artigos com pontuação de positividade 4-5.'
    case 'balanced':
      return 'Cobertura noticiosa equilibrada com tom construtivo. Artigos com pontuação de positividade 3-5.'
    case 'all':
      return 'Cobertura completa incluindo todos os temas. Todas as pontuações de positividade incluídas.'
    default:
      return siteConfig.description
  }
}

function escapeXml(text: string): string {
  if (!text) return ''
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticleBySlug } from '@/lib/supabase'
import { formatDate, getPositivityLabel, getPositivityColor, siteConfig } from '@/lib/utils'

interface ArticlePageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug)
  
  if (!article) {
    return {
      title: 'Artigo Não Encontrado',
    }
  }

  return {
    title: article.title,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: 'article',
      publishedTime: article.published_at,
      images: article.image_url ? [{ url: article.image_url }] : [],
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticleBySlug(params.slug)

  if (!article) {
    notFound()
  }

  const positivityClass = getPositivityColor(article.positivity_score)
  const positivityLabel = getPositivityLabel(article.positivity_score)

  // Convert content paragraphs
  const paragraphs = article.content.split('\n\n').filter(Boolean)

  return (
    <article className="pb-16">
      {/* Hero */}
      <header className="relative">
        {article.image_url && (
          <div className="relative h-[40vh] md:h-[50vh] bg-stone-100">
            <Image
              src={article.image_url}
              alt=""
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cream-50 via-transparent to-transparent" />
          </div>
        )}
      </header>

      {/* Content */}
      <div className="container-narrow -mt-16 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-10">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`badge ${positivityClass}`}>
              {article.category}
            </span>
            <span className="text-sm text-stone-500">
              {formatDate(article.published_at)}
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-sm text-stone-500">
              {positivityLabel}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-stone-800 mb-6 leading-tight text-balance">
            {article.title}
          </h1>

          {/* Summary */}
          <p className="text-lg text-stone-700 mb-8 leading-relaxed border-l-4 border-sage-300 pl-4">
            {article.summary}
          </p>

          {/* Article Content */}
          <div className="article-content">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Mindful Reflection Moment */}
          <div className="mt-12 pt-8 border-t border-sage-100">
            <div className="bg-gradient-to-br from-sage-50 to-cream-50 rounded-xl p-6 md:p-8">
              <div className="flex items-start space-x-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-sage-100 flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </span>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-sage-800 mb-2">
                    Momento de Reflexao
                  </h3>
                  <p className="text-stone-600 leading-relaxed text-sm">
                    {article.reflection
                      || (article.positivity_score >= 4
                        ? 'Esta historia mostra o que de melhor a humanidade tem para oferecer. Que accoes ou atitudes desta noticia o podem inspirar no seu dia-a-dia?'
                        : article.positivity_score >= 3
                          ? 'O mundo e complexo, mas tambem esta cheio de pessoas a trabalhar por solucoes. O que retira de mais construtivo desta leitura?'
                          : 'Mesmo perante desafios, existem sempre pessoas e comunidades a agir. Onde encontra sinais de esperanca nesta historia?')
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sources */}
          {article.original_links && article.original_links.length > 0 && (
            <div className="mt-12 pt-8 border-t border-stone-100">
              <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-4">
                Fontes Originais
              </h2>
              <ul className="space-y-2">
                {article.original_links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-ocean-600 hover:text-ocean-700 hover:underline inline-flex items-center space-x-1"
                    >
                      <span className="truncate max-w-md">{new URL(link).hostname}</span>
                      <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Back Link */}
          <div className="mt-12">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-sage-600 hover:text-sage-700 font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              <span>Voltar a todos os artigos</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

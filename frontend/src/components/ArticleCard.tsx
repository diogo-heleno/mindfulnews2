import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/lib/supabase'
import { formatRelativeTime, getPositivityColor, getPositivityLabel } from '@/lib/utils'

interface ArticleCardProps {
  article: Article
  variant?: 'hero' | 'headline' | 'compact'
}

function PositivityIcon({ score }: { score: number }) {
  if (score < 4) return null
  return (
    <svg className="w-3.5 h-3.5 inline-block ml-1 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {score >= 5 ? (
        // Sun icon for inspirational
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      ) : (
        // Leaf/seedling icon for positive
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      )}
    </svg>
  )
}

export default function ArticleCard({ article, variant = 'headline' }: ArticleCardProps) {
  const positivityClass = getPositivityColor(article.positivity_score)
  const isInspiring = article.positivity_score >= 4

  // Hero: large lead story with image and summary
  if (variant === 'hero') {
    return (
      <article className={`border-t-2 ${isInspiring ? 'border-sage-500' : 'border-sage-600'} pt-4 animate-fade-in`}>
        <Link href={`/article/${article.slug}`} className="block group">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <span className={`badge ${positivityClass} self-start mb-3`}>
                {article.category}
                <PositivityIcon score={article.positivity_score} />
              </span>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-stone-900 mb-4 leading-tight group-hover:text-sage-700 transition-colors">
                {article.title}
              </h2>
              <p className="text-stone-600 text-base md:text-lg leading-relaxed mb-4 flex-grow">
                {article.summary}
              </p>
              <span className="text-xs text-stone-400">
                {formatRelativeTime(article.published_at)}
              </span>
            </div>
            {article.image_url && (
              <div className="relative h-64 md:h-full min-h-[280px] bg-stone-100">
                <Image
                  src={article.image_url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            )}
          </div>
        </Link>
      </article>
    )
  }

  // Headline: medium card with image, full title, and summary
  if (variant === 'headline') {
    return (
      <article className="border-t border-stone-200 pt-4 animate-fade-in">
        <Link href={`/article/${article.slug}`} className="block group">
          {article.image_url && (
            <div className="relative h-44 bg-stone-100 mb-3">
              <Image
                src={article.image_url}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
              />
            </div>
          )}
          <span className={`badge ${positivityClass} mb-2 inline-block`}>
            {article.category}
            <PositivityIcon score={article.positivity_score} />
          </span>
          <h3 className="font-serif text-lg md:text-xl font-semibold text-stone-900 mb-2 leading-snug group-hover:text-sage-700 transition-colors">
            {article.title}
          </h3>
          <p className="text-sm text-stone-500 leading-relaxed mb-2">
            {article.summary}
          </p>
          <span className="text-xs text-stone-400">
            {formatRelativeTime(article.published_at)}
          </span>
        </Link>
      </article>
    )
  }

  // Compact: text-only, minimal, for sidebar-style lists
  return (
    <article className="border-t border-stone-200 pt-3 pb-1 animate-fade-in">
      <Link href={`/article/${article.slug}`} className="block group">
        <span className={`badge ${positivityClass} mb-1.5 inline-block text-[11px]`}>
          {article.category}
          <PositivityIcon score={article.positivity_score} />
        </span>
        <h3 className="font-serif text-base font-semibold text-stone-900 leading-snug group-hover:text-sage-700 transition-colors mb-1">
          {article.title}
        </h3>
        <span className="text-xs text-stone-400">
          {formatRelativeTime(article.published_at)}
        </span>
      </Link>
    </article>
  )
}

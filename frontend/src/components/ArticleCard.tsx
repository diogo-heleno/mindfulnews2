import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/lib/supabase'
import { formatRelativeTime, getPositivityColor } from '@/lib/utils'

interface ArticleCardProps {
  article: Article
  variant?: 'hero' | 'headline' | 'compact'
}

export default function ArticleCard({ article, variant = 'headline' }: ArticleCardProps) {
  const positivityClass = getPositivityColor(article.positivity_score)

  // Hero: large lead story with image and summary
  if (variant === 'hero') {
    return (
      <article className="border-t-2 border-sage-600 pt-4 animate-fade-in">
        <Link href={`/article/${article.slug}`} className="block group">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <span className={`badge ${positivityClass} self-start mb-3`}>
                {article.category}
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

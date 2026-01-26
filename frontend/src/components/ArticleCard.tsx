import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/lib/supabase'
import { formatRelativeTime, getPositivityColor, generateExcerpt } from '@/lib/utils'

interface ArticleCardProps {
  article: Article
  featured?: boolean
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const positivityClass = getPositivityColor(article.positivity_score)
  
  if (featured) {
    return (
      <article className="card overflow-hidden animate-fade-in">
        <Link href={`/article/${article.slug}`} className="block">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            {article.image_url && (
              <div className="relative h-64 md:h-full min-h-[300px] bg-stone-100">
                <Image
                  src={article.image_url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}
            
            {/* Content */}
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <div className="flex items-center space-x-3 mb-4">
                <span className={`badge ${positivityClass}`}>
                  {article.category}
                </span>
                <span className="text-xs text-stone-400">
                  {formatRelativeTime(article.published_at)}
                </span>
              </div>
              
              <h2 className="font-serif text-2xl md:text-3xl font-medium text-stone-800 mb-4 leading-tight hover:text-sage-700 transition-colors">
                {article.title}
              </h2>
              
              <p className="text-stone-600 leading-relaxed mb-4">
                {article.summary}
              </p>
              
              <span className="text-sage-600 font-medium text-sm inline-flex items-center space-x-1 group">
                <span>Read more</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </div>
        </Link>
      </article>
    )
  }

  return (
    <article className="card overflow-hidden animate-slide-up">
      <Link href={`/article/${article.slug}`} className="block">
        {/* Image */}
        {article.image_url && (
          <div className="relative h-48 bg-stone-100">
            <Image
              src={article.image_url}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        
        {/* Content */}
        <div className="p-5">
          <div className="flex items-center space-x-3 mb-3">
            <span className={`badge ${positivityClass}`}>
              {article.category}
            </span>
            <span className="text-xs text-stone-400">
              {formatRelativeTime(article.published_at)}
            </span>
          </div>
          
          <h3 className="font-serif text-lg font-medium text-stone-800 mb-2 leading-snug hover:text-sage-700 transition-colors line-clamp-2">
            {article.title}
          </h3>
          
          <p className="text-sm text-stone-600 line-clamp-3">
            {generateExcerpt(article.content, 150)}
          </p>
        </div>
      </Link>
    </article>
  )
}

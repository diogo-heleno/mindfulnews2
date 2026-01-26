'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Article, getMostInspiringArticle } from '@/lib/supabase'
import { formatRelativeTime } from '@/lib/utils'

export default function DailyHighlight() {
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHighlight() {
      const data = await getMostInspiringArticle()
      setArticle(data)
      setLoading(false)
    }
    fetchHighlight()
  }, [])

  if (loading) {
    return (
      <div className="mb-10 animate-pulse">
        <div className="bg-sage-50 rounded-xl p-6 border border-sage-100">
          <div className="h-4 w-48 bg-sage-200 rounded mb-4"></div>
          <div className="h-8 w-full bg-sage-100 rounded mb-3"></div>
          <div className="h-4 w-3/4 bg-sage-100 rounded"></div>
        </div>
      </div>
    )
  }

  if (!article) return null

  return (
    <section className="mb-10">
      <div className="bg-gradient-to-br from-sage-50 via-cream-50 to-ocean-50 rounded-xl border border-sage-200 overflow-hidden">
        <div className="p-1">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6">
            {/* Header */}
            <div className="flex items-center space-x-2 mb-4">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-sage-100">
                <svg className="w-4 h-4 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
              <h2 className="text-sm font-semibold text-sage-700 uppercase tracking-wider">
                Destaque Positivo
              </h2>
            </div>

            <Link href={`/article/${article.slug}`} className="block group">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Text */}
                <div className="md:col-span-2 flex flex-col justify-center">
                  <span className="text-xs font-medium text-sage-600 bg-sage-100 self-start px-2 py-1 rounded mb-3">
                    {article.category}
                  </span>
                  <h3 className="font-serif text-xl md:text-2xl font-bold text-stone-900 mb-3 leading-tight group-hover:text-sage-700 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-stone-600 leading-relaxed mb-3">
                    {article.summary}
                  </p>
                  <span className="text-xs text-stone-400">
                    {formatRelativeTime(article.published_at)}
                  </span>
                </div>

                {/* Image */}
                {article.image_url && (
                  <div className="relative h-48 md:h-full min-h-[180px] rounded-lg overflow-hidden bg-stone-100">
                    <Image
                      src={article.image_url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                )}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

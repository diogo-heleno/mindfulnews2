'use client'

import { useState, useEffect } from 'react'
import { Article, FilterMode, getArticles } from '@/lib/supabase'
import ArticleCard from './ArticleCard'
import FilterBar from './FilterBar'

export default function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([])
  const [filter, setFilter] = useState<FilterMode>('balanced')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const ARTICLES_PER_PAGE = 18

  // Fetch articles when filter or page changes
  useEffect(() => {
    async function fetchArticles() {
      setLoading(true)

      const data = await getArticles(
        filter,
        ARTICLES_PER_PAGE,
        page * ARTICLES_PER_PAGE
      )

      if (page === 0) {
        setArticles(data)
      } else {
        setArticles((prev) => [...prev, ...data])
      }

      setHasMore(data.length === ARTICLES_PER_PAGE)
      setLoading(false)
    }

    fetchArticles()
  }, [filter, page])

  // Reset page when filter changes
  const handleFilterChange = (newFilter: FilterMode) => {
    setFilter(newFilter)
    setPage(0)
    setArticles([])
  }

  // Load more
  const loadMore = () => {
    setPage((prev) => prev + 1)
  }

  // Split articles into layout sections
  const heroArticle = articles[0]
  const secondaryArticles = articles.slice(1, 5)
  const moreArticles = articles.slice(5)

  return (
    <div>
      <FilterBar
        currentFilter={filter}
        onFilterChange={handleFilterChange}
      />

      {loading && articles.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-pulse flex flex-col items-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-sage-200"></div>
            <p className="text-stone-500">Loading articles...</p>
          </div>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="font-serif text-xl text-stone-700 mb-2">No articles found</h3>
          <p className="text-stone-500">Try a different filter or check back later.</p>
        </div>
      ) : (
        <>
          {/* Hero Article */}
          {heroArticle && (
            <div className="mb-8">
              <ArticleCard article={heroArticle} variant="hero" />
            </div>
          )}

          {/* Secondary Stories Row */}
          {secondaryArticles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {secondaryArticles.map((article) => (
                <ArticleCard key={article.id} article={article} variant="headline" />
              ))}
            </div>
          )}

          {/* More Stories */}
          {moreArticles.length > 0 && (
            <>
              <h2 className="font-serif text-xl font-semibold text-stone-800 border-t-2 border-stone-800 pt-3 mb-6">
                More stories
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                {moreArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="compact" />
                ))}
              </div>
            </>
          )}

          {/* Load More */}
          {hasMore && (
            <div className="mt-12 text-center border-t border-stone-200 pt-8">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-8 py-3 bg-sage-600 text-white rounded font-medium hover:bg-sage-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center space-x-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading...</span>
                  </span>
                ) : (
                  'Show more stories'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

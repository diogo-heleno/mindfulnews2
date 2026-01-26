import ArticleList from '@/components/ArticleList'

export default function HomePage() {
  return (
    <div className="container-wide py-6 md:py-8">
      {/* Subtle tagline — newspaper style, straight into the news */}
      <section className="mb-6 pb-4 border-b border-stone-200">
        <p className="text-sm text-stone-500 text-center">
          International news rewritten with clarity, balance, and a constructive perspective
        </p>
      </section>

      {/* Articles */}
      <ArticleList />
    </div>
  )
}

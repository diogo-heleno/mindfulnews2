import ArticleList from '@/components/ArticleList'
import DailyHighlight from '@/components/DailyHighlight'

export default function HomePage() {
  return (
    <div className="container-wide py-6 md:py-8">
      {/* Mindful tagline */}
      <section className="mb-6 pb-4 border-b border-stone-200">
        <p className="text-sm text-stone-500 text-center">
          O melhor da humanidade, todos os dias. Noticias internacionais com clareza, esperanca e perspectiva construtiva.
        </p>
      </section>

      {/* Daily Positive Highlight */}
      <DailyHighlight />

      {/* Articles */}
      <ArticleList />
    </div>
  )
}

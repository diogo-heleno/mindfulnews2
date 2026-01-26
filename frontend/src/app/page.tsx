import ArticleList from '@/components/ArticleList'

export default function HomePage() {
  return (
    <div className="container-wide py-8 md:py-12">
      {/* Hero Section */}
      <section className="text-center mb-12 md:mb-16">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-stone-800 mb-4 text-balance">
          Stay centered. Stay connected.
          <br />
          <span className="text-sage-600">Stay informed.</span>
        </h1>
        <p className="text-lg text-stone-600 max-w-2xl mx-auto">
          International news rewritten with clarity, balance, and a constructive perspective. 
          No sensationalism. No anxiety.
        </p>
      </section>

      {/* Articles */}
      <ArticleList />
    </div>
  )
}

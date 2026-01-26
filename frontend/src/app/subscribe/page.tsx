import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Subscrever',
  description: 'Subscreva o Mindful News através do feed RSS.',
}

const feedOptions = [
  {
    name: 'Notícias Positivas',
    description: 'Apenas notícias positivas e focadas em soluções (pontuação 4-5)',
    url: '/feed.xml?filter=uplifting',
    color: 'bg-sage-500',
  },
  {
    name: 'Cobertura Equilibrada',
    description: 'Notícias positivas e neutras (pontuação 3-5)',
    url: '/feed.xml?filter=balanced',
    color: 'bg-ocean-500',
  },
  {
    name: 'Feed Completo',
    description: 'Todos os artigos, incluindo notícias difíceis (pontuação 1-5)',
    url: '/feed.xml?filter=all',
    color: 'bg-stone-500',
  },
]

const rssReaders = [
  { name: 'Feedly', url: 'https://feedly.com' },
  { name: 'Inoreader', url: 'https://www.inoreader.com' },
  { name: 'NewsBlur', url: 'https://newsblur.com' },
  { name: 'NetNewsWire', url: 'https://netnewswire.com' },
  { name: 'Reeder', url: 'https://reederapp.com' },
]

export default function SubscribePage() {
  return (
    <div className="container-narrow py-12 md:py-20">
      <header className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-medium text-stone-800 mb-4">
          Subscrever
        </h1>
        <p className="text-xl text-stone-600">
          Acompanhe o Mindful News no seu leitor RSS preferido.
        </p>
      </header>

      {/* Feed Options */}
      <section className="mb-16">
        <h2 className="font-serif text-2xl font-medium text-stone-800 mb-6">
          Escolha o seu feed
        </h2>

        <div className="grid gap-4">
          {feedOptions.map((feed) => (
            <div
              key={feed.name}
              className="bg-white rounded-xl p-6 shadow-sm border border-stone-100 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${feed.color}`} />
                <div>
                  <h3 className="font-medium text-stone-800">{feed.name}</h3>
                  <p className="text-sm text-stone-500">{feed.description}</p>
                </div>
              </div>
              <a
                href={feed.url}
                className="flex items-center space-x-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/>
                </svg>
                <span>Subscrever</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* How to Subscribe */}
      <section className="mb-16">
        <h2 className="font-serif text-2xl font-medium text-stone-800 mb-6">
          Como subscrever
        </h2>

        <div className="bg-cream-100 rounded-xl p-6 space-y-4">
          <div className="flex items-start space-x-4">
            <span className="flex-shrink-0 w-8 h-8 bg-sage-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
              1
            </span>
            <div>
              <h3 className="font-medium text-stone-800">Copie o URL do feed</h3>
              <p className="text-sm text-stone-600">
                Clique com o botão direito num botão &quot;Subscrever&quot; acima e copie a ligação.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <span className="flex-shrink-0 w-8 h-8 bg-sage-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
              2
            </span>
            <div>
              <h3 className="font-medium text-stone-800">Abra o seu leitor RSS</h3>
              <p className="text-sm text-stone-600">
                Utilize qualquer aplicação ou serviço de leitura RSS (veja sugestões abaixo).
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <span className="flex-shrink-0 w-8 h-8 bg-sage-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
              3
            </span>
            <div>
              <h3 className="font-medium text-stone-800">Adicione o feed</h3>
              <p className="text-sm text-stone-600">
                Cole o URL ao adicionar uma nova subscrição. Os novos artigos aparecerão automaticamente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RSS Readers */}
      <section>
        <h2 className="font-serif text-2xl font-medium text-stone-800 mb-6">
          Leitores RSS recomendados
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {rssReaders.map((reader) => (
            <a
              key={reader.name}
              href={reader.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg p-4 text-center shadow-sm border border-stone-100 hover:border-sage-300 hover:shadow-md transition-all"
            >
              <span className="text-sm font-medium text-stone-700">{reader.name}</span>
            </a>
          ))}
        </div>

        <p className="text-sm text-stone-500 mt-4">
          Não tem um leitor RSS? Estas são algumas opções populares para começar.
        </p>
      </section>

      {/* Back link */}
      <div className="mt-12 pt-8 border-t border-stone-100">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-sage-600 hover:text-sage-700 font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          <span>Voltar aos artigos</span>
        </Link>
      </div>
    </div>
  )
}

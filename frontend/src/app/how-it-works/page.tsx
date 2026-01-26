import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Como Funciona',
  description: 'Saiba como o Mindful News recolhe, processa e apresenta notícias de forma calma e construtiva.',
}

const steps = [
  {
    number: '01',
    title: 'Recolha',
    description: 'Recolhemos artigos de fontes noticiosas internacionais de confiança através de feeds RSS. As fontes incluem meios de comunicação da Europa, Ásia, África, Américas e plataformas dedicadas a notícias positivas.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Agrupamento',
    description: 'Os artigos relacionados são agrupados por tema com recurso a inteligência artificial. Isto permite que as grandes notícias sejam apresentadas em contexto, e não como títulos isolados. O leitor vê o panorama completo.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Reescrita',
    description: 'Cada grupo de artigos é sintetizado num texto coerente pela IA Claude. A IA resume os factos, remove o sensacionalismo e reescreve num tom calmo e construtivo — sem acrescentar opinião editorial.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Classificação',
    description: 'Cada artigo recebe uma pontuação de positividade de 1 a 5. Isto permite filtrar a experiência de leitura — desde apenas notícias positivas até cobertura completa. O leitor escolhe o seu nível de conforto.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    number: '05',
    title: 'Publicação',
    description: 'Os artigos são publicados no site e no feed RSS. O processo é executado automaticamente a cada seis horas, mantendo-o informado sem a urgência das notícias em tempo real.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
  },
]

export default function HowItWorksPage() {
  return (
    <div className="container-wide py-12 md:py-20">
      <header className="max-w-3xl mb-16">
        <h1 className="font-serif text-4xl md:text-5xl font-medium text-stone-800 mb-4">
          Como Funciona
        </h1>
        <p className="text-xl text-stone-600">
          O percurso da notícia em bruto até à leitura consciente.
        </p>
      </header>

      {/* Process Steps */}
      <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-5 md:gap-8">
        {steps.map((step, index) => (
          <div key={step.number} className="relative">
            {/* Connector line (desktop) */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-sage-200 -translate-y-1/2 z-0" />
            )}

            <div className="relative z-10 bg-white rounded-xl p-6 shadow-sm border border-stone-100 h-full">
              {/* Number */}
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-xs font-medium text-sage-500 bg-sage-50 px-2 py-1 rounded">
                  {step.number}
                </span>
                <div className="text-sage-500">
                  {step.icon}
                </div>
              </div>

              {/* Content */}
              <h3 className="font-serif text-lg font-medium text-stone-800 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Philosophy Section */}
      <section className="mt-20 max-w-3xl">
        <h2 className="font-serif text-2xl font-medium text-stone-800 mb-6">
          A nossa abordagem
        </h2>

        <div className="space-y-6 text-stone-700 leading-relaxed">
          <p>
            Não pretendemos dar notícias em primeira mão. Pretendemos ajudá-lo
            a compreendê-las melhor.
          </p>

          <p>
            O objectivo não é filtrar a realidade, mas apresentá-la de uma forma
            que permita um envolvimento ponderado em vez de stress reactivo.
            Os factos são preservados, o contexto é acrescentado e o sensacionalismo
            é removido.
          </p>

          <p>
            Ao agrupar notícias relacionadas, ajudamos a ver como diferentes fontes
            cobrem os mesmos acontecimentos. Ao atribuir pontuações de positividade,
            damos controlo sobre a dieta informativa. Ao reescrever num tom calmo,
            respeitamos o bem-estar mental do leitor.
          </p>
        </div>

        {/* RSS Promo */}
        <div className="mt-12 p-6 bg-ocean-50 rounded-xl border border-ocean-100">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 bg-ocean-500 rounded-full flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-stone-800 mb-1">Subscrever via RSS</h3>
              <p className="text-sm text-stone-600 mb-3">
                Acompanhe o Mindful News no seu leitor RSS preferido. Filtre por nível de positividade.
              </p>
              <a
                href="/feed.xml"
                className="text-sm font-medium text-ocean-600 hover:text-ocean-700"
              >
                Obter o feed RSS →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

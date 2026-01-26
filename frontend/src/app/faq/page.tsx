import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Perguntas frequentes sobre o Mindful News.',
}

const faqs = [
  {
    question: 'O que é o Mindful News?',
    answer: 'O Mindful News é um projecto pessoal que oferece artigos noticiosos reescritos num tom calmo e claro — ajudando os leitores a acompanhar a actualidade sem se sentirem sobrecarregados. Recolhemos notícias internacionais, processamo-las com inteligência artificial e apresentamo-las de forma construtiva.',
  },
  {
    question: 'Como são criadas as notícias?',
    answer: 'Recolhemos artigos de fontes noticiosas internacionais de confiança através de feeds RSS. Estes são agrupados por tema e reescritos automaticamente pela IA Claude, com base em instruções cuidadosamente desenhadas que orientam o tom e o estilo. O objectivo é preservar os factos, removendo o sensacionalismo.',
  },
  {
    question: 'Porquê reescrever os artigos?',
    answer: 'Muitos fluxos de notícias actuais são rápidos, fragmentados ou alarmistas. O nosso objectivo é apresentar os mesmos factos, mas de uma forma que permita uma leitura mais ponderada e reflexiva — sem acrescentar opiniões editoriais nem distorcer a reportagem original.',
  },
  {
    question: 'É uma IA que escreve as notícias?',
    answer: 'Sim — todos os artigos são sintetizados pela IA Claude a partir de múltiplos artigos-fonte. A IA segue directrizes rigorosas para manter a exactidão factual, remover o sensacionalismo e escrever num tom calmo e construtivo. As ligações para as fontes originais são sempre fornecidas para garantir transparência.',
  },
  {
    question: 'O que significam as pontuações de positividade?',
    answer: 'Cada artigo é classificado de 1 a 5 com base no seu tom: 5 é muito positiva (focada em soluções, esperançosa), 4 é positiva (construtiva), 3 é neutra (reportagem equilibrada), 2 é ligeiramente negativa (preocupante mas informativa) e 1 é negativa (conflitos, crises). Pode filtrar os artigos por estas pontuações.',
  },
  {
    question: 'Quais são as opções de filtro?',
    answer: '"Positivas" mostra apenas artigos com pontuação 4-5 (notícias positivas). "Equilibradas" inclui pontuações 3-5 (positivas e neutras). "Todas" mostra tudo, incluindo cobertura negativa. Escolha com base no seu estado de espírito e necessidades de informação.',
  },
  {
    question: 'Com que frequência o site é actualizado?',
    answer: 'O processo automático é executado a cada seis horas (quatro vezes por dia). Isto garante actualizações regulares sem a ansiedade dos ciclos noticiosos em tempo real. Acreditamos que não precisa de actualizações ao minuto para se manter informado.',
  },
  {
    question: 'Posso sugerir fontes de notícias?',
    answer: 'Sim! São bem-vindas sugestões de novos feeds RSS ou fontes a incluir. Contacte-nos através do GitHub. Damos prioridade a fontes internacionais de qualidade e plataformas dedicadas a notícias positivas.',
  },
  {
    question: 'Este é um projecto comercial?',
    answer: 'Não — é uma experiência independente. Não há anúncios, rastreamento, subscrições pagas nem barreiras de acesso. O código é aberto e está disponível no GitHub. É um projecto pessoal construído para explorar uma abordagem mais calma ao consumo de notícias.',
  },
  {
    question: 'Como posso acompanhar o Mindful News?',
    answer: 'Pode adicionar este site aos favoritos, subscrever o feed RSS no seu leitor preferido ou consultar o repositório no GitHub para actualizações. O feed RSS permite filtrar por nível de positividade através de parâmetros no URL.',
  },
]

export default function FAQPage() {
  return (
    <div className="container-narrow py-12 md:py-20">
      <header className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-medium text-stone-800 mb-4">
          Perguntas Frequentes
        </h1>
        <p className="text-xl text-stone-600">
          Tudo o que precisa de saber sobre o Mindful News.
        </p>
      </header>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border border-stone-100"
          >
            <h2 className="font-serif text-lg font-medium text-stone-800 mb-3">
              {faq.question}
            </h2>
            <p className="text-stone-600 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="mt-12 p-6 bg-sage-50 rounded-xl border border-sage-100 text-center">
        <h2 className="font-serif text-xl font-medium text-stone-800 mb-2">
          Ainda tem dúvidas?
        </h2>
        <p className="text-stone-600 mb-4">
          Gostaríamos de o ouvir.
        </p>
        <a
          href="https://github.com/diogo-heleno/mindfulnews/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-sage-500 text-white rounded-full font-medium hover:bg-sage-600 transition-colors"
        >
          <span>Abrir uma questão no GitHub</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  )
}

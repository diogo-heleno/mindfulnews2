import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre',
  description: 'Conheça o Mindful News e a nossa missão de oferecer uma forma mais calma de se manter informado.',
}

export default function AboutPage() {
  return (
    <div className="container-narrow py-12 md:py-20">
      <header className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-medium text-stone-800 mb-4">
          Sobre o Mindful News
        </h1>
        <p className="text-xl text-stone-600">
          Uma forma mais calma de se manter informado.
        </p>
      </header>

      <div className="prose prose-lg prose-stone max-w-none">
        <p className="text-lg leading-relaxed text-stone-700">
          O Mindful News é um projecto pessoal com um objectivo: oferecer uma forma
          mais calma e construtiva de ler notícias internacionais.
        </p>

        <h2 className="font-serif text-2xl font-medium text-stone-800 mt-12 mb-4">
          Porquê este projecto
        </h2>

        <p className="text-stone-700 leading-relaxed">
          Num mundo em que as notícias são frequentemente rápidas, avassaladoras ou
          alarmistas, quisemos experimentar algo diferente. Os fluxos de notícias
          tradicionais podem facilmente desencadear emoções negativas e stress através de:
        </p>

        <ul className="text-stone-700 space-y-2 my-6">
          <li>Sensacionalismo excessivo e títulos enganadores</li>
          <li>Tom catastrofista e enquadramento baseado no medo</li>
          <li>Foco no conflito e na polarização</li>
          <li>Ciclos repetitivos de indignação</li>
        </ul>

        <p className="text-stone-700 leading-relaxed">
          Criámos o Mindful News para filtrar a negatividade extrema e reescrever
          artigos num tom claro, calmo e construtivo. O nosso objectivo não é dar
          notícias em primeira mão ou fornecer títulos sensacionalistas — mas criar
          espaço para uma leitura ponderada e reflexiva.
        </p>

        <h2 className="font-serif text-2xl font-medium text-stone-800 mt-12 mb-4">
          O que é (e o que não é)
        </h2>

        <p className="text-stone-700 leading-relaxed">
          Isto não é sobre &quot;boas notícias falsas&quot; ou ignorar a realidade. Trata-se de
          <strong> jornalismo equilibrado e factual</strong>, apresentado de uma forma que
          respeita o seu bem-estar mental.
        </p>

        <p className="text-stone-700 leading-relaxed">
          Recolhemos notícias de fontes internacionais de confiança e processamo-las
          com inteligência artificial para:
        </p>

        <ul className="text-stone-700 space-y-2 my-6">
          <li>Agrupar notícias relacionadas para contextualização</li>
          <li>Reescrever numa linguagem clara e não alarmista</li>
          <li>Atribuir pontuações de positividade para filtrar a experiência de leitura</li>
          <li>Preservar a exactidão removendo o sensacionalismo</li>
        </ul>

        <h2 className="font-serif text-2xl font-medium text-stone-800 mt-12 mb-4">
          O filtro de positividade
        </h2>

        <p className="text-stone-700 leading-relaxed">
          Cada artigo é classificado de 1 a 5, com base no seu tom:
        </p>

        <ul className="text-stone-700 space-y-2 my-6">
          <li><strong>5:</strong> Muito positiva — inspiradora, focada em soluções</li>
          <li><strong>4:</strong> Positiva — construtiva e encorajadora</li>
          <li><strong>3:</strong> Neutra — reportagem equilibrada e factual</li>
          <li><strong>2:</strong> Ligeiramente negativa — preocupante mas informativa</li>
          <li><strong>1:</strong> Negativa — conflitos, crises, catástrofes</li>
        </ul>

        <p className="text-stone-700 leading-relaxed">
          Pode optar por ver apenas notícias positivas (pontuações 4-5), cobertura
          equilibrada (pontuações 3+) ou o panorama completo (todas as pontuações).
        </p>

        <h2 className="font-serif text-2xl font-medium text-stone-800 mt-12 mb-4">
          Independente e transparente
        </h2>

        <p className="text-stone-700 leading-relaxed">
          O Mindful News é um projecto independente. Não há anúncios, nem rastreamento,
          nem subscrições pagas. O código é aberto e está disponível no GitHub.
        </p>

        <p className="text-stone-700 leading-relaxed mt-6">
          Este é um projecto pessoal — uma prova de conceito de que é possível
          construir uma melhor experiência de consumo de notícias, para nós e para
          quem a considere útil.
        </p>

        <div className="mt-12 p-6 bg-sage-50 rounded-xl border border-sage-100">
          <p className="text-stone-700 italic text-center">
            &quot;Mindful News — uma forma mais calma de se manter informado.&quot;
          </p>
        </div>
      </div>
    </div>
  )
}

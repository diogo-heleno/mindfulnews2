import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How It Works',
  description: 'Learn how Mindful News collects, processes, and presents news in a calm, constructive way.',
}

const steps = [
  {
    number: '01',
    title: 'Collection',
    description: 'We gather articles from trusted international news sources via RSS feeds. Sources include major outlets from Europe, Asia, Africa, the Americas, and dedicated positive news platforms.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Clustering',
    description: 'Related articles are grouped together using AI. This means major stories are presented in context, not as isolated headlines. You see the bigger picture.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Rewriting',
    description: 'Each cluster is synthesized into a coherent article using Claude AI. The AI summarizes facts, removes sensationalism, and rewrites in a calm, constructive tone—without adding editorial opinion.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Scoring',
    description: 'Each article receives a positivity score from 1-5. This allows you to filter your news experience—from uplifting only to complete coverage. You choose your comfort level.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    number: '05',
    title: 'Delivery',
    description: 'Articles are published to the website and RSS feed. The pipeline runs automatically every 6 hours, keeping you informed without the urgency of real-time news.',
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
          How It Works
        </h1>
        <p className="text-xl text-stone-600">
          The journey from raw news to mindful reading.
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
          Our approach
        </h2>
        
        <div className="space-y-6 text-stone-700 leading-relaxed">
          <p>
            We don&apos;t aim to break news first. We aim to help you understand it better.
          </p>
          
          <p>
            The goal is not to filter reality, but to present it in a way that allows 
            for thoughtful engagement rather than reactive stress. Facts are preserved, 
            context is added, and sensationalism is removed.
          </p>

          <p>
            By clustering related stories, we help you see how different sources cover 
            the same events. By assigning positivity scores, we give you control over 
            your news diet. By rewriting in a calm tone, we respect your mental wellbeing.
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
              <h3 className="font-medium text-stone-800 mb-1">Subscribe via RSS</h3>
              <p className="text-sm text-stone-600 mb-3">
                Follow Mindful News in your favorite RSS reader. Filter by positivity level.
              </p>
              <a 
                href="/feed.xml" 
                className="text-sm font-medium text-ocean-600 hover:text-ocean-700"
              >
                Get the RSS feed →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

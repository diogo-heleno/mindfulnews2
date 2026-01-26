import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about Mindful News.',
}

const faqs = [
  {
    question: 'What is Mindful News?',
    answer: 'Mindful News is a personal project that offers rewritten news articles in a calm, clear tone—helping readers engage with the news without feeling overwhelmed. We gather international news, process it with AI, and present it in a constructive way.',
  },
  {
    question: 'How is the news created?',
    answer: 'We gather articles from trusted international news sources via RSS feeds. These are grouped by topic and rewritten automatically by Claude AI, based on carefully designed prompts that guide tone and style. The goal is to preserve facts while removing sensationalism.',
  },
  {
    question: 'Why are the articles rewritten?',
    answer: 'Many news feeds today feel fast, fragmented, or alarmist. We aim to present the same facts, but in a way that allows for more thoughtful reading and reflection—without adding editorial opinions or distorting the original reporting.',
  },
  {
    question: 'Is this AI writing the news?',
    answer: 'Yes—all articles are synthesized by Claude AI from multiple source articles. The AI follows strict guidelines to maintain factual accuracy, remove sensationalism, and write in a calm, constructive tone. Source links are always provided for transparency.',
  },
  {
    question: 'What do the positivity scores mean?',
    answer: 'Each article is scored from 1-5 based on its tone: 5 is very positive (solutions-focused, hopeful), 4 is positive (constructive), 3 is neutral (balanced reporting), 2 is slightly negative (concerning but informative), and 1 is negative (conflicts, crises). You can filter articles by these scores.',
  },
  {
    question: 'What are the filter options?',
    answer: '"Uplifting" shows only articles scored 4-5 (positive news). "Balanced" includes scores 3-5 (positive and neutral). "All News" shows everything including negative coverage. Choose based on your current mental state and information needs.',
  },
  {
    question: 'How often is the site updated?',
    answer: 'The pipeline runs automatically every 6 hours (4 times per day). This provides regular updates without the anxiety of real-time news cycles. We believe you don\'t need minute-by-minute updates to stay informed.',
  },
  {
    question: 'Can I suggest news sources?',
    answer: 'Yes! We welcome suggestions for new RSS feeds or sources to include. Please reach out via GitHub or the contact page. We prioritize quality international sources and dedicated positive news platforms.',
  },
  {
    question: 'Is this a commercial project?',
    answer: 'No—this is an independent experiment. There are no ads, no tracking, no subscriptions, and no paywalls. The code is open source on GitHub. It\'s a personal project built to explore a calmer approach to news consumption.',
  },
  {
    question: 'How can I follow Mindful News?',
    answer: 'You can bookmark this website, subscribe to the RSS feed in your favorite reader, or check the GitHub repository for updates. The RSS feed supports filtering by positivity level through URL parameters.',
  },
]

export default function FAQPage() {
  return (
    <div className="container-narrow py-12 md:py-20">
      <header className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-medium text-stone-800 mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-stone-600">
          Everything you need to know about Mindful News.
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
          Still have questions?
        </h2>
        <p className="text-stone-600 mb-4">
          We&apos;d love to hear from you.
        </p>
        <a
          href="https://github.com/diogo-heleno/mindfulnews/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-sage-500 text-white rounded-full font-medium hover:bg-sage-600 transition-colors"
        >
          <span>Open an issue on GitHub</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  )
}

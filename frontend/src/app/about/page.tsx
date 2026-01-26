import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Mindful News and our mission to offer a calmer way to stay informed.',
}

export default function AboutPage() {
  return (
    <div className="container-narrow py-12 md:py-20">
      <header className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-medium text-stone-800 mb-4">
          About Mindful News
        </h1>
        <p className="text-xl text-stone-600">
          A calmer way to stay informed.
        </p>
      </header>

      <div className="prose prose-lg prose-stone max-w-none">
        <p className="text-lg leading-relaxed text-stone-700">
          Mindful News is a personal project with one goal: to offer a calmer, more 
          constructive way to read world news.
        </p>

        <h2 className="font-serif text-2xl font-medium text-stone-800 mt-12 mb-4">
          Why we built this
        </h2>
        
        <p className="text-stone-700 leading-relaxed">
          In a world where news often feels fast, overwhelming, or alarmist, we wanted 
          to try something different. Traditional news feeds can easily trigger negative 
          emotions and stress through:
        </p>

        <ul className="text-stone-700 space-y-2 my-6">
          <li>Excessive sensationalism and clickbait</li>
          <li>Catastrophic tone and fear-based framing</li>
          <li>Focus on conflict and polarisation</li>
          <li>Repetitive cycles of outrage</li>
        </ul>

        <p className="text-stone-700 leading-relaxed">
          We created Mindful News to filter out extreme negativity and rewrite articles 
          in a clear, calm, and constructive tone. Our focus is not to break news first 
          or provide sensational headlines—but to create space for thoughtful reading 
          and reflection.
        </p>

        <h2 className="font-serif text-2xl font-medium text-stone-800 mt-12 mb-4">
          What this is (and isn&apos;t)
        </h2>

        <p className="text-stone-700 leading-relaxed">
          This is not about &quot;fake good news&quot; or ignoring reality. It&apos;s about 
          <strong> balanced, factual journalism</strong> presented in a way that respects 
          your mental wellbeing.
        </p>

        <p className="text-stone-700 leading-relaxed">
          We gather news from trusted international sources and process it using AI to:
        </p>

        <ul className="text-stone-700 space-y-2 my-6">
          <li>Group related stories for context</li>
          <li>Rewrite in clear, non-alarmist language</li>
          <li>Assign positivity scores so you can filter your reading experience</li>
          <li>Preserve accuracy while removing sensationalism</li>
        </ul>

        <h2 className="font-serif text-2xl font-medium text-stone-800 mt-12 mb-4">
          The positivity filter
        </h2>

        <p className="text-stone-700 leading-relaxed">
          Each article is scored from 1 to 5 based on its tone:
        </p>

        <ul className="text-stone-700 space-y-2 my-6">
          <li><strong>5:</strong> Very positive—uplifting, solutions-focused</li>
          <li><strong>4:</strong> Positive—constructive and encouraging</li>
          <li><strong>3:</strong> Neutral—balanced, factual reporting</li>
          <li><strong>2:</strong> Slightly negative—concerning but informative</li>
          <li><strong>1:</strong> Negative—conflicts, crises, disasters</li>
        </ul>

        <p className="text-stone-700 leading-relaxed">
          You can choose to see only uplifting news (scores 4-5), balanced coverage 
          (scores 3+), or the complete picture (all scores).
        </p>

        <h2 className="font-serif text-2xl font-medium text-stone-800 mt-12 mb-4">
          Independent & transparent
        </h2>

        <p className="text-stone-700 leading-relaxed">
          Mindful News is an independent project. There are no ads, no tracking, and 
          no subscriptions. The code is open source on GitHub.
        </p>

        <p className="text-stone-700 leading-relaxed mt-6">
          This is a personal experiment—a proof of concept that we could build a better 
          news experience for ourselves and anyone who may find it helpful.
        </p>

        <div className="mt-12 p-6 bg-sage-50 rounded-xl border border-sage-100">
          <p className="text-stone-700 italic text-center">
            &quot;Mindful News—offering a calmer way to stay informed.&quot;
          </p>
        </div>
      </div>
    </div>
  )
}

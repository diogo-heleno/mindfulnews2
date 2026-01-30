export default function ComingSoonPage() {
  return (
    <div className="container-wide py-16 md:py-24 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-xl mx-auto animate-fade-in">
        {/* Logo / Icon */}
        <div className="mb-8">
          <span className="text-6xl">🌱</span>
        </div>

        {/* Title */}
        <h1 className="font-serif text-4xl md:text-5xl text-stone-800 mb-4">
          Em breve
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-stone-600 mb-8">
          Estamos a preparar algo especial para ti.
        </p>

        {/* Description */}
        <div className="bg-cream-100 rounded-lg p-6 mb-8">
          <p className="text-stone-600 leading-relaxed">
            O <span className="font-semibold text-sage-600">Mindful News</span> vai
            trazer-te o melhor da humanidade, todos os dias. Noticias internacionais
            com clareza, esperanca e perspectiva construtiva.
          </p>
        </div>

        {/* Decorative element */}
        <div className="flex items-center justify-center gap-2 text-sage-400">
          <span className="w-8 h-px bg-sage-300"></span>
          <span className="text-sm">brevemente</span>
          <span className="w-8 h-px bg-sage-300"></span>
        </div>
      </div>
    </div>
  )
}

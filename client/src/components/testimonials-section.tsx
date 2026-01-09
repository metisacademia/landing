export default function TestimonialsSection() {
  const stats = [
    { number: "95%", label: "recomendariam" },
    { number: "87%", label: "relatam melhoria" },
    { number: "6", label: "alunos por turma" },
  ];

  const testimonials = [
    {
      quote: "Depois de 3 meses na Métis, voltei a lembrar dos compromissos sem precisar de agenda.",
      name: "Maria S.",
      age: 68,
      time: "aluna há 4 meses",
    },
    {
      quote: "Minha família notou a diferença na minha concentração e disposição.",
      name: "José R.",
      age: 72,
      time: "aluno há 6 meses",
    },
    {
      quote: "As aulas são estimulantes e o ambiente é acolhedor. Recomendo muito!",
      name: "Ana L.",
      age: 65,
      time: "aluna há 3 meses",
    },
  ];

  return (
    <section id="depoimentos" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1a1a2e] mb-12">
          O que nossos alunos dizem
        </h2>

        <div className="grid grid-cols-3 gap-4 mb-16">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#cda465]">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 italic mb-4">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#cda465]/20 rounded-full" />
                <div>
                  <p className="font-semibold text-[#1a1a2e]">{t.name}, {t.age} anos</p>
                  <p className="text-sm text-gray-500">{t.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

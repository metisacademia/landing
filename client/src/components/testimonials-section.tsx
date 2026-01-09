import { Star } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Maria Helena, 68 anos",
      role: "Aposentada",
      text: "Depois de 3 meses na Métis, percebi uma melhora significativa na minha memória. Lembro de compromissos, nomes e até onde deixei as chaves!",
      rating: 5
    },
    {
      name: "Carlos Eduardo, 55 anos",
      role: "Empresário",
      text: "O ambiente é acolhedor e os exercícios são desafiadores na medida certa. Sinto que minha capacidade de concentração no trabalho melhorou muito.",
      rating: 5
    },
    {
      name: "Dona Lúcia, 72 anos",
      role: "Professora aposentada",
      text: "A Métis me devolveu a confiança. Os exercícios de linguagem e memória fizeram toda diferença na minha qualidade de vida.",
      rating: 5
    }
  ];

  return (
    <section id="depoimentos" className="py-20 bg-[#1a1a2e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block bg-[#cda465]/20 border border-[#cda465] text-[#cda465] rounded-full px-4 py-1 text-sm font-medium mb-4">
            Depoimentos
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            O que nossos alunos dizem
          </h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            Histórias reais de pessoas que transformaram sua saúde cognitiva com a Métis.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-[#cda465]/30 hover:border-[#cda465]/60 transition-colors"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#cda465] text-[#cda465]" />
                ))}
              </div>
              <p className="text-white/90 mb-6 italic">
                "{testimonial.text}"
              </p>
              <div>
                <p className="font-semibold text-white">
                  {testimonial.name}
                </p>
                <p className="text-[#cda465] text-sm">
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

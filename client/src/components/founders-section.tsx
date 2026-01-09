export default function FoundersSection() {
  const founders = [
    {
      name: "Dra. Ana Paula Guimarães",
      role: "Neurologista",
      description: "Especialista em neurologia cognitiva com mais de 15 anos de experiência em estimulação cerebral e prevenção do declínio cognitivo.",
      credential: "CRM-PE 12345"
    },
    {
      name: "Dr. Ricardo Mendes",
      role: "Neuropsicólogo",
      description: "Doutor em Neuropsicologia pela USP, dedicado ao desenvolvimento de metodologias científicas para treinamento cognitivo.",
      credential: "CRP 02/56789"
    }
  ];

  return (
    <section id="quem-somos" className="py-20 bg-[#f8f1e7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block bg-[#cda465]/20 border border-[#cda465] text-[#cda465] rounded-full px-4 py-1 text-sm font-medium mb-4">
            Quem Somos
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-6">
            Fundadores com expertise em neurociência
          </h2>
          <p className="text-lg text-[#1a1a2e]/70 max-w-3xl mx-auto">
            A Métis foi criada por profissionais renomados que unem ciência e prática para oferecer o melhor em estimulação cognitiva.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {founders.map((founder, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg border border-[#cda465]/20 hover:shadow-xl transition-shadow"
            >
              <div className="w-20 h-20 bg-[#cda465]/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-3xl font-bold text-[#cda465]">
                  {founder.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#1a1a2e] text-center mb-2">
                {founder.name}
              </h3>
              <p className="text-[#cda465] font-medium text-center mb-4">
                {founder.role}
              </p>
              <p className="text-[#1a1a2e]/70 text-center mb-4">
                {founder.description}
              </p>
              <p className="text-sm text-[#1a1a2e]/50 text-center">
                {founder.credential}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

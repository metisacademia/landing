import { User } from "lucide-react";

export default function FoundersSection() {
  const founders = [
    {
      name: "Dra. Ana Paula Guimarães",
      crm: "CRM-PE 12345",
      specialty: "Neurologista",
      bio: "Após anos tratando pacientes com declínio cognitivo, criei a Métis para atuar na prevenção.",
    },
    {
      name: "Dr. Ricardo Mendes",
      crm: "CRP 02/56789",
      specialty: "Neuropsicólogo",
      bio: "Minha missão é ajudar pessoas a manterem sua autonomia cognitiva por mais tempo.",
    },
  ];

  return (
    <section id="quem-somos" className="py-20 bg-[#1a1a2e]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
          Criada por quem entende do assunto
        </h2>
        <p className="text-lg text-white/70 text-center max-w-3xl mx-auto mb-12">
          A Métis foi fundada por profissionais renomados que unem ciência e prática para oferecer o melhor em estimulação cognitiva.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {founders.map((founder, i) => (
            <div key={i} className="bg-white/5 rounded-lg p-6 text-center">
              <div className="w-24 h-24 bg-[#cda465]/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="w-12 h-12 text-[#cda465]" />
              </div>
              <h3 className="text-xl font-bold text-white">{founder.name}</h3>
              <p className="text-[#cda465]">{founder.crm} | {founder.specialty}</p>
              <p className="text-gray-300 mt-4 italic">"{founder.bio}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

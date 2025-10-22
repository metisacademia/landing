export default function CircuitSection() {
  return (
    <section id="como-funciona" className="py-24 bg-[#173b5a]">
      {/* Título e Descrição */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#f8f1e7] mb-6" data-testid="circuit-title">
            Circuito das 4 Salas
          </h2>
          <p className="text-lg md:text-xl text-[#f8f1e7]/90 max-w-3xl mx-auto leading-relaxed" data-testid="circuit-description">
            Cada sala foi cuidadosamente projetada para estimular diferentes capacidades cognitivas através de experiências imersivas e culturalmente ricas.
          </p>
        </div>
      </div>

      {/* Imagem Full Width */}
      <div className="w-full overflow-hidden">
        <img 
          src="/images/salas-circuito.png" 
          alt="Circuito das 4 Salas - Linguagem, Memória, Atividades Executivas e Contemplação" 
          className="w-full h-auto object-cover"
          data-testid="circuit-image"
        />
      </div>

      {/* Espaçamento inferior adicional */}
      <div className="h-12"></div>
    </section>
  );
}

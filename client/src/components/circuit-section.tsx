export default function CircuitSection() {
  return (
    <section id="como-funciona" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-6" data-testid="circuit-title">Circuito das 4 Salas</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="circuit-description">
            Cada sala foi cuidadosamente projetada para estimular diferentes capacidades cognitivas através de experiências imersivas e culturalmente ricas.
          </p>
        </div>

        {/* Imagem do Circuito das Salas */}
        <div className="flex justify-center">
          <img 
            src="/images/salas-circuito.png" 
            alt="Circuito das 4 Salas - Linguagem, Memória, Atividades Executivas e Contemplação" 
            className="w-full max-w-5xl rounded-lg shadow-xl"
            data-testid="circuit-image"
          />
        </div>
      </div>
    </section>
  );
}

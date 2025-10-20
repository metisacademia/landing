import { MessageCircle, Brain, Dumbbell, Leaf, ArrowDown, ArrowUp, ArrowLeft, ArrowRight } from "lucide-react";

export default function CircuitSection() {
  const rooms = [
    {
      id: 1,
      title: "Sala da\nLinguagem", 
      description: "Atividades que\ndesenvolvem e expandem\nvocabulário, interpretação e\nexpressão escrita e verbal.",
      bgColor: "bg-primary",
      iconColor: "text-primary-foreground",
      icon: MessageCircle,
      position: "bottom-left"
    },
    {
      id: 2,
      title: "Sala da\nMemória",
      description: "Estímulo e\ndesenvolvimento da\nmemória e expansão\nde conhecimentos\nculturais.",
      bgColor: "bg-[#aa7552]",
      iconColor: "text-white", 
      icon: Brain,
      position: "top-left"
    },
    {
      id: 3,
      title: "Sala de\nAtividades\nExecutivas",
      description: "Integração corpo-mente,\ncom estímulo da atenção,\nplanejamento e resolução\nde problemas.",
      bgColor: "bg-accent",
      iconColor: "text-accent-foreground",
      icon: Dumbbell,
      position: "bottom-right"
    },
    {
      id: 4,
      title: "Sala de\nContemplação",
      description: "Estado contemplativo\nativo: consolidação do\naprendizado.",
      bgColor: "bg-[#323256]",
      iconColor: "text-white",
      icon: Leaf,
      position: "top-right"
    }
  ];

  return (
    <section id="como-funciona" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-6" data-testid="circuit-title">Circuito das 4 Salas</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="circuit-description">
            Cada sala foi cuidadosamente projetada para estimular diferentes capacidades cognitivas através de experiências imersivas e culturalmente ricas.
          </p>
        </div>

        {/* Circular Flow Diagram - Desktop */}
        <div className="hidden md:block">
          <div className="relative mx-auto aspect-square max-w-[40rem] h-[640px]">
            {/* Background circle guide */}
            <div className="absolute inset-8 rounded-full border-2 border-gray-200 opacity-20"></div>
            
            {/* Room 1 - Top Left - Sala da Linguagem (INÍCIO) */}
            <div className="absolute top-0 left-0 w-60 text-center" data-testid="room-1">
              <div className="flex flex-col items-center">
                <div className={`w-20 h-20 ${rooms[0].bgColor} rounded-full flex items-center justify-center mb-4`}>
                  <MessageCircle className={`h-10 w-10 ${rooms[0].iconColor}`} />
                </div>
                <h3 className="text-lg font-bold mb-2 leading-tight whitespace-pre-line">
                  {rooms[0].title}
                </h3>
                <p className="text-sm text-muted-foreground leading-tight whitespace-pre-line">
                  {rooms[0].description}
                </p>
              </div>
            </div>

            {/* Room 2 - Top Right - Sala da Memória */}
            <div className="absolute top-0 right-0 w-60 text-center" data-testid="room-2">
              <div className="flex flex-col items-center">
                <div className={`w-20 h-20 ${rooms[1].bgColor} rounded-full flex items-center justify-center mb-4`}>
                  <Brain className={`h-10 w-10 ${rooms[1].iconColor}`} />
                </div>
                <h3 className="text-lg font-bold mb-2 leading-tight whitespace-pre-line">
                  {rooms[1].title}
                </h3>
                <p className="text-sm text-muted-foreground leading-tight whitespace-pre-line">
                  {rooms[1].description}
                </p>
              </div>
            </div>

            {/* Room 3 - Bottom Right - Sala de Atividades Executivas */}
            <div className="absolute bottom-0 right-0 w-60 text-center" data-testid="room-3">
              <div className="flex flex-col items-center">
                <div className={`w-20 h-20 ${rooms[2].bgColor} rounded-full flex items-center justify-center mb-4`}>
                  <Dumbbell className={`h-10 w-10 ${rooms[2].iconColor}`} />
                </div>
                <h3 className="text-lg font-bold mb-2 leading-tight whitespace-pre-line">
                  {rooms[2].title}
                </h3>
                <p className="text-sm text-muted-foreground leading-tight whitespace-pre-line">
                  {rooms[2].description}
                </p>
              </div>
            </div>

            {/* Room 4 - Bottom Left - Sala de Contemplação (FINAL) */}
            <div className="absolute bottom-0 left-0 w-60 text-center" data-testid="room-4">
              <div className="flex flex-col items-center">
                <div className={`w-20 h-20 ${rooms[3].bgColor} rounded-full flex items-center justify-center mb-4`}>
                  <Leaf className={`h-10 w-10 ${rooms[3].iconColor}`} />
                </div>
                <h3 className="text-lg font-bold mb-2 leading-tight whitespace-pre-line">
                  {rooms[3].title}
                </h3>
                <p className="text-sm text-muted-foreground leading-tight whitespace-pre-line">
                  {rooms[3].description}
                </p>
              </div>
            </div>

            {/* Flowing Arrows - Sequência: Linguagem → Memória → Atividades Executivas → Contemplação */}
            {/* Arrow 1: Linguagem → Memória (top-left to top-right) */}
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 translate-y-8">
              <ArrowRight className="h-8 w-8 text-gray-400" />
            </div>
            {/* Arrow 2: Memória → Atividades Executivas (top-right to bottom-right) */}
            <div className="absolute right-20 top-1/2 transform -translate-y-1/2 translate-x-8">
              <ArrowDown className="h-8 w-8 text-gray-400" />
            </div>
            {/* Arrow 3: Atividades Executivas → Contemplação (bottom-right to bottom-left) */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 -translate-y-8">
              <ArrowLeft className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Mobile Layout - Grid */}
        <div className="block md:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {rooms.map((room) => {
              const IconComponent = room.icon;
              return (
                <div key={room.id} className="text-center p-6 border border-border rounded-lg" data-testid={`room-${room.id}`}>
                  <div className="flex flex-col items-center">
                    <div className={`w-20 h-20 ${room.bgColor} rounded-full flex items-center justify-center mb-4`}>
                      <IconComponent className={`h-10 w-10 ${room.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-bold mb-2 leading-tight whitespace-pre-line">
                      {room.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-tight whitespace-pre-line">
                      {room.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MessageCircle, Brain, Dumbbell, Leaf } from "lucide-react";

interface RoomData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  detailedDescription: string;
  icon: typeof MessageCircle;
  color: string;
  position: { left: string; width: string };
}

export default function CircuitSection() {
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);

  const rooms: RoomData[] = [
    {
      id: 1,
      title: "Sala da Linguagem",
      subtitle: "Expressão e Comunicação",
      description: "Aqui é onde a expressão ganha forma. Na sala da linguagem, você exercita comunicação, criatividade e a construção de ideias.",
      detailedDescription: "É a biblioteca viva do seu cérebro. Através de atividades que desenvolvem e expandem vocabulário, interpretação e expressão escrita e verbal, você transforma seu potencial comunicativo. Cada palavra é uma ferramenta de transformação em suas mãos.",
      icon: MessageCircle,
      color: "bg-slate-700",
      position: { left: "0%", width: "25%" }
    },
    {
      id: 2,
      title: "Sala da Memória",
      subtitle: "Lembrança e Experiência",
      description: "Neste ambiente, você revive, lembra e assimila experiências e conhecimentos culturais.",
      detailedDescription: "É um mergulho nas suas próprias histórias — cada lembrança, uma ponte entre o passado e o agora. Estímulo e desenvolvimento da memória e expansão de conhecimentos culturais. É o arquivo vivo das suas experiências, onde você cultiva e expande seu repertório cultural.",
      icon: Brain,
      color: "bg-red-800",
      position: { left: "25%", width: "25%" }
    },
    {
      id: 3,
      title: "Sala de Atividades Executivas",
      subtitle: "Foco, Planejamento e Tomada de Decisão",
      description: "Aqui o cérebro trabalha em alta performance: atenção, planejamento e resolução de problemas.",
      detailedDescription: "Integração corpo-mente, com estímulo da atenção, planejamento e resolução de problemas. É o centro de comando de suas ações, onde as interações se tornam movimento e você fortalece suas habilidades de execução.",
      icon: Dumbbell,
      color: "bg-amber-600",
      position: { left: "50%", width: "25%" }
    },
    {
      id: 4,
      title: "Sala de Contemplação",
      subtitle: "Presença e Integração",
      description: "Depois do esforço cognitivo, chega o momento da pausa. Aqui a mente descansa e consolida.",
      detailedDescription: "É o espaço onde sua mente descansa e consolida. Depois da estimulação, você entra em estado contemplativo ativo, onde o cérebro descansa e integra tudo o que foi vivido. Aqui, a presença se torna aprendizado consolidado.",
      icon: Leaf,
      color: "bg-slate-500",
      position: { left: "75%", width: "25%" }
    }
  ];

  return (
    <section id="como-funciona" className="py-24 bg-[#173b5a]">
      {/* Título e Descrição */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#f8f1e7] mb-6" data-testid="circuit-title">
            Circuito das 4 Salas
          </h2>
          <p className="text-lg md:text-xl text-[#f8f1e7]/90 max-w-3xl mx-auto leading-relaxed" data-testid="circuit-description">
            Cada sala foi cuidadosamente projetada para estimular diferentes capacidades cognitivas. Clique em cada sala para explorar.
          </p>
        </div>
      </div>

      {/* Container Interativo com Imagem e Áreas Clicáveis */}
      <div className="w-full relative bg-[#173b5a]">
        {/* Imagem de Fundo */}
        <img 
          src="/images/circuito-4-salas.jpg" 
          alt="Circuito das 4 Salas - Linguagem, Memória, Atividades Executivas e Contemplação" 
          className="w-full h-auto object-cover"
          style={{ backgroundColor: '#173b5a' }}
          data-testid="circuit-image"
        />
        
        {/* Áreas Clicáveis sobre cada Sala */}
        <div className="absolute inset-0 hidden md:flex">
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className="absolute h-full transition-all duration-300 hover:bg-white/10 cursor-pointer group"
              style={{ 
                left: room.position.left, 
                width: room.position.width 
              }}
              data-testid={`room-area-${room.id}`}
              aria-label={`Explorar ${room.title}`}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-xl transform group-hover:scale-105 transition-transform">
                  <room.icon className="h-12 w-12 text-[#173b5a] mx-auto mb-2" />
                  <p className="text-sm font-semibold text-[#173b5a] whitespace-nowrap">Clique para explorar</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Versão Mobile - Cards abaixo da imagem */}
        <div className="md:hidden px-4 py-8 grid grid-cols-2 gap-4">
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className="p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 text-left border border-white/20"
              data-testid={`room-card-mobile-${room.id}`}
            >
              <room.icon className="h-8 w-8 text-[#f8f1e7] mb-2" />
              <h3 className="text-sm font-semibold text-[#f8f1e7]">{room.title}</h3>
            </button>
          ))}
        </div>
      </div>

      {/* Modal com Informações Detalhadas */}
      <Dialog open={!!selectedRoom} onOpenChange={(open) => !open && setSelectedRoom(null)}>
        <DialogContent className="max-w-2xl" data-testid={selectedRoom ? `room-modal-${selectedRoom.id}` : 'room-modal'}>
          {selectedRoom && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 ${selectedRoom.color} rounded-full flex items-center justify-center`}>
                    <selectedRoom.icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-foreground">
                      {selectedRoom.title}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1">{selectedRoom.subtitle}</p>
                  </div>
                </div>
                <DialogDescription className="text-base leading-relaxed text-foreground/80">
                  <div className="space-y-4">
                    <div className="font-medium text-lg">{selectedRoom.description}</div>
                    <div>{selectedRoom.detailedDescription}</div>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Espaçamento inferior */}
      <div className="h-12"></div>
    </section>
  );
}

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MessageCircle, Brain, Dumbbell, Leaf } from "lucide-react";
import { motion } from "framer-motion";

interface RoomData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  detailedDescription: string;
  icon: typeof MessageCircle;
  color: string;
  bgColor: string;
  image: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

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
      bgColor: "from-slate-600/20 to-slate-700/20",
      image: "/images/sala-linguagem.jpg"
    },
    {
      id: 2,
      title: "Sala da Memória",
      subtitle: "Lembrança e Experiência",
      description: "Neste ambiente, você revive, lembra e assimila experiências e conhecimentos culturais.",
      detailedDescription: "É um mergulho nas suas próprias histórias — cada lembrança, uma ponte entre o passado e o agora. Estímulo e desenvolvimento da memória e expansão de conhecimentos culturais. É o arquivo vivo das suas experiências, onde você cultiva e expande seu repertório cultural.",
      icon: Brain,
      color: "bg-red-800",
      bgColor: "from-red-700/20 to-red-800/20",
      image: "/images/sala-memoria.jpg"
    },
    {
      id: 3,
      title: "Sala de Atividades Executivas",
      subtitle: "Foco, Planejamento e Tomada de Decisão",
      description: "Aqui o cérebro trabalha em alta performance: atenção, planejamento e resolução de problemas.",
      detailedDescription: "Integração corpo-mente, com estímulo da atenção, planejamento e resolução de problemas. É o centro de comando de suas ações, onde as interações se tornam movimento e você fortalece suas habilidades de execução.",
      icon: Dumbbell,
      color: "bg-amber-600",
      bgColor: "from-amber-500/20 to-amber-600/20",
      image: "/images/sala-executiva.jpg"
    },
    {
      id: 4,
      title: "Sala de Contemplação",
      subtitle: "Presença e Integração",
      description: "Depois do esforço cognitivo, chega o momento da pausa. Aqui a mente descansa e consolida.",
      detailedDescription: "É o espaço onde sua mente descansa e consolida. Depois da estimulação, você entra em estado contemplativo ativo, onde o cérebro descansa e integra tudo o que foi vivido. Aqui, a presença se torna aprendizado consolidado.",
      icon: Leaf,
      color: "bg-slate-500",
      bgColor: "from-slate-400/20 to-slate-500/20",
      image: "/images/sala-contemplacao.jpg"
    }
  ];

  return (
    <section id="como-funciona" className="section-padding bg-[#0f2940] relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#c9a961]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#c9a961]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      {/* Título e Descrição */}
      <motion.div
        className="container-elegant mb-16 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="text-center">
          <motion.span
            variants={itemVariants}
            className="inline-block text-sm font-medium text-[#c9a961] uppercase tracking-widest mb-4"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
          >
            Nossa Metodologia
          </motion.span>

          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl lg:text-5xl font-medium text-white mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            data-testid="circuit-title"
          >
            Circuito das 4 Salas
          </motion.h2>

          <motion.div
            variants={itemVariants}
            className="w-16 h-1 bg-gradient-to-r from-transparent via-[#c9a961] to-transparent mx-auto mb-8"
          />

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
            data-testid="circuit-description"
          >
            Cada sala foi cuidadosamente projetada para estimular diferentes capacidades cognitivas. Clique em cada sala para explorar.
          </motion.p>
        </div>
      </motion.div>

      {/* Grid de Fotos das Salas */}
      <motion.div
        className="container-elegant relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {rooms.map((room, index) => (
            <motion.button
              key={room.id}
              variants={itemVariants}
              custom={index}
              onClick={() => setSelectedRoom(room)}
              className="group relative overflow-hidden rounded-2xl aspect-[4/5] cursor-pointer"
              data-testid={`room-card-${room.id}`}
            >
              {/* Imagem de fundo */}
              <img
                src={room.image}
                alt={room.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay gradiente */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f2940]/95 via-[#0f2940]/40 to-transparent transition-all duration-500 group-hover:from-[#0f2940]/80" />

              {/* Conteúdo */}
              <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
                {/* Ícone */}
                <div className={`w-12 h-12 ${room.color} rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110`}>
                  <room.icon className="h-6 w-6 text-white" />
                </div>

                {/* Título */}
                <h3
                  className="text-lg md:text-xl font-medium text-white leading-tight mb-1"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {room.title}
                </h3>

                {/* Subtítulo */}
                <p
                  className="text-sm text-white/70 mb-3"
                  style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                >
                  {room.subtitle}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-2 text-[#c9a961] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <span
                    className="text-sm font-medium"
                    style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                  >
                    Explorar sala
                  </span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Borda hover */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#c9a961]/50 transition-colors duration-300" />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Modal */}
      <Dialog open={!!selectedRoom} onOpenChange={(open) => !open && setSelectedRoom(null)}>
        <DialogContent
          className="max-w-2xl bg-white rounded-3xl p-0 overflow-hidden border-0"
          data-testid={selectedRoom ? `room-modal-${selectedRoom.id}` : 'room-modal'}
        >
          {selectedRoom && (
            <>
              {/* Header com imagem */}
              <div className="relative h-48 md:h-56">
                <img
                  src={selectedRoom.image}
                  alt={selectedRoom.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <DialogHeader className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 ${selectedRoom.color} rounded-xl flex items-center justify-center`}>
                      <selectedRoom.icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <DialogTitle
                        className="text-2xl font-medium text-white"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        {selectedRoom.title}
                      </DialogTitle>
                      <DialogDescription
                        className="text-sm mt-1 text-white/80"
                        style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                      >
                        {selectedRoom.subtitle}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
              </div>

              {/* Conteúdo */}
              <div className="p-6 md:p-8 space-y-4">
                <p
                  className="text-lg font-medium text-[#0f2940] leading-relaxed"
                  style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                >
                  {selectedRoom.description}
                </p>
                <p
                  className="text-base text-[#4a5568] leading-relaxed"
                  style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                >
                  {selectedRoom.detailedDescription}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

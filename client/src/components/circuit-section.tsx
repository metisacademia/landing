import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Brain, Sword, Leaf } from "lucide-react";

export default function CircuitSection() {
  const rooms = [
    {
      id: 1,
      title: "Linguagem",
      subtitle: '"Salão das Palavras"',
      icon: MessageCircle,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300",
      alt: "Cozy library reading room",
      description: "Leitura guiada de trechos breves, discussão de ideias, analogias e vocabulário ativo para fortalecer suas habilidades de comunicação e expressão."
    },
    {
      id: 2,
      title: "Memória",
      subtitle: '"Oficina de Evocação"',
      icon: Brain,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-100",
      image: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300",
      alt: "Modern workspace with learning materials",
      description: "Estratégias de associação (palácio da memória, listas úteis), cartas de treino e estímulos sensoriais para potencializar sua capacidade de retenção."
    },
    {
      id: 3,
      title: "Funções Executivas",
      subtitle: '"Estúdio de Decisão"',
      icon: Sword,
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
      image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300",
      alt: "Strategic planning workspace",
      description: "Planejamento leve de mini-projetos, quebra-cabeças táticos, flexibilidade e mudança de estratégia para aprimorar seu processo decisório."
    },
    {
      id: 4,
      title: "Contemplação",
      subtitle: '"Orvalho"',
      icon: Leaf,
      iconColor: "text-amber-600",
      bgColor: "bg-amber-100",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300",
      alt: "Peaceful meditation and art space",
      description: "Apreciação de artes, música e respiração guiada para reduzir estresse e consolidar aprendizados em um ambiente de total tranquilidade."
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

        <div className="grid lg:grid-cols-2 gap-8">
          {rooms.map((room) => {
            const IconComponent = room.icon;
            return (
              <Card key={room.id} className="shadow-lg border-border" data-testid={`room-${room.id}`}>
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className={`w-12 h-12 ${room.bgColor} rounded-lg flex items-center justify-center mr-4`}>
                      <IconComponent className={`h-6 w-6 ${room.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold">{room.id}. {room.title}</h3>
                      <p className="text-accent font-medium">{room.subtitle}</p>
                    </div>
                  </div>
                  <img 
                    src={room.image} 
                    alt={room.alt} 
                    className="rounded-lg mb-4 w-full h-48 object-cover"
                    data-testid={`room-${room.id}-image`}
                  />
                  <p className="text-muted-foreground" data-testid={`room-${room.id}-description`}>
                    {room.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

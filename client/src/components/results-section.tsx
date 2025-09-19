import { Card, CardContent } from "@/components/ui/card";
import { UserCheck, Eye, CheckSquare, Heart, MessageSquare, Shield } from "lucide-react";

export default function ResultsSection() {
  const results = [
    {
      icon: UserCheck,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      title: "Memória Aprimorada",
      description: "Lembrar nomes, compromissos e detalhes do dia a dia com maior facilidade."
    },
    {
      icon: Eye,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      title: "Foco Intensificado",
      description: "Mais foco para leitura, conversas e atividades que exigem concentração."
    },
    {
      icon: CheckSquare,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      title: "Planejamento Eficaz",
      description: "Planejamento leve de rotinas e decisões mais assertivas no cotidiano."
    },
    {
      icon: Heart,
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600",
      title: "Redução do Estresse",
      description: "Menor tensão através de contemplação, arte e práticas de relaxamento."
    },
    {
      icon: MessageSquare,
      bgColor: "bg-indigo-100",
      iconColor: "text-indigo-600",
      title: "Engajamento Social",
      description: "Conexões significativas em um ambiente elegante e acolhedor."
    },
    {
      icon: Shield,
      bgColor: "bg-rose-100",
      iconColor: "text-rose-600",
      title: "Prevenção Cognitiva",
      description: "Fortalecimento da reserva cognitiva com base em evidências científicas."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-6" data-testid="results-title">
            Resultados que você sente
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="results-description">
            Benefícios práticos que impactam diretamente sua qualidade de vida e bem-estar cognitivo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((result, index) => {
            const IconComponent = result.icon;
            return (
              <Card key={index} className="shadow-lg border-border text-center" data-testid={`result-${index}`}>
                <CardContent className="p-6">
                  <div className={`w-16 h-16 ${result.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className={`h-8 w-8 ${result.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-3" data-testid={`result-${index}-title`}>
                    {result.title}
                  </h3>
                  <p className="text-muted-foreground" data-testid={`result-${index}-description`}>
                    {result.description}
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

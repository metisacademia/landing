import { Card, CardContent } from "@/components/ui/card";
import { Users, Brain, Award, Check, Star } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="sobre" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-6" data-testid="about-title">O que é a Métis</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-muted-foreground leading-relaxed" data-testid="about-description">
              Um circuito semanal de 2 horas e 30 minutos em quatro salas — Linguagem, Memória, Funções Executivas e Contemplação. Você treina capacidades cognitivas em salas imersivas com experiências culturais, conversa qualificada e acompanhamento profissional.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="shadow-lg border-border" data-testid="card-para-quem">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Para quem é</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-accent mt-1 mr-3 flex-shrink-0" />
                  Pessoas que valorizam prevenção, autonomia e bem-estar
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-accent mt-1 mr-3 flex-shrink-0" />
                  Quem quer fortalecer memória, atenção e foco
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-accent mt-1 mr-3 flex-shrink-0" />
                  Famílias que buscam ambiente acolhedor e de alto padrão
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-border" data-testid="card-experiencia">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                <Brain className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-4">A experiência</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-accent mt-1 mr-3 flex-shrink-0" />
                  Ambiente premium: iluminação suave, materiais táteis
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-accent mt-1 mr-3 flex-shrink-0" />
                  Curadoria cultural: livros, obras, filmes e playlists
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-accent mt-1 mr-3 flex-shrink-0" />
                  Grupos pequenos: até 6 pessoas, atenção real
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-border" data-testid="card-diferenciais">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Diferenciais Métis</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-accent mt-1 mr-3 flex-shrink-0" />
                  Base científica com evidências comprovadas
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-accent mt-1 mr-3 flex-shrink-0" />
                  Equipe multidisciplinar especializada
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-accent mt-1 mr-3 flex-shrink-0" />
                  Plano pessoal domiciliar (10-15 min/dia)
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

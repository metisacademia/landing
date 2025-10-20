import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

export default function PricingSection() {
  const [, setLocation] = useLocation();
  
  const plans = [
    {
      name: "Mensal",
      originalPrice: "1.300",
      price: "1.145",
      savings: "155",
      testId: "mensal"
    },
    {
      name: "Trimestral",
      originalPrice: "1.090",
      price: "990",
      savings: "300",
      testId: "trimestral"
    },
    {
      name: "Semestral",
      originalPrice: "990",
      price: "890",
      savings: "600",
      isPopular: true,
      testId: "semestral"
    },
    {
      name: "Anual",
      originalPrice: "890",
      price: "790",
      savings: "1.200",
      testId: "anual"
    }
  ];


  return (
    <section id="planos" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-6" data-testid="pricing-title">
            Planos & Adesão
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="pricing-description">
            Pré-matrícula com vantagens exclusivas e prioridade de horários. Conheça nossos planos e garanta sua vaga.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name}
              className={`shadow-lg ${plan.isPopular ? 'border-2 border-accent' : 'border-border'} relative`}
              data-testid={`plan-${plan.testId}`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-accent text-accent-foreground px-4 py-1 text-sm font-medium">
                    Mais Popular
                  </Badge>
                </div>
              )}
              
              <CardContent className="p-8">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2" data-testid={`plan-${plan.testId}-name`}>
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-2xl line-through text-muted-foreground" data-testid={`plan-${plan.testId}-original-price`}>
                      R$ {plan.originalPrice}
                    </span>
                    <div className="text-4xl font-bold text-primary" data-testid={`plan-${plan.testId}-price`}>
                      R$ {plan.price}
                    </div>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                  <Badge 
                    variant="secondary"
                    className="bg-accent/10 text-accent mb-6"
                    data-testid={`plan-${plan.testId}-savings`}
                  >
                    Economia R$ {plan.savings}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            onClick={() => setLocation('/checkout')}
            className="bg-yellow-500 text-black px-12 py-6 rounded-lg font-semibold text-xl hover:bg-yellow-400 transition-colors shadow-2xl border-2 border-transparent mb-4"
            data-testid="button-pre-matricula-pricing"
          >
            Pré matrícula R$ 250
          </Button>
          <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-lg max-w-md mx-auto" data-testid="text-inauguracao-eta-pricing">
            <p className="text-accent font-medium text-base">
              As atividades iniciam em Novembro/2025. A pré‑matrícula garante prioridade de vaga.
            </p>
          </div>
          <p className="text-muted-foreground" data-testid="guarantee-text">
            Satisfação garantida: se, após a aula experimental, você não perceber valor, devolvemos a pré-matrícula.
          </p>
        </div>
      </div>
    </section>
  );
}

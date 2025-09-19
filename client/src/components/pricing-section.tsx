import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PricingSection() {
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

  const navigateToCheckout = (plan: string) => {
    window.location.href = `/checkout?plan=${plan}`;
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="planos" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-6" data-testid="pricing-title">
            Planos & Adesão
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="pricing-description">
            Pré-matrícula com vantagens exclusivas e prioridade de horários. Escolha o plano ideal para você.
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
                  <Button 
                    onClick={() => navigateToCheckout(plan.testId)}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                      plan.isPopular 
                        ? 'bg-accent text-accent-foreground hover:bg-accent/90' 
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                    data-testid={`plan-${plan.testId}-button`}
                  >
                    Escolher Plano
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4" data-testid="guarantee-text">
            Satisfação garantida: se, após a aula experimental, você não perceber valor, devolvemos a pré-matrícula.
          </p>
          <Button 
            variant="secondary"
            onClick={() => scrollToSection('contato')}
            className="bg-secondary text-secondary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-secondary/80 transition-colors"
            data-testid="button-aula-experimental"
          >
            Agendar Aula Experimental
          </Button>
        </div>
      </div>
    </section>
  );
}

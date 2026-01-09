import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PricingSection() {
  const openWhatsApp = () => {
    window.open('https://wa.me/5581992726495', '_blank');
  };
  
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
        <div className="text-center mb-8">
          <span className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-medium">
            Vagas limitadas: máximo 6 alunos por turma
          </span>
        </div>
        
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-6" data-testid="pricing-title">
            Planos & Adesão
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="pricing-description">
            Conheça nossos planos e agende sua aula experimental para descobrir a Métis.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name}
              className={`shadow-lg ${plan.isPopular ? 'border-2 border-[#cda465]' : 'border-border'} relative`}
              data-testid={`plan-${plan.testId}`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="px-4 py-1 text-sm font-medium bg-[#cda465] text-[#0b0b28]">
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
                    <div className="text-4xl font-bold text-primary" data-testid={`plan-${plan.testId}-price`}>
                      R$ {plan.price}
                    </div>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                  <Badge 
                    variant="secondary"
                    className="bg-accent/10 mb-6 text-[#cda465]"
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
            onClick={openWhatsApp}
            className="px-12 py-6 rounded-lg font-semibold text-xl hover:bg-yellow-400 transition-colors shadow-2xl border-2 border-transparent mb-4 bg-[#cda465] text-[#0b0b28]"
            data-testid="button-agende-aula-pricing"
          >
            Agende sua aula experimental
          </Button>
          <p className="text-muted-foreground" data-testid="guarantee-text">
            Venha conhecer a Métis e descobrir como podemos ajudar você a desenvolver seu potencial cognitivo.
          </p>
        </div>
      </div>
    </section>
  );
}

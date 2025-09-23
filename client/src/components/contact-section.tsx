import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactSection() {
  const navigateToCheckout = () => {
    window.location.href = '/checkout';
  };

  return (
    <section id="contato" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-6" data-testid="contact-title">
            Visite a Métis
          </h2>
          <p className="text-xl text-muted-foreground" data-testid="contact-description">
            Agende sua visita, conheça as salas e faça sua pré-matrícula.
          </p>
          <div className="mt-4" data-testid="text-inauguracao-eta-contact">
            <p className="text-sm text-muted-foreground bg-muted/30 inline-block px-4 py-2 rounded-lg">
              📅 Estamos em fase de implantação. Inauguração prevista: Novembro/2025.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <div className="space-y-8">
              <div className="flex items-start" data-testid="contact-whatsapp">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">WhatsApp</h3>
                  <p className="text-muted-foreground mb-2">Para agendamentos e dúvidas</p>
                  <a 
                    href="https://wa.me/5581991032142" 
                    className="text-primary hover:underline font-medium"
                    data-testid="link-whatsapp"
                  >
                    (81) 99103-2142
                  </a>
                </div>
              </div>

              <div className="flex items-start" data-testid="contact-email">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">E-mail</h3>
                  <p className="text-muted-foreground mb-2">Atendimento e informações</p>
                  <a 
                    href="mailto:atendimento@metisacademia.com.br" 
                    className="text-primary hover:underline font-medium"
                    data-testid="link-email"
                  >
                    atendimento@metisacademia.com.br
                  </a>
                </div>
              </div>

              <div className="flex items-start" data-testid="contact-address">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Endereço</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Kronos Empresarial<br />
                    R. das Pernambucanas, 407, Sala 1203<br />
                    Graças, Recife/PE<br />
                    CEP 52011-010
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={navigateToCheckout}
                  className="bg-accent text-accent-foreground px-8 py-4 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
                  data-testid="button-final-pre-matricula"
                >
                  Garantir minha vaga na pré-matrícula
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.open('https://wa.me/5581991032142', '_blank')}
                  className="border-2 border-primary text-primary px-8 py-4 rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
                  data-testid="button-agendar-visita"
                >
                  Agendar Visita
                </Button>
              </div>
            </div>
          </div>

          <Card className="p-1 shadow-lg border-border overflow-hidden" data-testid="contact-map">
            <iframe
              src="https://www.google.com/maps?q=-8.0508354,-34.9014247+(Kronos+Empresarial+-+R.+das+Pernambucanas,+407)&hl=pt-BR&z=18&output=embed"
              width="100%"
              height="384"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-96 rounded-lg"
              title="Localização da Métis - Kronos Empresarial, Graças, Recife/PE"
            />
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Localização no coração do bairro das Graças, com fácil acesso e estacionamento.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

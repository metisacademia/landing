import { Card } from "@/components/ui/card";
import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contato" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-6" data-testid="contact-title">
            Visite a Métis
          </h2>
          <p className="text-xl text-muted-foreground" data-testid="contact-description">
            Agende sua aula experimental e conheça as salas da Métis.
          </p>
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
                    href="https://wa.me/5581992726495" 
                    className="text-primary hover:underline font-medium"
                    data-testid="link-whatsapp"
                  >
                    (81) 99272-6495
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

          </div>

          <Card className="p-1 shadow-lg border-border overflow-hidden" data-testid="contact-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.3616453890694!2d-34.90382162408836!3d-8.050835480762887!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ab18bc401b8f85%3A0x7eb5e3fc5c8e3d0f!2sKronos%20Empresarial!5e0!3m2!1spt-BR!2sbr!4v1729627104000!5m2!1spt-BR!2sbr"
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

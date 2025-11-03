import { Instagram, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="py-12 bg-[#173b5a] text-[#f8f1e7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="mb-4">
              <img 
                src="/images/logo-metis.jpg?v=2" 
                alt="Métis - Academia da Mente" 
                className="h-12"
                data-testid="footer-logo"
              />
            </div>
            <p className="text-primary-foreground/80 leading-relaxed mb-4" data-testid="footer-description">
              Espaço premium de estímulo cognitivo que combina ciência, cultura e convivência para exercitar sua mente e cultivar sua memória.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/metisacademiabr/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                data-testid="social-instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4" data-testid="footer-nav-title">Navegação</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection('sobre')}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  data-testid="footer-nav-sobre"
                >
                  Sobre
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('como-funciona')}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  data-testid="footer-nav-como-funciona"
                >
                  Como Funciona
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('planos')}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  data-testid="footer-nav-planos"
                >
                  Planos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contato')}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  data-testid="footer-nav-contato"
                >
                  Contato
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" data-testid="footer-contact-title">Contato</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li className="flex items-center" data-testid="footer-phone">
                <Phone className="h-4 w-4 mr-2" />
                (81) 99103-2141
              </li>
              <li className="flex items-center" data-testid="footer-email">
                <Mail className="h-4 w-4 mr-2" />
                <a href="mailto:atendimento@metis.com.br" className="hover:text-primary-foreground transition-colors">
                  atendimento@metis.com.br
                </a>
              </li>
              <li className="flex items-center" data-testid="footer-location">
                <MapPin className="h-4 w-4 mr-2" />
                Graças, Recife/PE
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/80" data-testid="footer-copyright">
            <Link href="/admin/login" className="hover:text-primary-foreground transition-colors cursor-pointer">©</Link> 2025 Métis - Academia da Mente. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

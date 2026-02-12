import { Instagram, Phone, Mail, MapPin, Heart } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

// Declaração do dataLayer para TypeScript
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export default function Footer() {
  // Função de rastreamento para GTM
  const trackPhoneClick = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'phone_click',
      'click_source': 'footer'
    });
  };
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { id: 'sobre', label: 'Sobre', testId: 'footer-nav-sobre' },
    { id: 'como-funciona', label: 'Como Funciona', testId: 'footer-nav-como-funciona' },
    { id: 'planos', label: 'Planos', testId: 'footer-nav-planos' },
    { id: 'contato', label: 'Contato', testId: 'footer-nav-contato' },
  ];

  return (
    <footer className="bg-[#0f2940] text-white">
      {/* Main footer content */}
      <div className="container-elegant py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo e descrição */}
          <div className="lg:col-span-2">
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <img
                src="/images/logo-metis-color-offwhite.png"
                alt="Métis - Academia da Mente"
                className="h-12"
                data-testid="footer-logo"
              />
            </motion.div>
            <p
              className="text-white/70 leading-relaxed mb-6 max-w-md"
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
              data-testid="footer-description"
            >
              Espaço premium de estímulo cognitivo que combina ciência, cultura e convivência para exercitar sua mente e cultivar sua memória.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/metisacademiabr/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#c9a961] transition-colors group"
                data-testid="social-instagram"
              >
                <Instagram className="h-5 w-5 text-white/80 group-hover:text-[#0f2940]" />
              </a>
            </div>
          </div>

          {/* Navegação */}
          <div>
            <h4
              className="font-medium text-lg mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              data-testid="footer-nav-title"
            >
              Navegação
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="relative text-white/70 hover:text-white transition-colors group"
                    style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                    data-testid={link.testId}
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#c9a961] transition-all duration-300 group-hover:w-full" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4
              className="font-medium text-lg mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              data-testid="footer-contact-title"
            >
              Contato
            </h4>
            <ul className="space-y-4">
              <li
                className="flex items-center gap-3 text-white/70"
                data-testid="footer-phone"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <span style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                  (81) 99272-6495
                </span>
              </li>
              <li data-testid="footer-email">
                <a
                  href="mailto:atendimento@metisacademia.com.br"
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                    atendimento@metisacademia.com.br
                  </span>
                </a>
              </li>
              <li
                className="flex items-center gap-3 text-white/70"
                data-testid="footer-location"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <span style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                  Graças, Recife/PE
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-elegant py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p
              className="text-white/60 text-sm"
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
              data-testid="footer-copyright"
            >
              <Link href="/admin/login" className="hover:text-white/80 transition-colors cursor-pointer">©</Link>
              {" "}2025 Métis - Academia da Mente. Todos os direitos reservados.
            </p>
            <p
              className="text-white/40 text-sm flex items-center gap-1"
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
            >
              Feito com <Heart className="w-4 h-4 text-[#c9a961] fill-[#c9a961]" /> em Recife
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

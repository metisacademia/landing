import { Instagram, Phone, Mail, MapPin, Heart } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { WhatsAppAnchor } from "@/components/whatsapp-anchor";
import {
  ADDRESS_ONE_LINE,
  EMAIL,
  footerExplore,
  INSTAGRAM_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
  roomOrder,
  rooms,
  TRIAL_MESSAGE,
} from "@/lib/site";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export default function Footer() {
  const trackPhoneClick = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "phone_click",
      click_source: "footer",
    });
  };

  return (
    <footer className="bg-[#0f2940] text-white">
      <div className="container-elegant py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/">
                <img
                  src="/images/logo-metis-color-offwhite.png"
                  alt="Métis Academia da Mente"
                  width={1080}
                  height={1080}
                  loading="lazy"
                  decoding="async"
                  className="h-12 w-auto"
                  data-testid="footer-logo"
                />
              </Link>
            </motion.div>
            <p
              className="text-white/70 leading-relaxed mb-6"
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
              data-testid="footer-description"
            >
              Espaço premium de estímulo cognitivo que combina ciência, cultura e convivência para exercitar sua mente e cultivar sua memória.
            </p>
            <div className="flex gap-4">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da Métis Academia da Mente"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#c9a961] transition-colors group"
                data-testid="social-instagram"
              >
                <Instagram className="h-5 w-5 text-white/80 group-hover:text-[#0f2940]" />
              </a>
            </div>
          </div>

          <div>
            <h2
              className="font-medium text-lg mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Navegação
            </h2>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-white/70 hover:text-white transition-colors" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                  Início
                </Link>
              </li>
              {footerExplore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors"
                    style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2
              className="font-medium text-lg mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Salas
            </h2>
            <ul className="space-y-3">
              {roomOrder.map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/salas/${slug}`}
                    className="text-white/70 hover:text-white transition-colors"
                    style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                  >
                    {rooms[slug].title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2
              className="font-medium text-lg mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              data-testid="footer-contact-title"
            >
              Contato
            </h2>
            <ul className="space-y-4">
              <li data-testid="footer-phone">
                <a
                  href={`tel:${PHONE_TEL}`}
                  onClick={trackPhoneClick}
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>{PHONE_DISPLAY}</span>
                </a>
              </li>
              <li>
                <WhatsAppAnchor
                  position="footer"
                  message={TRIAL_MESSAGE}
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>WhatsApp {PHONE_DISPLAY}</span>
                </WhatsAppAnchor>
              </li>
              <li data-testid="footer-email">
                <a
                  href={`mailto:${EMAIL}`}
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>{EMAIL}</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/70" data-testid="footer-location">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <span style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>{ADDRESS_ONE_LINE}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-elegant py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p
              className="text-white/60 text-sm"
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
              data-testid="footer-copyright"
            >
              <Link href="/admin/login" className="hover:text-white/80 transition-colors cursor-pointer">©</Link>
              {" "}2026 Métis Academia da Mente. Todos os direitos reservados.
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

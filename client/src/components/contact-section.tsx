import { Card } from "@/components/ui/card";
import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

// Declaração do dataLayer para TypeScript
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export default function ContactSection() {
  // Funções de rastreamento para GTM
  const trackWhatsAppClick = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'whatsapp_click',
      'click_source': 'contact_section'
    });
  };

  const trackPhoneClick = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'phone_click',
      'click_source': 'contact_section'
    });
  };

  const contactItems = [
    {
      icon: Phone,
      title: "WhatsApp",
      subtitle: "Para agendamentos e dúvidas",
      content: "(81) 99272-6495",
      href: "https://wa.me/5581992726495",
      testId: "contact-whatsapp",
      linkTestId: "link-whatsapp",
      onClick: trackWhatsAppClick,
    },
    {
      icon: Mail,
      title: "E-mail",
      subtitle: "Atendimento e informações",
      content: "atendimento@metisacademia.com.br",
      href: "mailto:atendimento@metisacademia.com.br",
      testId: "contact-email",
      linkTestId: "link-email",
    },
    {
      icon: MapPin,
      title: "Endereço",
      subtitle: "Kronos Empresarial",
      content: "R. das Pernambucanas, 407, Sala 1203\nGraças, Recife/PE\nCEP 52011-010",
      testId: "contact-address",
    },
  ];

  return (
    <section id="contato" className="section-padding bg-white relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#c9a961]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#0f2940]/5 rounded-full blur-3xl" />

      <div className="container-elegant relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.span
            variants={itemVariants}
            className="inline-block text-sm font-medium text-[#c9a961] uppercase tracking-widest mb-4"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
          >
            Venha nos visitar
          </motion.span>

          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl lg:text-5xl font-medium text-[#0f2940] mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            data-testid="contact-title"
          >
            Visite a Métis
          </motion.h2>

          <motion.div
            variants={itemVariants}
            className="w-16 h-1 bg-gradient-to-r from-transparent via-[#c9a961] to-transparent mx-auto mb-8"
          />

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-[#4a5568] max-w-2xl mx-auto"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
            data-testid="contact-description"
          >
            Agende sua aula experimental e conheça as salas da Métis.
          </motion.p>
        </motion.div>

        {/* Grid de contato */}
        <motion.div
          className="grid lg:grid-cols-2 gap-12 items-start"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {/* Informações de contato */}
          <motion.div variants={itemVariants} className="space-y-6">
            {contactItems.map((item, index) => (
              <div
                key={index}
                className="group flex items-start gap-5 p-6 rounded-2xl bg-[#faf8f5] hover:bg-[#f5f2ed] transition-colors"
                data-testid={item.testId}
              >
                <div className="w-14 h-14 bg-[#0f2940]/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#c9a961]/15 transition-colors">
                  <item.icon className="h-6 w-6 text-[#0f2940] group-hover:text-[#c9a961] transition-colors" />
                </div>
                <div>
                  <h3
                    className="text-lg font-medium text-[#0f2940] mb-1"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm text-[#4a5568] mb-2"
                    style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                  >
                    {item.subtitle}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      onClick={item.onClick}
                      className="inline-flex items-center gap-1 text-[#c9a961] hover:text-[#b89a52] font-medium transition-colors"
                      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                      data-testid={item.linkTestId}
                    >
                      {item.content}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <p
                      className="text-[#4a5568] whitespace-pre-line leading-relaxed"
                      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                    >
                      {item.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Mapa */}
          <motion.div variants={itemVariants}>
            <Card
              className="overflow-hidden rounded-3xl shadow-lg border-0"
              data-testid="contact-map"
            >
              <div className="relative">
                <div className="w-full h-80 bg-gradient-to-br from-[#0f2940] to-[#1a3a5c] flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <div className="w-20 h-20 bg-[#c9a961]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MapPin className="h-10 w-10 text-[#c9a961]" />
                    </div>
                    <h3
                      className="text-2xl font-medium mb-3"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Kronos Empresarial
                    </h3>
                    <p
                      className="text-white/70"
                      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                    >
                      R. das Pernambucanas, 407, Sala 1203<br />
                      Graças, Recife/PE
                    </p>
                  </div>
                </div>
                <a
                  href="https://maps.google.com/?q=Kronos+Empresarial+Recife+Gracas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 right-4 inline-flex items-center gap-2 bg-white px-5 py-3 rounded-xl shadow-lg text-[#0f2940] font-medium hover:bg-[#faf8f5] transition-colors"
                  style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                >
                  Ver no Google Maps
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <div className="p-5 text-center bg-[#faf8f5]">
                <p
                  className="text-sm text-[#4a5568]"
                  style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                >
                  Localização no coração do bairro das Graças, com fácil acesso e estacionamento.
                </p>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

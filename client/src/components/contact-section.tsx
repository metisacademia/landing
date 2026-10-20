import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { trackWhatsAppClick } from "@/lib/whatsapp";
import { MAPS_URL } from "@/lib/site";

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
  const contactItems = [
    {
      icon: Phone,
      title: "WhatsApp",
      subtitle: "Para agendamentos e dúvidas",
      content: "(81) 99272-6495",
      href: "https://wa.me/5581992726495?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20aula%20experimental%20na%20M%C3%A9tis.",
      testId: "contact-whatsapp",
      linkTestId: "link-whatsapp",
      onClick: () => trackWhatsAppClick("contact_section"),
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
          className="grid min-w-0 items-start gap-8 lg:grid-cols-2 lg:gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {/* Informações de contato */}
          <motion.div variants={itemVariants} className="w-full min-w-0 space-y-4 sm:space-y-6">
            {contactItems.map((item, index) => (
              <div
                key={index}
                className="group flex w-full min-w-0 items-start gap-4 rounded-2xl bg-[#faf8f5] p-4 transition-colors hover:bg-[#f5f2ed] sm:gap-5 sm:p-6"
                data-testid={item.testId}
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#0f2940]/10 transition-colors group-hover:bg-[#c9a961]/15 sm:h-14 sm:w-14">
                  <item.icon className="h-6 w-6 text-[#0f2940] transition-colors group-hover:text-[#c9a961]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3
                    className="mb-1 text-lg font-medium text-[#0f2940]"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="mb-2 text-sm text-[#4a5568]"
                    style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                  >
                    {item.subtitle}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      onClick={item.onClick}
                      className="inline-flex max-w-full items-start gap-1 font-medium text-[#c9a961] transition-colors hover:text-[#b89a52]"
                      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                      data-testid={item.linkTestId}
                    >
                      {item.content.includes("@") ? (
                        <span className="min-w-0 text-sm leading-snug [overflow-wrap:normal] sm:text-base">
                          <span className="whitespace-nowrap">{item.content.slice(0, item.content.indexOf("@") + 1)}</span>
                          <wbr />
                          <span className="whitespace-nowrap">{item.content.slice(item.content.indexOf("@") + 1)}</span>
                        </span>
                      ) : (
                        <span className="min-w-0">{item.content}</span>
                      )}
                      <ExternalLink className="mt-0.5 h-4 w-4 shrink-0" />
                    </a>
                  ) : (
                    <p
                      className="break-words whitespace-pre-line leading-relaxed text-[#4a5568]"
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
          <motion.div variants={itemVariants} className="w-full min-w-0">
            <Card
              className="w-full min-w-0 overflow-hidden rounded-3xl border-0 shadow-lg"
              data-testid="contact-map"
            >
              <div className="relative">
                <div className="flex min-h-72 w-full flex-col items-center justify-center bg-gradient-to-br from-[#0f2940] to-[#1a3a5c] px-5 py-8 sm:min-h-80 sm:px-8">
                  <div className="w-full max-w-full text-center text-white">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#c9a961]/20">
                      <MapPin className="h-10 w-10 text-[#c9a961]" />
                    </div>
                    <h3
                      className="mb-3 text-2xl font-medium"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Kronos Empresarial
                    </h3>
                    <p
                      className="break-words text-white/70"
                      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                    >
                      R. das Pernambucanas, 407, Sala 1203
                      <br />
                      Graças, Recife/PE
                    </p>
                    <a
                      href={MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex max-w-full items-center justify-center gap-2 whitespace-normal rounded-xl bg-white px-5 py-3 text-center font-medium text-[#0f2940] shadow-lg transition-colors hover:bg-[#faf8f5]"
                      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                    >
                      Ver no Google Maps
                      <ExternalLink className="h-4 w-4 shrink-0" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-5 text-center bg-[#faf8f5]">
                <p
                  className="text-sm text-[#4a5568]"
                  style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                >
                  Localização no coração do bairro das Graças, com fácil acesso e estacionamento.{" "}
                  <Link href="/contato" className="text-[#0f2940] font-medium underline decoration-[#c9a961] underline-offset-4">
                    Como chegar
                  </Link>
                </p>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

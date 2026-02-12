import { Card, CardContent } from "@/components/ui/card";
import { Users, Brain, Award, Check, Star } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export default function AboutSection() {
  const cards = [
    {
      testId: "card-para-quem",
      icon: Users,
      iconBg: "bg-[#0f2940]/10",
      iconColor: "text-[#0f2940]",
      title: "Para quem é",
      items: [
        { icon: Check, text: "Pessoas que valorizam prevenção, autonomia e bem-estar" },
        { icon: Check, text: "Quem quer fortalecer memória, atenção e foco" },
        { icon: Check, text: "Famílias que buscam ambiente acolhedor e de alto padrão" },
      ],
    },
    {
      testId: "card-experiencia",
      icon: Brain,
      iconBg: "bg-[#c9a961]/15",
      iconColor: "text-[#c9a961]",
      title: "A experiência",
      items: [
        { icon: Star, text: "Ambiente premium: iluminação suave, materiais táteis" },
        { icon: Star, text: "Curadoria cultural: livros, obras, filmes e playlists" },
        { icon: Star, text: "Grupos pequenos: até 6 pessoas, atenção real" },
      ],
    },
    {
      testId: "card-diferenciais",
      icon: Award,
      iconBg: "bg-[#0f2940]/10",
      iconColor: "text-[#0f2940]",
      title: "Diferenciais Métis",
      items: [
        { icon: Check, text: "Base científica com evidências comprovadas" },
        { icon: Check, text: "Equipe multidisciplinar especializada" },
        { icon: Check, text: "Metodologia exclusiva desenvolvida por neurologistas" },
      ],
    },
  ];

  return (
    <section id="sobre" className="section-padding bg-[#faf8f5]">
      <div className="container-elegant">
        {/* Header */}
        <motion.div
          className="text-center mb-16 lg:mb-20"
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
            Conheça a Métis
          </motion.span>

          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl lg:text-5xl font-medium text-[#0f2940] mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            data-testid="about-title"
          >
            O que é a Métis
          </motion.h2>

          {/* Underline decorativo */}
          <motion.div
            variants={itemVariants}
            className="w-16 h-1 bg-gradient-to-r from-transparent via-[#c9a961] to-transparent mx-auto mb-8"
          />

          <motion.div variants={itemVariants} className="max-w-3xl mx-auto">
            <p
              className="text-lg md:text-xl text-[#4a5568] leading-relaxed"
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
              data-testid="about-description"
            >
              Um circuito semanal de 2 horas e 30 minutos em quatro salas — Linguagem, Memória, Funções Executivas e Contemplação. Você treina capacidades cognitivas em salas imersivas com experiências culturais, conversa qualificada e acompanhamento profissional.
            </p>
          </motion.div>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 lg:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {cards.map((card, index) => (
            <motion.div key={card.testId} variants={cardVariants} custom={index}>
              <Card
                className="group h-full bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-500 rounded-2xl overflow-hidden"
                data-testid={card.testId}
              >
                <CardContent className="p-8 lg:p-10">
                  {/* Ícone com animação */}
                  <motion.div
                    className={`w-16 h-16 ${card.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <card.icon className={`h-8 w-8 ${card.iconColor}`} />
                  </motion.div>

                  {/* Título */}
                  <h3
                    className="text-xl lg:text-2xl font-medium text-[#0f2940] mb-6"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {card.title}
                  </h3>

                  {/* Lista de itens */}
                  <ul className="space-y-4">
                    {card.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start group/item">
                        <div className="w-6 h-6 rounded-full bg-[#c9a961]/15 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0 group-hover/item:bg-[#c9a961]/25 transition-colors">
                          <item.icon className="h-3.5 w-3.5 text-[#c9a961]" />
                        </div>
                        <span
                          className="text-[#4a5568] leading-relaxed"
                          style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                        >
                          {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

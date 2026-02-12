import { Card, CardContent } from "@/components/ui/card";
import { UserCheck, Eye, CheckSquare, Heart, MessageSquare, Shield } from "lucide-react";
import { motion } from "framer-motion";

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

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export default function ResultsSection() {
  const results = [
    {
      icon: UserCheck,
      bgColor: "bg-[#0f2940]/10",
      iconColor: "text-[#0f2940]",
      title: "Memória Aprimorada",
      description: "Lembrar nomes, compromissos e detalhes do dia a dia com maior facilidade."
    },
    {
      icon: Eye,
      bgColor: "bg-[#c9a961]/15",
      iconColor: "text-[#c9a961]",
      title: "Foco Intensificado",
      description: "Mais foco para leitura, conversas e atividades que exigem concentração."
    },
    {
      icon: CheckSquare,
      bgColor: "bg-[#0f2940]/10",
      iconColor: "text-[#0f2940]",
      title: "Planejamento Eficaz",
      description: "Planejamento leve de rotinas e decisões mais assertivas no cotidiano."
    },
    {
      icon: Heart,
      bgColor: "bg-[#c9a961]/15",
      iconColor: "text-[#c9a961]",
      title: "Redução do Estresse",
      description: "Menor tensão através de contemplação, arte e práticas de relaxamento."
    },
    {
      icon: MessageSquare,
      bgColor: "bg-[#0f2940]/10",
      iconColor: "text-[#0f2940]",
      title: "Engajamento Social",
      description: "Conexões significativas em um ambiente elegante e acolhedor."
    },
    {
      icon: Shield,
      bgColor: "bg-[#c9a961]/15",
      iconColor: "text-[#c9a961]",
      title: "Prevenção Cognitiva",
      description: "Fortalecimento da reserva cognitiva com base em evidências científicas."
    }
  ];

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      {/* Elemento decorativo */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-[#c9a961]/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-[#0f2940]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

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
            Benefícios
          </motion.span>

          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl lg:text-5xl font-medium text-[#0f2940] mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            data-testid="results-title"
          >
            Resultados que você sente
          </motion.h2>

          <motion.div
            variants={itemVariants}
            className="w-16 h-1 bg-gradient-to-r from-transparent via-[#c9a961] to-transparent mx-auto mb-8"
          />

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-[#4a5568] max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
            data-testid="results-description"
          >
            Benefícios práticos que impactam diretamente sua qualidade de vida e bem-estar cognitivo.
          </motion.p>
        </motion.div>

        {/* Grid de cards */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {results.map((result, index) => {
            const IconComponent = result.icon;
            return (
              <motion.div key={index} variants={cardVariants}>
                <Card
                  className="group h-full bg-[#faf8f5] border-0 shadow-sm hover:shadow-lg transition-all duration-500 rounded-2xl overflow-hidden"
                  data-testid={`result-${index}`}
                >
                  <CardContent className="p-8 text-center">
                    {/* Ícone com animação */}
                    <motion.div
                      className={`w-16 h-16 ${result.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <IconComponent className={`h-8 w-8 ${result.iconColor}`} />
                    </motion.div>

                    {/* Título */}
                    <h3
                      className="text-xl font-medium text-[#0f2940] mb-3"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      data-testid={`result-${index}-title`}
                    >
                      {result.title}
                    </h3>

                    {/* Descrição */}
                    <p
                      className="text-[#4a5568] leading-relaxed"
                      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                      data-testid={`result-${index}-description`}
                    >
                      {result.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

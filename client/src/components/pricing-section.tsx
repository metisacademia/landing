import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Check, Sparkles, Users } from "lucide-react";

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
      testId: "mensal",
      benefits: [
        "1 aula semanal de 2h30",
        "Circuito completo das 4 salas",
        "Material didático incluso",
      ]
    },
    {
      name: "Trimestral",
      originalPrice: "1.090",
      price: "990",
      savings: "300",
      testId: "trimestral",
      benefits: [
        "1 aula semanal de 2h30",
        "Circuito completo das 4 salas",
        "Material didático incluso",
        "Acompanhamento personalizado",
      ]
    },
    {
      name: "Semestral",
      originalPrice: "990",
      price: "890",
      savings: "600",
      isPopular: true,
      testId: "semestral",
      benefits: [
        "1 aula semanal de 2h30",
        "Circuito completo das 4 salas",
        "Material didático incluso",
        "Acompanhamento personalizado",
        "Relatório de evolução",
      ]
    },
    {
      name: "Anual",
      originalPrice: "890",
      price: "790",
      savings: "1.200",
      testId: "anual",
      benefits: [
        "1 aula semanal de 2h30",
        "Circuito completo das 4 salas",
        "Material didático incluso",
        "Acompanhamento personalizado",
        "Relatório de evolução",
        "Prioridade em eventos",
      ]
    }
  ];

  return (
    <section id="planos" className="section-padding bg-[#0f2940] relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#c9a961]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#c9a961]/5 rounded-full blur-3xl" />

      <div className="container-elegant relative z-10">
        {/* Badge de escassez */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
          >
            <Users className="w-4 h-4 text-[#c9a961]" />
            Vagas limitadas: máximo 6 alunos por turma
          </span>
        </motion.div>

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
            Investimento
          </motion.span>

          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl lg:text-5xl font-medium text-white mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            data-testid="pricing-title"
          >
            Planos & Adesão
          </motion.h2>

          <motion.div
            variants={itemVariants}
            className="w-16 h-1 bg-gradient-to-r from-transparent via-[#c9a961] to-transparent mx-auto mb-8"
          />

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
            data-testid="pricing-description"
          >
            Escolha o plano ideal para você e comece sua jornada de fortalecimento cognitivo.
          </motion.p>
        </motion.div>

        {/* Cards de preço */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {plans.map((plan, index) => (
            <motion.div key={plan.name} variants={cardVariants} custom={index}>
              <Card
                className={`group h-full bg-white/5 backdrop-blur-sm border transition-all duration-500 rounded-2xl overflow-hidden ${
                  plan.isPopular
                    ? 'border-[#c9a961] shadow-lg shadow-[#c9a961]/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
                data-testid={`plan-${plan.testId}`}
              >
                {/* Badge popular */}
                {plan.isPopular && (
                  <div className="bg-gradient-to-r from-[#c9a961] to-[#b89a52] px-4 py-2 text-center">
                    <span
                      className="text-sm font-semibold text-[#0f2940] flex items-center justify-center gap-2"
                      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                    >
                      <Sparkles className="w-4 h-4" />
                      Mais Popular
                    </span>
                  </div>
                )}

                <CardContent className="p-5 sm:p-6 md:p-8">
                  {/* Nome do plano */}
                  <h3
                    className="text-xl font-medium text-white mb-4"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    data-testid={`plan-${plan.testId}-name`}
                  >
                    {plan.name}
                  </h3>

                  {/* Preço */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span
                        className="text-2xl sm:text-3xl md:text-4xl font-medium text-white"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        data-testid={`plan-${plan.testId}-price`}
                      >
                        R$ {plan.price}
                      </span>
                      <span
                        className="text-white/60"
                        style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                      >
                        /mês
                      </span>
                    </div>
                    <Badge
                      className="mt-2 bg-[#c9a961]/20 text-[#c9a961] border-[#c9a961]/30 hover:bg-[#c9a961]/30"
                      data-testid={`plan-${plan.testId}-savings`}
                    >
                      Economia R$ {plan.savings}
                    </Badge>
                  </div>

                  {/* Benefícios */}
                  <ul className="space-y-3 mb-8">
                    {plan.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#c9a961]/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                          <Check className="w-3 h-3 text-[#c9a961]" />
                        </div>
                        <span
                          className="text-sm text-white/80"
                          style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                        >
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    onClick={openWhatsApp}
                    className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
                      plan.isPopular
                        ? 'bg-gradient-to-r from-[#c9a961] to-[#b89a52] text-[#0f2940] hover:shadow-lg hover:shadow-[#c9a961]/25'
                        : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                    }`}
                    style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                  >
                    Escolher plano
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA principal */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Button
            onClick={openWhatsApp}
            className="px-12 py-6 rounded-xl font-semibold text-lg bg-gradient-to-r from-[#c9a961] to-[#b89a52] text-[#0f2940] hover:shadow-xl hover:shadow-[#c9a961]/25 transition-all duration-300 hover:scale-[1.02]"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
            data-testid="button-agende-aula-pricing"
          >
            Agende sua aula experimental gratuita
          </Button>
          <p
            className="text-white/60 mt-4"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
            data-testid="guarantee-text"
          >
            Conheça a Métis antes de decidir • Sem compromisso
          </p>
        </motion.div>
      </div>
    </section>
  );
}

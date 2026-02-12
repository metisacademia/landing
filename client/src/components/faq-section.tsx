import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

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

export default function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "Como funciona o circuito das 4 salas?",
      answer: "O circuito é uma jornada semanal de 2h30 por quatro ambientes temáticos: Linguagem, Memória, Funções Executivas e Contemplação. Cada sala trabalha diferentes capacidades cognitivas com atividades práticas e culturais."
    },
    {
      question: "Preciso de encaminhamento médico?",
      answer: "Não é obrigatório. A Métis é um programa de estímulo cognitivo preventivo, aberto a qualquer pessoa interessada em cuidar da saúde mental e cognitiva."
    },
    {
      question: "Como escolho meus horários?",
      answer: "Ao se matricular, você indica suas preferências de dias e horários. Nossa equipe confirma a disponibilidade por WhatsApp, garantindo o melhor encaixe em sua rotina."
    },
    {
      question: "Posso fazer uma aula experimental?",
      answer: "Sim! Oferecemos aula experimental gratuita para você conhecer nossa metodologia, equipe e ambiente antes de tomar sua decisão."
    },
    {
      question: "Quantas pessoas por turma?",
      answer: "Trabalhamos com grupos pequenos de até 6 pessoas, garantindo atenção personalizada e interação de qualidade entre os participantes."
    },
    {
      question: "Qual a base científica da metodologia?",
      answer: "Nossa metodologia foi desenvolvida por neurologistas e é baseada em intervenções não-farmacológicas com evidências científicas comprovadas em estudos sobre envelhecimento cognitivo saudável."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section className="section-padding bg-[#faf8f5] relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-[#c9a961]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-[#0f2940]/5 rounded-full blur-3xl" />

      <div className="container-elegant max-w-4xl relative z-10">
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
            className="inline-flex items-center gap-2 text-sm font-medium text-[#c9a961] uppercase tracking-widest mb-4"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
          >
            <HelpCircle className="w-4 h-4" />
            Dúvidas
          </motion.span>

          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl lg:text-5xl font-medium text-[#0f2940] mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            data-testid="faq-title"
          >
            Perguntas Frequentes
          </motion.h2>

          <motion.div
            variants={itemVariants}
            className="w-16 h-1 bg-gradient-to-r from-transparent via-[#c9a961] to-transparent mx-auto"
          />
        </motion.div>

        {/* FAQs */}
        <motion.div
          className="space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`bg-white rounded-2xl overflow-hidden shadow-sm transition-all duration-300 ${
                openFAQ === index
                  ? 'shadow-lg ring-1 ring-[#c9a961]/20'
                  : 'hover:shadow-md'
              }`}
              data-testid={`faq-${index}`}
            >
              <button
                className="w-full p-4 sm:p-6 md:p-8 text-left flex justify-between items-center gap-4"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openFAQ === index}
                aria-controls={`faq-answer-${index}`}
                data-testid={`faq-${index}-button`}
              >
                <h3
                  className={`text-lg md:text-xl font-medium transition-colors ${
                    openFAQ === index ? 'text-[#c9a961]' : 'text-[#0f2940]'
                  }`}
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openFAQ === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors ${
                    openFAQ === index
                      ? 'bg-[#c9a961] text-white'
                      : 'bg-[#0f2940]/5 text-[#4a5568]'
                  }`}
                >
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openFAQ === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <div
                      id={`faq-answer-${index}`}
                      className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 text-[#4a5568] leading-relaxed text-sm sm:text-base"
                      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                      data-testid={`faq-${index}-answer`}
                    >
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

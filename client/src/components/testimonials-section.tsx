import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useState, useEffect } from "react";

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

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const stats = [
    { number: "90%", label: "de satisfação" },
    { number: "6", label: "alunos por turma" },
    { number: "4", label: "salas no circuito" },
  ];

  const testimonials = [
    {
      quote: "Estou me percebendo mais lembrada no dia-a-dia.",
      benefit: "Memória",
    },
    {
      quote: "Fiquei surpresa com a performance que senti em mim nos circuitos. Achava que já estava com alzheimer e ando achando que minha cognição está bem no geral.",
      benefit: "Cognição",
    },
    {
      quote: "Numa viagem recente lembrei de detalhes de um local que visitei há muito tempo.",
      benefit: "Memória",
    },
    {
      quote: "Tenho lembrado dos meus afazeres sem olhar nas anotações.",
      benefit: "Memória",
    },
    {
      quote: "Tive mais foco no consultório com os procedimentos e também raciocínio mais rápido.",
      benefit: "Foco",
    },
    {
      quote: "Estar na Métis é aprender, se enriquecer de forma lúdica, resultando em melhoria da confiança.",
      benefit: "Confiança",
    },
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isPaused, testimonials.length]);

  return (
    <section id="depoimentos" className="section-padding bg-[#0f2940] relative overflow-hidden">
      {/* Textura sutil de fundo */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Círculo decorativo */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#c9a961]/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#c9a961]/5 rounded-full blur-3xl" />

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
            Depoimentos
          </motion.span>

          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl lg:text-5xl font-medium text-white mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            O que nossos alunos dizem
          </motion.h2>

          <motion.div
            variants={itemVariants}
            className="w-16 h-1 bg-gradient-to-r from-transparent via-[#c9a961] to-transparent mx-auto"
          />
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-3 gap-4 md:gap-8 mb-16 lg:mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {stats.map((stat, i) => (
            <motion.div key={i} className="text-center" variants={itemVariants}>
              <div
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-[#c9a961] mb-2"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {stat.number}
              </div>
              <div
                className="text-sm md:text-base text-white/70"
                style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials Carousel */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Main testimonial card */}
          <motion.div
            variants={itemVariants}
            className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10"
          >
            {/* Quote decorativo */}
            <div className="absolute top-6 left-8 md:left-12">
              <Quote className="w-12 h-12 md:w-16 md:h-16 text-[#c9a961]/20" />
            </div>

            {/* Testimonial content */}
            <div className="relative pt-8 md:pt-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={false}
                  animate={{
                    opacity: activeIndex === index ? 1 : 0,
                    y: activeIndex === index ? 0 : 20,
                    display: activeIndex === index ? "block" : "none",
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Quote text */}
                  <p
                    className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 leading-relaxed mb-6"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    "{testimonial.quote}"
                  </p>

                  {/* Benefit tag */}
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a961]/15 border border-[#c9a961]/30"
                    >
                      <Star className="w-4 h-4 text-[#c9a961] fill-[#c9a961]" />
                      <span
                        className="text-sm font-medium text-[#c9a961]"
                        style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                      >
                        {testimonial.benefit}
                      </span>
                    </span>
                    <span
                      className="text-sm text-white/50"
                      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                    >
                      Aluno(a) Métis
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Pagination dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? "bg-[#c9a961] w-8"
                    : "bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Ver depoimento ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

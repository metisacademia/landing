import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";

// ALTERNAR ENTRE AS VERSÕES AQUI:
// true = versão com gradiente puro (sem imagem)
// false = versão com imagem de fundo
const USE_GRADIENT_VERSION = false;

// Variantes para animações staggered
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
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

// Declaração do dataLayer para TypeScript
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export default function HeroSection() {
  const openWhatsApp = () => {
    // Evento de rastreamento para GTM
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'whatsapp_click',
      'click_source': 'hero'
    });
    window.open('https://wa.me/5581992726495?text=' + encodeURIComponent('Olá! Gostaria de agendar uma aula experimental na Métis.'), '_blank');
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      className="relative overflow-hidden min-h-screen flex items-center"
      style={USE_GRADIENT_VERSION ? undefined : {
        backgroundImage: `url('/images/new-hero-background.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background - Versão Gradiente (sem imagem) */}
      {USE_GRADIENT_VERSION && (
        <>
          {/* Gradiente principal navy */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(
                135deg,
                #0f2940 0%,
                #1a3a5c 40%,
                #0f2940 100%
              )`,
            }}
          />

          {/* Círculos decorativos com gradiente dourado */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-20">
            <div
              className="absolute inset-0 rounded-full blur-3xl"
              style={{
                background: `radial-gradient(circle, rgba(201, 169, 97, 0.4) 0%, transparent 70%)`,
                transform: 'translate(30%, -30%)',
              }}
            />
          </div>

          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] opacity-15">
            <div
              className="absolute inset-0 rounded-full blur-3xl"
              style={{
                background: `radial-gradient(circle, rgba(201, 169, 97, 0.3) 0%, transparent 70%)`,
                transform: 'translate(-30%, 30%)',
              }}
            />
          </div>

          {/* Linhas decorativas sutis */}
          <div className="absolute inset-0 opacity-[0.03]">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </>
      )}

      {/* Background - Versão com Imagem */}
      {!USE_GRADIENT_VERSION && (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              135deg,
              rgba(15, 41, 64, 0.92) 0%,
              rgba(15, 41, 64, 0.75) 35%,
              rgba(15, 41, 64, 0.5) 60%,
              rgba(15, 41, 64, 0.3) 100%
            )`,
          }}
        />
      )}

      {/* Textura sutil (ambas versões) */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      {/* Elemento decorativo - cérebro estilizado (apenas versão gradiente) */}
      {USE_GRADIENT_VERSION && (
        <motion.div
          className="hidden xl:block absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="80" stroke="#c9a961" strokeWidth="0.5" strokeDasharray="4 4" />
            <circle cx="100" cy="100" r="60" stroke="#c9a961" strokeWidth="0.5" strokeDasharray="4 4" />
            <circle cx="100" cy="100" r="40" stroke="#c9a961" strokeWidth="0.5" strokeDasharray="4 4" />
            <path d="M100 20 Q140 60 100 100 Q60 140 100 180" stroke="#c9a961" strokeWidth="1" fill="none" />
            <path d="M20 100 Q60 60 100 100 Q140 140 180 100" stroke="#c9a961" strokeWidth="1" fill="none" />
          </svg>
        </motion.div>
      )}

      {/* Conteúdo principal */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-12 sm:py-20 lg:py-32 z-10">
        <motion.div
          className="max-w-3xl text-left text-white"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge com ícone animado */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full bg-[#c9a961]/15 border border-[#c9a961]/30 text-[#c9a961] backdrop-blur-sm">
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Brain className="w-4 h-4" />
              </motion.span>
              Desenvolvido por neurologistas
            </span>
          </motion.div>

          {/* Título principal com tipografia Playfair */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium mb-6 text-white drop-shadow-2xl leading-[1.1]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            data-testid="hero-main-title"
          >
            A academia que{" "}
            <span className="relative">
              <span className="relative z-10">exercita</span>
              <motion.span
                className="absolute bottom-2 left-0 right-0 h-3 bg-[#c9a961]/30 -z-0"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              />
            </span>
            {" "}sua mente.
          </motion.h1>

          {/* Subtítulo */}
          <motion.h2
            variants={itemVariants}
            className="text-lg sm:text-xl md:text-2xl font-normal text-white/90 drop-shadow-xl mb-4 leading-relaxed"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
            data-testid="hero-subtitle"
          >
            Treino cognitivo semanal com metodologia científica para fortalecer memória, atenção e linguagem.
          </motion.h2>

          {/* Descrição */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg mb-10 leading-relaxed max-w-2xl text-white/80"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
            data-testid="hero-description"
          >
            A Métis é um espaço premium de estímulo cognitivo que combina ciência, cultura e conhecimento.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              onClick={openWhatsApp}
              className="group relative px-8 py-6 rounded-xl text-base md:text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl bg-gradient-to-r from-[#c9a961] to-[#b89a52] text-[#0f2940] border-0 hover:scale-[1.02] active:scale-[0.98]"
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
              data-testid="button-agende-aula"
            >
              <span className="relative z-10">Agende sua aula experimental</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#d4b978] to-[#c9a961] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
            <Button
              onClick={() => scrollToSection('sobre')}
              variant="outline"
              className="px-8 py-6 rounded-xl text-base md:text-lg font-semibold transition-all duration-300 border-2 border-white/30 text-white bg-transparent hover:bg-white/10 hover:border-[#c9a961] hover:text-[#c9a961] hover:scale-[1.02] active:scale-[0.98]"
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
              data-testid="button-saiba-mais"
            >
              Saiba como funciona
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => scrollToSection('sobre')}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer group"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        aria-label="Rolar para baixo"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-white/60 uppercase tracking-widest group-hover:text-white/80 transition-colors" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
            Descubra
          </span>
          <div className="w-8 h-12 rounded-full border-2 border-white/30 flex items-start justify-center p-2 group-hover:border-white/50 transition-colors">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-3 bg-white/60 rounded-full group-hover:bg-white/80 transition-colors"
            />
          </div>
        </motion.div>
      </motion.button>
    </section>
  );
}

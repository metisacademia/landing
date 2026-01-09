import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const openWhatsApp = () => {
    window.open('https://wa.me/5581992726495', '_blank');
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
      style={{
        backgroundImage: `url('/images/new-hero-background.png?v=${Date.now()}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-[#0000004f]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-32 z-10">
        <div className="max-w-4xl text-left text-white sm:ml-8">
          <span className="inline-block bg-[#cda465]/20 border border-[#cda465] text-[#cda465] rounded-full px-4 py-1 text-sm font-medium mb-4">
            Desenvolvido por neurologistas
          </span>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-3 sm:mb-4 text-white drop-shadow-2xl text-left" data-testid="hero-main-title">
            A academia que exercita sua mente.
          </h1>
          
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-white drop-shadow-xl text-left mt-2 mb-3 sm:mt-[8px] sm:mb-[8px]" data-testid="hero-subtitle">
            Treino cognitivo semanal com metodologia científica para fortalecer memória, atenção e linguagem.
          </h2>
          
          <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 md:mb-10 leading-relaxed max-w-3xl text-white/90 drop-shadow-xl text-left" data-testid="hero-description">
            A Métis é um espaço premium de estímulo cognitivo que combina ciência, cultura e conhecimento.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-start">
            <Button 
              onClick={openWhatsApp}
              className="px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 lg:px-12 lg:py-6 rounded-lg text-sm sm:text-base md:text-lg lg:text-xl hover:bg-accent/90 transition-colors shadow-2xl border-2 border-transparent font-bold bg-[#cda465] text-[#0b0b28]"
              data-testid="button-agende-aula"
            >
              Agende sua aula experimental
            </Button>
            <Button 
              onClick={() => scrollToSection('sobre')}
              variant="outline"
              className="px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 lg:px-12 lg:py-6 rounded-lg text-sm sm:text-base md:text-lg lg:text-xl transition-colors shadow-2xl font-bold border-2 border-white/70 text-white bg-transparent hover:bg-white/10 hover:text-white"
              data-testid="button-saiba-mais"
            >
              Saiba como funciona
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

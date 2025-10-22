import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const navigateToCheckout = () => {
    window.location.href = '/checkout';
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
        backgroundColor: '#173b5a'
      }}
    >
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-32 z-10">
        <div className="max-w-4xl text-left text-white sm:ml-8">
          
          {/* Logo Métis */}
          <div className="mb-6 sm:mb-8" data-testid="metis-logo">
            <img 
              src="/images/metis-logo-icon.jpg" 
              alt="Logo Métis" 
              className="h-24 sm:h-32 md:h-40 lg:h-48 w-auto"
            />
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-3 sm:mb-4 text-white drop-shadow-2xl text-left" data-testid="hero-main-title">
            Liberte seu potencial.
          </h1>
          
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-white drop-shadow-xl text-left mt-2 mb-3 sm:mt-[8px] sm:mb-[8px]" data-testid="hero-subtitle">
            Exercite sua mente. Cultive sua memória.
          </h2>
          
          {/* Badge de inauguração */}
          <div className="mb-4 sm:mb-6" data-testid="text-inauguracao-eta-hero">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-white/95">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm sm:text-base font-medium">Previsão de inauguração: Novembro/2025</span>
            </div>
          </div>
          
          <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 md:mb-10 leading-relaxed max-w-3xl text-white/90 drop-shadow-xl text-left" data-testid="hero-description">
            A Métis é um espaço premium de estímulo cognitivo que combina ciência, cultura e conhecimento.
          </p>
          
          <div className="flex justify-start">
            <Button 
              onClick={navigateToCheckout}
              className="bg-accent text-accent-foreground px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 lg:px-12 lg:py-6 rounded-lg font-semibold text-sm sm:text-base md:text-lg lg:text-xl hover:bg-accent/90 transition-colors shadow-2xl border-2 border-transparent"
              data-testid="button-pre-matricula"
            >
              <span className="sm:hidden">Pré-matrícula</span>
              <span className="hidden sm:inline">Garanta sua vaga com a pré-matrícula</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

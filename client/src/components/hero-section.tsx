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
        backgroundImage: `url('/images/new-hero-background.png?v=${Date.now()}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-32 z-10">
        <div className="max-w-4xl text-left text-white sm:ml-8">
          
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-3 sm:mb-4 text-white drop-shadow-2xl text-left" data-testid="hero-main-title">
            Liberte seu potencial.
          </h1>
          
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-white drop-shadow-xl text-left mt-2 mb-3 sm:mt-[8px] sm:mb-[8px]" data-testid="hero-subtitle">
            Exercite sua mente. Cultive sua memória.
          </h2>
          
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

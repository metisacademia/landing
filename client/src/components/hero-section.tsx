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
        backgroundImage: `url('/images/hero-background.png?v=${Date.now()}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          
          
          <h2 className="lg:text-5xl font-semibold mb-8 text-white drop-shadow-2xl text-left ml-[300px] mr-[300px] text-[40px]" data-testid="hero-headline">
            Liberte seu potencial.<br />
            Exercite sua mente. Cultive sua memória.
          </h2>
          
          <p className="text-lg lg:text-xl mb-10 leading-relaxed max-w-3xl mx-auto text-white/90 drop-shadow-xl" data-testid="hero-description">
            A Métis é um espaço premium de estímulo cognitivo que combina ciência, cultura e convivência em grupos de até 6 pessoas.
          </p>
          
          <div className="flex justify-center">
            <Button 
              onClick={navigateToCheckout}
              className="bg-accent text-accent-foreground px-12 py-6 rounded-lg font-semibold text-xl hover:bg-accent/90 transition-colors shadow-2xl border-2 border-transparent"
              data-testid="button-pre-matricula"
            >
              Garanta sua vaga com a pré-matrícula
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

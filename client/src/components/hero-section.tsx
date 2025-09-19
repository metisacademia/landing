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
    <section className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="mb-6">
              <h1 className="text-5xl lg:text-6xl font-bold mb-4" data-testid="hero-title">Métis</h1>
              <p className="text-xl opacity-90" data-testid="hero-subtitle">academia da mente</p>
            </div>
            <h2 className="text-3xl lg:text-4xl font-semibold mb-6 leading-tight" data-testid="hero-headline">
              Exercite sua mente.<br />
              Cultive sua memória.
            </h2>
            <p className="text-lg mb-8 opacity-90 leading-relaxed" data-testid="hero-description">
              A Métis é um espaço premium de estímulo cognitivo que combina ciência, cultura e convivência em grupos de até 6 pessoas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={navigateToCheckout}
                className="bg-accent text-accent-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-accent/90 transition-colors shadow-lg"
                data-testid="button-pre-matricula"
              >
                Garanta sua vaga com a pré-matrícula
              </Button>
              <Button 
                variant="outline"
                onClick={() => scrollToSection('contato')}
                className="border-2 border-primary-foreground text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary-foreground hover:text-primary transition-colors"
                data-testid="button-aula-experimental"
              >
                Aula Experimental
              </Button>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Modern meditation and wellness space" 
              className="rounded-2xl shadow-2xl w-full h-auto"
              data-testid="hero-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

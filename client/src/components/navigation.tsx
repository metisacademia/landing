import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const navigateToCheckout = () => {
    window.location.href = '/checkout';
  };

  return (
    <nav className="bg-[#173b5a] backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-[#f8f1e7]">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <img 
              src="/images/logo-metis.jpg" 
              alt="Métis - Academia da Mente" 
              className="h-16 w-auto"
              data-testid="nav-logo-image"
            />
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('sobre')}
              className="hover:text-primary transition-colors text-[#f8f1e7]"
              data-testid="nav-sobre"
            >
              Sobre
            </button>
            <button 
              onClick={() => scrollToSection('como-funciona')}
              className="hover:text-primary transition-colors text-[#f8f1e7]"
              data-testid="nav-como-funciona"
            >
              Como Funciona
            </button>
            <button 
              onClick={() => scrollToSection('planos')}
              className="hover:text-primary transition-colors text-[#f8f1e7]"
              data-testid="nav-planos"
            >
              Planos
            </button>
            <button 
              onClick={() => scrollToSection('contato')}
              className="hover:text-primary transition-colors text-[#f8f1e7]"
              data-testid="nav-contato"
            >
              Contato
            </button>
            <Button 
              onClick={navigateToCheckout}
              className="px-4 py-2 rounded-lg hover:bg-[#cda465]/90 transition-colors text-[#173b5a] bg-[#cda465]"
              data-testid="nav-pre-matricula"
            >
              Pré-matrícula
            </Button>
          </div>
          
          <div className="md:hidden flex items-center gap-2">
            <Button 
              onClick={navigateToCheckout}
              className="px-3 py-2 rounded-lg hover:bg-[#cda465]/90 transition-colors text-[#173b5a] bg-[#cda465] text-sm"
              data-testid="mobile-nav-pre-matricula-header"
            >
              Pré-matrícula
            </Button>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              data-testid="mobile-menu-toggle"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              <button 
                onClick={() => scrollToSection('sobre')}
                className="hover:text-primary transition-colors text-left text-[#f8f1e7]"
                data-testid="mobile-nav-sobre"
              >
                Sobre
              </button>
              <button 
                onClick={() => scrollToSection('como-funciona')}
                className="hover:text-primary transition-colors text-left text-[#f8f1e7]"
                data-testid="mobile-nav-como-funciona"
              >
                Como Funciona
              </button>
              <button 
                onClick={() => scrollToSection('planos')}
                className="hover:text-primary transition-colors text-left text-[#f8f1e7]"
                data-testid="mobile-nav-planos"
              >
                Planos
              </button>
              <button 
                onClick={() => scrollToSection('contato')}
                className="hover:text-primary transition-colors text-left text-[#f8f1e7]"
                data-testid="mobile-nav-contato"
              >
                Contato
              </button>
              <Button 
                onClick={navigateToCheckout}
                className="px-4 py-2 rounded-lg hover:bg-[#cda465]/90 transition-colors mt-4 w-fit text-[#173b5a] bg-[#cda465]"
                data-testid="mobile-nav-pre-matricula"
              >
                Pré-matrícula
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

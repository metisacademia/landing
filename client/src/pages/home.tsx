import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import CircuitSection from "@/components/circuit-section";
import TestimonialsSection from "@/components/testimonials-section";
import LeadFormSection from "@/components/lead-form-section";
import ResultsSection from "@/components/results-section";
import PricingSection from "@/components/pricing-section";
import FAQSection from "@/components/faq-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-foreground">
      <Navigation />
      <main>
        {/* 1. Hero - Impacto imediato + CTA primário */}
        <HeroSection />

        {/* 2. About - Proposta de valor clara */}
        <AboutSection />

        {/* 3. Circuit - Metodologia visual */}
        <CircuitSection />

        {/* 4. Testimonials - Prova social forte */}
        <TestimonialsSection />

        {/* 5. Lead Form - MOVIDO PARA CIMA (captura antes de preços) */}
        <LeadFormSection />

        {/* 6. Results - Benefícios tangíveis */}
        <ResultsSection />

        {/* 7. Pricing - Decisão de compra */}
        <PricingSection />

        {/* 8. FAQ - Objeções resolvidas */}
        <FAQSection />

        {/* 9. Contact - Informações finais */}
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import CircuitSection from "@/components/circuit-section";
import ResultsSection from "@/components/results-section";
import PricingSection from "@/components/pricing-section";
import FAQSection from "@/components/faq-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <CircuitSection />
        <ResultsSection />
        <PricingSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

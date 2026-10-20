import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { WhatsAppAnchor } from "@/components/whatsapp-anchor";
import { navLinks, TRIAL_MESSAGE } from "@/lib/site";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[#0f2940]/98 backdrop-blur-md shadow-lg border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20 lg:h-24">
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href="/"
              className="focus:outline-none"
              onClick={() => {
                if (window.location.pathname === "/") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
                setIsOpen(false);
              }}
            >
              <img
                src="/images/logo-metis-white.png"
                alt="Métis Academia da Mente"
                width={1080}
                height={1080}
                className={`w-auto transition-all duration-300 ${
                  isScrolled ? "h-12" : "h-14 lg:h-16"
                }`}
                data-testid="nav-logo-image"
              />
            </Link>
          </motion.div>

          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-white/90 hover:text-white transition-colors text-sm font-medium tracking-wide group"
                style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                data-testid={`nav-${link.href.replace(/\//g, "") || "inicio"}`}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#c9a961] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}

            <Button
              asChild
              className={`relative overflow-hidden px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                isScrolled
                  ? "bg-gradient-to-r from-[#c9a961] to-[#b89a52] text-[#0f2940] hover:shadow-lg hover:shadow-[#c9a961]/25"
                  : "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-[#c9a961] hover:border-[#c9a961] hover:text-[#0f2940]"
              }`}
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
            >
              <WhatsAppAnchor position="nav_desktop" message={TRIAL_MESSAGE} data-testid="nav-agende-aula">
                <span className="relative z-10">Agende sua aula</span>
              </WhatsAppAnchor>
            </Button>
          </div>

          <div className="lg:hidden flex items-center gap-3">
            <Button
              asChild
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#c9a961] to-[#b89a52] text-[#0f2940] text-xs font-semibold shadow-lg"
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
            >
              <WhatsAppAnchor position="nav_mobile_header" message={TRIAL_MESSAGE} data-testid="mobile-nav-agende-aula-header">
                Agende sua aula
              </WhatsAppAnchor>
            </Button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-11 h-11 flex items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20"
              data-testid="mobile-menu-toggle"
              aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-[#0f2940] shadow-2xl lg:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <img
                    src="/images/logo-metis-white.png"
                    alt="Métis Academia da Mente"
                    width={1080}
                    height={1080}
                    className="h-10 w-auto"
                  />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 text-white"
                    aria-label="Fechar menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto py-6">
                  <div className="flex flex-col space-y-1 px-4">
                    {navLinks.map((link, index) => (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center px-4 py-4 text-white/90 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left text-base font-medium"
                          style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="p-6 border-t border-white/10">
                  <Button
                    asChild
                    className="h-auto w-full max-w-full whitespace-normal rounded-xl bg-gradient-to-r from-[#c9a961] to-[#b89a52] py-4 text-center font-semibold leading-snug text-[#0f2940] shadow-lg transition-shadow hover:shadow-xl"
                    style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                  >
                    <WhatsAppAnchor
                      position="nav_mobile_drawer"
                      message={TRIAL_MESSAGE}
                      data-testid="mobile-nav-agende-aula"
                      onClick={() => setIsOpen(false)}
                    >
                      Agende sua aula experimental
                    </WhatsAppAnchor>
                  </Button>
                  <p className="text-center text-white/50 text-xs mt-4" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                    Primeira aula grátis
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

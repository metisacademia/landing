import { Link } from "wouter";
import { HelpCircle } from "lucide-react";
import { homeFaqs } from "@/lib/site";

export default function FAQSection() {
  return (
    <section className="section-padding bg-[#faf8f5] relative overflow-hidden">
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-[#c9a961]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-[#0f2940]/5 rounded-full blur-3xl" />

      <div className="container-elegant max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <span
            className="inline-flex items-center gap-2 text-sm font-medium text-[#c9a961] uppercase tracking-widest mb-4"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
          >
            <HelpCircle className="w-4 h-4" />
            Dúvidas
          </span>

          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-medium text-[#0f2940] mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            data-testid="faq-title"
          >
            Perguntas Frequentes
          </h2>

          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#c9a961] to-transparent mx-auto" />
        </div>

        <div className="space-y-4">
          {homeFaqs.map((faq, index) => (
            <details
              key={faq.question}
              className="group bg-white rounded-2xl shadow-sm"
              data-testid={`faq-${index}`}
            >
              <summary
                className="w-full p-4 sm:p-6 md:p-8 text-left flex justify-between items-center gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden"
                data-testid={`faq-${index}-button`}
              >
                <h3
                  className="text-lg md:text-xl font-medium text-[#0f2940] group-open:text-[#c9a961]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {faq.question}
                </h3>
                <span
                  className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-[#0f2940]/5 text-[#4a5568] group-open:bg-[#c9a961] group-open:text-white transition-transform group-open:rotate-180"
                  aria-hidden="true"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </summary>
              <div
                id={`faq-answer-${index}`}
                className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 text-[#4a5568] leading-relaxed text-sm sm:text-base"
                style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                data-testid={`faq-${index}-answer`}
              >
                {faq.answer}
              </div>
            </details>
          ))}
        </div>

        <p className="text-center mt-10" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
          <Link
            href="/perguntas-frequentes"
            className="text-[#0f2940] font-medium underline decoration-[#c9a961] underline-offset-4"
          >
            Ver todas as perguntas
          </Link>
        </p>
      </div>
    </section>
  );
}

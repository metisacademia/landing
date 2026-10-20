import type { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { WhatsAppAnchor } from "@/components/whatsapp-anchor";
import { getSeo } from "@/lib/seo";
import type { Faq } from "@/lib/site";
import { TRIAL_MESSAGE } from "@/lib/site";

export const serif = { fontFamily: "'Playfair Display', Georgia, serif" } as const;
export const sans = { fontFamily: "'DM Sans', system-ui, sans-serif" } as const;

type PageShellProps = {
  eyebrow: string;
  title: string;
  lede: string;
  children: ReactNode;
};

export default function PageShell({ eyebrow, title, lede, children }: PageShellProps) {
  const [location] = useLocation();
  const seo = getSeo(location);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-foreground">
      <Navigation />
      <main>
        <header className="bg-[#0f2940] text-white pt-28 pb-14 md:pt-36 md:pb-20">
          <div className="container-elegant max-w-4xl">
            <nav aria-label="Trilha">
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/70" style={sans}>
                {seo.breadcrumbs.map((crumb, index) => {
                  const last = index === seo.breadcrumbs.length - 1;
                  return (
                    <li key={crumb.path} className="flex items-center gap-2">
                      {index > 0 ? <span aria-hidden="true">/</span> : null}
                      {last ? (
                        <span className="text-white" aria-current="page">
                          {crumb.name}
                        </span>
                      ) : (
                        <Link href={crumb.path} className="hover:text-[#c9a961] transition-colors">
                          {crumb.name}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
            <p className="mt-6 text-sm font-medium uppercase tracking-widest text-[#c9a961]" style={sans}>
              {eyebrow}
            </p>
            <h1 className="mt-4 text-3xl md:text-5xl font-medium text-white leading-tight" style={serif}>
              {title}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/85 leading-relaxed max-w-3xl" style={sans}>
              {lede}
            </p>
          </div>
        </header>
        {children}
      </main>
      <Footer />
    </div>
  );
}

export function MedicalNotice() {
  return (
    <aside className="rounded-2xl border border-[#c9a961]/40 bg-[#f8f1e7] p-6 md:p-8">
      <h2 className="text-2xl font-medium text-[#0f2940] mb-3" style={serif}>
        O que a Métis não promete
      </h2>
      <p className="text-[#4a5568] leading-relaxed" style={sans}>
        A Métis é um programa preventivo de estímulo cognitivo. Estimula memória, linguagem, atenção e funções executivas e busca fortalecer a reserva cognitiva. Não é tratamento, não substitui avaliação médica e não promete prevenir ou curar Alzheimer, demência ou qualquer outra doença.
      </p>
    </aside>
  );
}

export function FaqList({ faqs, heading = "Perguntas frequentes" }: { faqs: readonly Faq[]; heading?: string }) {
  return (
    <section className="section-padding bg-[#faf8f5]">
      <div className="container-elegant max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-medium text-[#0f2940] mb-8" style={serif}>
          {heading}
        </h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <details key={faq.question} className="group bg-white rounded-2xl shadow-sm">
              <summary className="cursor-pointer list-none p-6 md:p-8 flex justify-between items-center gap-4 [&::-webkit-details-marker]:hidden">
                <h3 className="text-lg md:text-xl font-medium text-[#0f2940] group-open:text-[#c9a961]" style={serif}>
                  {faq.question}
                </h3>
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0f2940]/5 text-[#4a5568] group-open:bg-[#c9a961] group-open:text-white flex items-center justify-center transition-transform group-open:rotate-180" aria-hidden="true">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </summary>
              <div className="px-6 md:px-8 pb-6 md:pb-8 text-[#4a5568] leading-relaxed" style={sans}>
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

type Related = { href: string; label: string; text: string };

export function RelatedLinks({ links }: { links: readonly Related[] }) {
  return (
    <section className="section-padding-sm bg-white">
      <div className="container-elegant">
        <h2 className="text-3xl font-medium text-[#0f2940] mb-8" style={serif}>
          Continue lendo
        </h2>
        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block h-full rounded-2xl bg-[#faf8f5] p-6 hover:shadow-md transition-shadow"
              >
                <span className="block text-lg font-medium text-[#0f2940]" style={serif}>
                  {link.label}
                </span>
                <span className="block mt-2 text-sm text-[#4a5568] leading-relaxed" style={sans}>
                  {link.text}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function CtaBand({
  title,
  text,
  position,
  message = TRIAL_MESSAGE,
  label = "Chamar no WhatsApp",
}: {
  title: string;
  text: string;
  position: string;
  message?: string;
  label?: string;
}) {
  return (
    <section className="section-padding-sm bg-[#0f2940]">
      <div className="container-elegant max-w-3xl text-center">
        <h2 className="text-3xl md:text-4xl font-medium text-white" style={serif}>
          {title}
        </h2>
        <p className="mt-4 text-lg text-white/80 leading-relaxed" style={sans}>
          {text}
        </p>
        <WhatsAppAnchor
          position={position}
          message={message}
          className="btn-premium mt-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a961]"
        >
          {label}
        </WhatsAppAnchor>
      </div>
    </section>
  );
}

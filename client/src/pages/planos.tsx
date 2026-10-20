import PageShell, { CtaBand, FaqList, MedicalNotice, RelatedLinks, sans, serif } from "@/components/page-shell";
import { WhatsAppAnchor } from "@/components/whatsapp-anchor";
import { extraFaqs, homeFaqs, PLANS_MESSAGE, plans, PRICE_RANGE_LABEL } from "@/lib/site";

const planFaqs = [extraFaqs[1], homeFaqs[3], homeFaqs[4]];

export default function PlanosPage() {
  return (
    <PageShell
      eyebrow="Investimento"
      title="Planos e preços"
      lede={`Os planos da Métis vão de ${PRICE_RANGE_LABEL}. Todos incluem uma aula presencial por semana, de 2h30, com o circuito completo das quatro salas, em grupos de até 6 pessoas. A aula experimental é gratuita e sem compromisso.`}
    >
      <section className="section-padding bg-[#0f2940]">
        <div className="container-elegant">
          <p className="text-center text-white/80 mb-10 max-w-3xl mx-auto" style={sans}>
            Vagas limitadas: máximo de 6 alunos por turma. Formas de pagamento e condições são apresentadas no atendimento.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <article
                key={plan.id}
                className={`rounded-2xl bg-white/5 border ${plan.popular ? "border-[#c9a961]" : "border-white/10"} overflow-hidden`}
              >
                {plan.popular ? (
                  <p className="bg-[#c9a961] text-[#0f2940] text-sm font-semibold text-center py-2" style={sans}>
                    Mais popular
                  </p>
                ) : null}
                <div className="p-6">
                  <h2 className="text-xl text-white" style={serif}>
                    {plan.name}
                  </h2>
                  <p className="mt-4 text-white">
                    <span className="text-4xl" style={serif}>
                      R$ {plan.price}
                    </span>
                    <span className="text-white/70" style={sans}>
                      {" "}
                      /mês
                    </span>
                  </p>
                  <p className="mt-2 inline-block rounded-full bg-[#c9a961]/20 text-[#c9a961] text-sm px-3 py-1" style={sans}>
                    Economia R$ {plan.savings}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {plan.benefits.map((benefit) => (
                      <li key={benefit} className="text-sm text-white/80" style={sans}>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <WhatsAppAnchor
                    position={`pricing_${plan.id}`}
                    message={PLANS_MESSAGE}
                    className={`mt-8 inline-flex w-full justify-center rounded-xl px-4 py-3 font-semibold ${
                      plan.popular
                        ? "bg-[#c9a961] text-[#0f2940]"
                        : "bg-white/10 text-white border border-white/20"
                    }`}
                  >
                    Escolher plano
                  </WhatsAppAnchor>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-[#faf8f5]">
        <div className="container-elegant max-w-3xl space-y-4 text-lg text-[#4a5568] leading-relaxed" style={sans}>
          <h2 className="text-3xl font-medium text-[#0f2940]" style={serif}>
            O que está incluído em todos os planos
          </h2>
          <p>Uma aula semanal de 2h30 e o circuito completo das quatro salas: Linguagem, Memória, Funções Executivas e Contemplação. Material didático incluso.</p>
          <p>
            A partir do plano trimestral, há acompanhamento personalizado. Nos planos semestral e anual, há relatório de evolução. O plano anual inclui prioridade em eventos.
          </p>
          <MedicalNotice />
        </div>
      </section>

      <FaqList faqs={planFaqs} />
      <RelatedLinks
        links={[
          { href: "/aula-experimental", label: "Aula experimental gratuita", text: "Conhecer o método antes de escolher um plano." },
          { href: "/como-funciona", label: "Como funciona", text: "O que acontece nas 2h30 semanais." },
          { href: "/contato", label: "Contato", text: "Endereço no Kronos Empresarial, nas Graças." },
        ]}
      />
      <CtaBand
        position="cta_planos"
        title="Prefere tirar a dúvida no WhatsApp?"
        text="A equipe responde sobre horários e sobre a aula experimental gratuita. O plano só começa depois dessa conversa."
        message={PLANS_MESSAGE}
        label="Falar sobre os planos"
      />
    </PageShell>
  );
}

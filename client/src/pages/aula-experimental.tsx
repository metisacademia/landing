import PageShell, { CtaBand, FaqList, MedicalNotice, RelatedLinks, sans, serif } from "@/components/page-shell";
import { ADDRESS_ONE_LINE, extraFaqs, homeFaqs, PHONE_DISPLAY } from "@/lib/site";

const trialFaqs = [homeFaqs[3], extraFaqs[3], homeFaqs[1]];

export default function AulaExperimentalPage() {
  return (
    <PageShell
      eyebrow="Sem compromisso"
      title="Aula experimental gratuita"
      lede="A Métis oferece uma aula experimental gratuita para a pessoa conhecer a metodologia, a equipe e o ambiente antes de decidir. O agendamento é pelo WhatsApp. Não é obrigatório ter encaminhamento médico."
    >
      <section className="section-padding bg-white">
        <div className="container-elegant max-w-3xl space-y-4 text-lg text-[#4a5568] leading-relaxed" style={sans}>
          <h2 className="text-3xl font-medium text-[#0f2940]" style={serif}>
            O que já dá para saber
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>A aula é gratuita.</li>
            <li>Não há compromisso de matrícula.</li>
            <li>Você conhece a metodologia, a equipe e o ambiente.</li>
            <li>O contato é o WhatsApp {PHONE_DISPLAY}.</li>
            <li>A unidade fica na {ADDRESS_ONE_LINE}.</li>
          </ul>
          <h2 className="text-3xl font-medium text-[#0f2940] pt-6" style={serif}>
            O que a equipe confirma no agendamento
          </h2>
          <p>
            A duração, o que levar e o roteiro da aula são combinados pelo WhatsApp, junto com o horário. Depois da matrícula, o programa é semanal, com 2h30 de duração, em grupos de até 6 pessoas.
          </p>
          <p>
            Respondemos em até 24 horas. Se preferir, chame direto no WhatsApp.
          </p>
          <MedicalNotice />
        </div>
      </section>
      <FaqList faqs={trialFaqs} heading="Dúvidas sobre a aula experimental" />
      <RelatedLinks
        links={[
          { href: "/como-funciona", label: "Como funciona", text: "O circuito que a aula apresenta." },
          { href: "/planos", label: "Planos e preços", text: "Os valores, se a aula fizer sentido." },
          { href: "/contato", label: "Como chegar", text: "Endereço, mapa e estacionamento." },
        ]}
      />
      <CtaBand
        position="cta_aula_experimental"
        title="Agendar a aula experimental"
        text={`Chame no WhatsApp ${PHONE_DISPLAY}. A mensagem já pode dizer o seu nome e o melhor período do dia.`}
      />
    </PageShell>
  );
}

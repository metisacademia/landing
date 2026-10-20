import PageShell, { CtaBand, FaqList, MedicalNotice, RelatedLinks, sans, serif } from "@/components/page-shell";
import { ADDRESS_ONE_LINE, DOCTOR_MESSAGE, EMAIL, extraFaqs, homeFaqs, PHONE_DISPLAY, PRICE_RANGE_LABEL } from "@/lib/site";

const doctorFaqs = [homeFaqs[1], extraFaqs[2], extraFaqs[3]];

export default function ParaMedicosPage() {
  return (
    <PageShell
      eyebrow="Indicação"
      title="Para médicos: como indicar a Métis"
      lede="Neurologistas, geriatras e outras clínicas podem indicar adultos que queiram um programa presencial de estímulo cognitivo nas Graças, em Recife. A indicação não é obrigatória. A Métis não substitui a consulta, o diagnóstico nem o tratamento."
    >
      <section className="section-padding bg-white">
        <div className="container-elegant max-w-3xl space-y-4 text-lg text-[#4a5568] leading-relaxed" style={sans}>
          <h2 className="text-3xl font-medium text-[#0f2940]" style={serif}>
            O que a pessoa encontra
          </h2>
          <p>
            Um circuito semanal de 2h30, em quatro salas — Linguagem, Memória, Funções Executivas e Contemplação — em grupos de até 6 pessoas. O método foi desenvolvido por neurologistas. Os planos vão de {PRICE_RANGE_LABEL}. Há aula experimental gratuita.
          </p>
          <p>Endereço: {ADDRESS_ONE_LINE}.</p>
          <h2 className="text-3xl font-medium text-[#0f2940] pt-4" style={serif}>
            O que a Métis não faz
          </h2>
          <p>
            Não emite diagnóstico, não prescreve e não promete prevenir, tratar ou curar Alzheimer, demência ou qualquer outra doença.
          </p>
          <h2 className="text-3xl font-medium text-[#0f2940] pt-4" style={serif}>
            Como indicar
          </h2>
          <p>
            Passe o WhatsApp {PHONE_DISPLAY} ou o e-mail {EMAIL}. A pessoa, ou a família, agenda a aula experimental. No formulário, é possível marcar “Indicação médica” em “Como conheceu a Métis?”. Não é preciso um documento para a aula acontecer.
          </p>
          <p className="rounded-2xl bg-[#faf8f5] p-6">
            Texto que pode ser encaminhado: “A Métis é uma academia de estímulo cognitivo para adultos nas Graças, Recife. O circuito semanal dura 2h30, em grupos de até 6. Não substitui acompanhamento médico. Aula experimental gratuita pelo WhatsApp {PHONE_DISPLAY}.”
          </p>
          <MedicalNotice />
        </div>
      </section>
      <FaqList faqs={doctorFaqs} heading="Perguntas de quem indica" />
      <RelatedLinks
        links={[
          { href: "/como-funciona", label: "Como funciona", text: "Descrição do circuito para repassar à família." },
          { href: "/aula-experimental", label: "Aula experimental", text: "O que a pessoa faz no primeiro contato." },
          { href: "/contato", label: "Contato", text: "Endereço e telefone, no mesmo formato em todo o site." },
        ]}
      />
      <CtaBand
        position="cta_para_medicos"
        title="Falar com a equipe"
        message={DOCTOR_MESSAGE}
        label="WhatsApp para indicação"
        text="Para avisar a equipe sobre uma indicação, use o WhatsApp."
      />
    </PageShell>
  );
}

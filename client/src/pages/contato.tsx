import PageShell, { CtaBand, FaqList, sans, serif } from "@/components/page-shell";
import { WhatsAppAnchor } from "@/components/whatsapp-anchor";
import {
  ADDRESS_ONE_LINE,
  EMAIL,
  extraFaqs,
  MAPS_EMBED,
  MAPS_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
  TRIAL_MESSAGE,
} from "@/lib/site";

const contactFaqs = [extraFaqs[0], extraFaqs[5], extraFaqs[6]];

export default function ContatoPage() {
  return (
    <PageShell
      eyebrow="Graças, Recife"
      title="Contato e como chegar"
      lede={`A Métis Academia da Mente fica na ${ADDRESS_ONE_LINE}. O atendimento para agendar a aula experimental é o WhatsApp ${PHONE_DISPLAY}. Também é possível escrever para ${EMAIL}.`}
    >
      <section className="section-padding bg-white">
        <div className="container-elegant grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-6 text-[#4a5568]" style={sans}>
            <h2 className="text-3xl font-medium text-[#0f2940]" style={serif}>
              Como chegar
            </h2>
            <p className="text-lg leading-relaxed">
              A Métis fica no Kronos Empresarial, na Rua das Pernambucanas, sala 1203, no coração das Graças, com fácil acesso e estacionamento. Para detalhes sobre o estacionamento, fale com a equipe pelo WhatsApp.
            </p>
            <p className="text-lg leading-relaxed">
              Os dias e horários de turma são combinados no agendamento.
            </p>
            <ul className="space-y-3 text-lg">
              <li>
                <WhatsAppAnchor position="contato_whatsapp" message={TRIAL_MESSAGE} className="text-[#0f2940] font-medium underline decoration-[#c9a961] underline-offset-4">
                  WhatsApp {PHONE_DISPLAY}
                </WhatsAppAnchor>
              </li>
              <li>
                <a href={`tel:${PHONE_TEL}`} className="hover:text-[#0f2940]">
                  Telefone {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} className="hover:text-[#0f2940]">
                  {EMAIL}
                </a>
              </li>
              <li>
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#0f2940]">
                  Abrir no Google Maps
                </a>
              </li>
            </ul>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-lg bg-[#faf8f5]">
            <iframe
              title="Mapa: Métis Academia da Mente, Rua das Pernambucanas, 407, Graças, Recife"
              src={MAPS_EMBED}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-80 border-0"
            />
            <p className="p-5 text-sm text-[#4a5568]" style={sans}>
              {ADDRESS_ONE_LINE}
            </p>
          </div>
        </div>
      </section>
      <FaqList faqs={contactFaqs} heading="Chegar e horários" />
      <CtaBand
        position="cta_contato"
        title="Chamar a Métis"
        text="Fale com a equipe pelo WhatsApp para agendar a aula experimental ou tirar dúvidas sobre como chegar."
      />
    </PageShell>
  );
}

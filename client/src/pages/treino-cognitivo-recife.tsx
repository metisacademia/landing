import { Link } from "wouter";
import PageShell, { CtaBand, FaqList, MedicalNotice, RelatedLinks, sans, serif } from "@/components/page-shell";
import {
  ADDRESS_ONE_LINE,
  extraFaqs,
  homeFaqs,
  PHONE_DISPLAY,
  PRICE_RANGE_LABEL,
} from "@/lib/site";

const localFaqs = [homeFaqs[0], extraFaqs[1], extraFaqs[0], extraFaqs[2]];

export default function TreinoCognitivoRecifePage() {
  return (
    <PageShell
      eyebrow="Recife · Graças"
      title="Treino cognitivo em Recife"
      lede={`A Métis é uma academia de treino cognitivo para adultos e idosos nas Graças, Recife, com método desenvolvido por neurologistas. O circuito semanal dura 2h30, em grupos de até 6 pessoas, e os planos vão de ${PRICE_RANGE_LABEL}. A aula experimental é gratuita.`}
    >
      <section className="section-padding bg-white">
        <div className="container-elegant max-w-3xl space-y-4 text-lg text-[#4a5568] leading-relaxed" style={sans}>
          <h2 className="text-3xl font-medium text-[#0f2940]" style={serif}>
            O que é o treino na Métis
          </h2>
          <p>
            Uma vez por semana, a pessoa percorre quatro salas: Linguagem, Memória, Funções Executivas e Contemplação. O encontro estimula memória, linguagem, atenção e funções executivas e busca fortalecer a reserva cognitiva. Há curadoria cultural — livros, obras, filmes e playlists — e acompanhamento profissional.
          </p>
          <p>
            É um programa presencial, na {ADDRESS_ONE_LINE}. Não é um aplicativo e não é uma consulta.
          </p>
          <p>
            <Link href="/como-funciona" className="text-[#0f2940] font-medium underline decoration-[#c9a961] underline-offset-4">
              Veja como o circuito funciona
            </Link>{" "}
            ou os{" "}
            <Link href="/planos" className="text-[#0f2940] font-medium underline decoration-[#c9a961] underline-offset-4">
              planos e preços
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="section-padding bg-[#faf8f5]">
        <div className="container-elegant max-w-3xl space-y-4 text-lg text-[#4a5568] leading-relaxed" style={sans}>
          <h2 className="text-3xl font-medium text-[#0f2940]" style={serif}>
            Estimulação cognitiva para adultos e idosos nas Graças
          </h2>
          <p>
            O programa é para adultos e idosos, em grupos pequenos de até 6 pessoas, no bairro das Graças.
          </p>
          <p>
            A unidade fica no Kronos Empresarial, nas Graças, em Recife.
          </p>
          <p>
            Esquecimentos do dia a dia preocupam muitas famílias. A Métis não diagnostica e não diz, à distância, se um esquecimento é esperado ou se pede avaliação. Quem nota uma mudança que incomoda deve procurar um médico. O treino cognitivo não substitui essa consulta.
          </p>
          <MedicalNotice />
        </div>
      </section>

      <section className="section-padding-sm bg-white">
        <div className="container-elegant max-w-3xl text-lg text-[#4a5568] leading-relaxed" style={sans}>
          <h2 className="text-3xl font-medium text-[#0f2940] mb-4" style={serif}>
            Como começar
          </h2>
          <p>
            O primeiro passo é a aula experimental gratuita, pelo WhatsApp {PHONE_DISPLAY}. Encaminhamento médico não é obrigatório. Quem é acompanhado por um profissional de saúde pode ir indicado e continuar o cuidado médico em paralelo.
          </p>
        </div>
      </section>

      <FaqList faqs={localFaqs} heading="Perguntas de quem pesquisa em Recife" />
      <RelatedLinks
        links={[
          { href: "/salas/memoria", label: "Sala da Memória", text: "O que a sala trabalha, em linguagem simples." },
          { href: "/aula-experimental", label: "Aula experimental", text: "Como agendar a visita gratuita." },
          { href: "/para-medicos", label: "Para médicos", text: "Como indicar um adulto sem substituir o tratamento." },
          { href: "/contato", label: "Como chegar", text: "Endereço, mapa e WhatsApp." },
        ]}
      />
      <CtaBand
        position="cta_recife"
        title="Agendar em Recife"
        text="A aula experimental é o caminho para conhecer a unidade das Graças antes de escolher um plano."
      />
    </PageShell>
  );
}

import { Link } from "wouter";
import PageShell, { CtaBand, FaqList, MedicalNotice, RelatedLinks, sans, serif } from "@/components/page-shell";
import { homeFaqs, roomOrder, rooms } from "@/lib/site";

const circuitFaqs = [homeFaqs[0], homeFaqs[4], homeFaqs[2]];

export default function ComoFuncionaPage() {
  return (
    <PageShell
      eyebrow="O método"
      title="Como funciona o circuito Métis"
      lede="A Métis é uma academia de treino cognitivo presencial para adultos, nas Graças, em Recife. Uma vez por semana, o encontro dura 2 horas e 30 minutos e percorre quatro salas — Linguagem, Memória, Funções Executivas e Contemplação — em grupos de até 6 pessoas. O método foi desenvolvido por neurologistas. É um programa de estímulo cognitivo: estimula memória, linguagem e atenção e busca fortalecer a reserva cognitiva. Não é consulta médica."
    >
      <section className="section-padding bg-[#faf8f5]">
        <div className="container-elegant max-w-3xl space-y-4 text-lg text-[#4a5568] leading-relaxed" style={sans}>
          <h2 className="text-3xl md:text-4xl font-medium text-[#0f2940]" style={serif}>
            Um encontro, quatro salas
          </h2>
          <p>
            O circuito segue esta ordem: Linguagem, Memória, Funções Executivas e Contemplação. Cada sala estimula capacidades diferentes, com atividades práticas e culturais, em um encontro semanal de 2h30.
          </p>
          <p>
            Os grupos têm no máximo 6 pessoas. A experiência inclui ambiente com iluminação suave e materiais táteis, curadoria cultural (livros, obras, filmes e playlists) e acompanhamento profissional. As atividades presenciais mudam ao longo do programa e são apresentadas pela equipe na aula.
          </p>
          <p>
            Na matrícula, você indica os dias e horários de preferência, e a equipe confirma a disponibilidade pelo WhatsApp.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-elegant">
          <h2 className="text-3xl md:text-4xl font-medium text-[#0f2940] mb-8" style={serif}>
            As quatro salas
          </h2>
          <ol className="grid md:grid-cols-2 gap-6">
            {roomOrder.map((slug, index) => {
              const room = rooms[slug];
              return (
                <li key={slug} className="rounded-2xl bg-[#faf8f5] overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.imageAlt}
                    width={room.width}
                    height={room.height}
                    loading="lazy"
                    decoding="async"
                    className="w-full aspect-[4/3] object-cover"
                  />
                  <div className="p-6">
                    <p className="text-sm text-[#c9a961] font-medium" style={sans}>
                      Sala {index + 1}
                    </p>
                    <h3 className="text-2xl font-medium text-[#0f2940] mt-1" style={serif}>
                      {room.title}
                    </h3>
                    <p className="text-[#4a5568] mt-3 leading-relaxed" style={sans}>
                      {room.short}
                    </p>
                    <Link href={`/salas/${slug}`} className="inline-block mt-4 text-[#0f2940] font-medium underline decoration-[#c9a961] underline-offset-4" style={sans}>
                      Conheça a {room.title}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="section-padding bg-[#faf8f5]">
        <div className="container-elegant max-w-3xl space-y-8">
          <div className="space-y-4 text-lg text-[#4a5568] leading-relaxed" style={sans}>
            <h2 className="text-3xl md:text-4xl font-medium text-[#0f2940]" style={serif}>
              Para quem é
            </h2>
            <p>
              O programa é voltado a adultos que querem fortalecer memória, atenção e foco, e a famílias que buscam um ambiente acolhedor e de alto padrão.
            </p>
            <p>
              Encaminhamento médico não é obrigatório. Quem já é acompanhado por um neurologista, geriatra ou outra clínica pode vir indicado — e o programa continua sendo estímulo, não tratamento.
            </p>
          </div>
          <MedicalNotice />
        </div>
      </section>

      <FaqList faqs={circuitFaqs} />
      <RelatedLinks
        links={[
          { href: "/planos", label: "Planos e preços", text: "De R$ 790 a R$ 1.145 por mês, com aula semanal de 2h30." },
          { href: "/aula-experimental", label: "Aula experimental", text: "Gratuita e sem compromisso. O horário é confirmado no WhatsApp." },
          { href: "/treino-cognitivo-em-recife", label: "Treino cognitivo em Recife", text: "Onde fica a unidade das Graças e para quem ela faz sentido." },
        ]}
      />
      <CtaBand
        position="cta_como_funciona"
        title="Quer ver o circuito de perto?"
        text="A aula experimental é gratuita. A equipe confirma o horário pelo WhatsApp e explica o que esperar do encontro."
      />
    </PageShell>
  );
}

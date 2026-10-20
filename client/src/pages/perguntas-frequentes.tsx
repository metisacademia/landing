import PageShell, { CtaBand, FaqList, RelatedLinks } from "@/components/page-shell";
import { allFaqs } from "@/lib/site";

export default function PerguntasFrequentesPage() {
  return (
    <PageShell
      eyebrow="Dúvidas"
      title="Perguntas frequentes"
      lede="As respostas abaixo repetem o que a Métis já publica: o circuito semanal de 2h30, grupos de até 6 pessoas, preços, aula experimental gratuita e o endereço nas Graças. Onde um dado ainda não existe no site, a resposta diz isso com clareza."
    >
      <FaqList faqs={allFaqs} heading="Respostas" />
      <RelatedLinks
        links={[
          { href: "/como-funciona", label: "Como funciona", text: "O circuito em mais detalhe." },
          { href: "/planos", label: "Planos e preços", text: "Os quatro valores mensais." },
          { href: "/treino-cognitivo-em-recife", label: "Treino cognitivo em Recife", text: "A página local da unidade." },
        ]}
      />
      <CtaBand
        position="cta_faq"
        title="Não achou a sua pergunta?"
        text="A equipe responde pelo WhatsApp. Horários de turma e detalhes da aula experimental são combinados por lá."
      />
    </PageShell>
  );
}

import PageShell, { sans, serif } from "@/components/page-shell";

const missing = [
  "Nome completo de cada neurologista, escrito pela própria pessoa",
  "CRM-PE e RQE",
  "Foto com autorização de uso",
  "Formação e mini-biografia revisadas por quem será nomeado",
  "Links profissionais que a pessoa queira divulgar, se houver",
  "Demais profissionais da equipe, com a função real de cada um",
] as const;

export default function EquipePage() {
  return (
    <PageShell
      eyebrow="Em preparação"
      title="Equipe"
      lede="Os nomes, registros profissionais e biografias dos neurologistas e da equipe ainda não foram publicados neste site."
    >
      <section className="section-padding bg-white">
        <div className="container-elegant max-w-3xl space-y-4 text-lg text-[#4a5568] leading-relaxed" style={sans}>
          <p>
            Esta página é só uma estrutura. Ela não aparece no menu, no rodapé nem no mapa do site, e está marcada para os buscadores não a indexarem.
          </p>
          <h2 className="text-3xl font-medium text-[#0f2940] pt-4" style={serif}>
            O que falta a equipe da Métis enviar
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            {missing.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            Até lá, o site diz apenas o que já é público: a metodologia foi desenvolvida por neurologistas. Nenhum nome ou registro é exibido.
          </p>
        </div>
      </section>
    </PageShell>
  );
}

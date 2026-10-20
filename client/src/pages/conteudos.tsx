import { useMemo, useState } from "react";
import { Link } from "wouter";
import PageShell, { CtaBand, sans, serif } from "@/components/page-shell";
import { formatLongDate, listVisibleArticles, type Article } from "@/content/articles";

export default function ConteudosPage() {
  const articles = listVisibleArticles();
  const tags = useMemo(() => {
    const found = new Set<string>();
    for (const article of articles) {
      for (const tag of article.tags) found.add(tag);
    }
    return Array.from(found).sort((left, right) => left.localeCompare(right, "pt-BR"));
  }, [articles]);
  const [tag, setTag] = useState<string | null>(null);
  const visible = tag ? articles.filter((article) => article.tags.includes(tag)) : articles;
  const showingDrafts = articles.some((article) => article.draft);

  return (
    <PageShell
      eyebrow="Leitura"
      title="Conteúdos"
      lede="Textos da Equipe Métis sobre memória, envelhecimento e treino cognitivo em Recife."
    >
      <section className="section-padding-sm bg-[#f8f1e7]">
        <div className="container-elegant max-w-4xl min-w-0">
          {showingDrafts ? (
            <p
              className="mb-8 rounded-2xl border border-[#cda465] bg-white px-5 py-4 text-sm leading-relaxed text-[#173b5a]"
              style={sans}
              data-testid="conteudos-draft-note"
            >
              Os cartões marcados como rascunho só aparecem neste preview. No site publicado eles ficam de fora, e o menu Conteúdos só entra quando houver um artigo aprovado.
            </p>
          ) : null}

          {tags.length > 0 ? (
            <div className="mb-8 flex min-w-0 flex-wrap gap-2" role="group" aria-label="Filtrar por etiqueta">
              <button
                type="button"
                aria-pressed={tag === null}
                onClick={() => setTag(null)}
                className={`rounded-full px-4 py-2 text-sm ${tag === null ? "bg-[#173b5a] text-white" : "bg-white text-[#173b5a]"}`}
                style={sans}
              >
                Todos
              </button>
              {tags.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={tag === item}
                  onClick={() => setTag(item)}
                  className={`rounded-full px-4 py-2 text-sm ${tag === item ? "bg-[#173b5a] text-white" : "bg-white text-[#173b5a]"}`}
                  style={sans}
                >
                  {item}
                </button>
              ))}
            </div>
          ) : null}

          {articles.length === 0 ? (
            <p className="text-lg leading-relaxed text-[#4a5568]" style={sans}>
              Os conteúdos estão em revisão. A aula experimental gratuita continua disponível pelo WhatsApp.
            </p>
          ) : null}

          {articles.length > 0 && visible.length === 0 ? (
            <p className="text-lg leading-relaxed text-[#4a5568]" style={sans}>
              Nenhum conteúdo com essa etiqueta.
            </p>
          ) : null}

          <ul className="grid min-w-0 gap-6">
            {visible.map((article) => (
              <li key={article.slug} className="min-w-0">
                <ArticleCard article={article} />
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand
        position="cta_conteudos"
        title="Quer conhecer o circuito?"
        text="A aula experimental é gratuita e sem compromisso. A equipe confirma o horário pelo WhatsApp."
        label="Agendar aula experimental gratuita"
        buttonClassName="h-auto w-full max-w-full whitespace-normal text-center sm:w-auto"
      />
    </PageShell>
  );
}

function ArticleCard({ article }: { article: Article }) {
  const cover = article.cover;
  const coverAlt = article.coverAlt;
  const hasCover = cover !== undefined && coverAlt !== undefined;

  return (
    <Link
      href={`/conteudos/${article.slug}`}
      className={`block min-w-0 overflow-hidden rounded-2xl shadow-sm transition-shadow hover:shadow-md ${hasCover ? "bg-white" : "border border-[#cda465] bg-[#f8f1e7]"}`}
      data-testid={`conteudo-card-${article.slug}`}
    >
      {hasCover ? (
        <img
          src={cover}
          alt={coverAlt}
          width={article.coverWidth}
          height={article.coverHeight}
          className="h-auto w-full object-cover"
        />
      ) : (
        <div className="bg-[#173b5a] px-6 pb-6 pt-7">
          <div className="h-1 w-12 rounded-full bg-[#cda465]" aria-hidden="true" />
          <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-[#cda465]" style={sans}>
            {article.category ?? "Conteúdos"}
          </p>
          <h2 className="mt-3 break-words text-2xl font-medium leading-tight text-[#f8f1e7]" style={serif}>
            {article.title}
          </h2>
        </div>
      )}
      <div className="min-w-0 p-6">
        <div className="flex min-w-0 flex-wrap items-center gap-2 text-sm text-[#173b5a]/80" style={sans}>
          {article.draft ? (
            <span className="rounded-full bg-[#cda465] px-3 py-1 text-xs font-semibold text-[#173b5a]">
              Rascunho
            </span>
          ) : null}
          {hasCover && article.category ? <span>{article.category}</span> : null}
          <time dateTime={article.date}>{formatLongDate(article.date)}</time>
        </div>
        {hasCover ? (
          <h2 className="mt-3 break-words text-2xl font-medium text-[#173b5a]" style={serif}>
            {article.title}
          </h2>
        ) : null}
        <p className={`break-words leading-relaxed text-[#173b5a] ${hasCover ? "mt-3" : "mt-0"}`} style={sans}>
          {article.summary}
        </p>
      </div>
    </Link>
  );
}

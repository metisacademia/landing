import { useParams } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import NotFound from "@/pages/not-found";
import { BreadcrumbTrail, CtaBand, FaqList, MedicalNotice, RelatedLinks, sans, serif } from "@/components/page-shell";
import { formatLongDate, getArticle, relatedOf } from "@/content/articles";
import { formatScheduledBadge } from "@/content/schedule";

export default function ConteudoArtigoPage() {
  const params = useParams<{ slug: string }>();
  const article = params.slug ? getArticle(params.slug) : undefined;
  if (!article) return <NotFound />;

  const related = relatedOf(article);
  const showToc = article.toc.length >= 2;

  return (
    <div className="min-h-screen bg-[#f8f1e7] text-foreground">
      <Navigation />
      <main>
        {article.draft ? (
          <p
            className="bg-[#cda465] px-6 pb-3 pt-24 text-center text-sm font-semibold leading-relaxed text-[#173b5a] md:pt-28"
            style={sans}
            data-testid="artigo-draft-banner"
          >
            Rascunho de exemplo. Este texto não entra no site publicado.
          </p>
        ) : null}
        {article.scheduled ? (
          <p
            className="bg-[#cda465] px-6 pb-3 pt-24 text-center text-sm font-semibold leading-relaxed text-[#173b5a] md:pt-28"
            style={sans}
            data-testid="artigo-agendado"
          >
            {formatScheduledBadge(article.date)}
          </p>
        ) : null}
        <header
          className={`border-b-4 border-[#cda465] bg-[#173b5a] text-[#f8f1e7] ${article.draft || article.scheduled ? "pb-14 pt-8 md:pb-20" : "pb-14 pt-28 md:pb-20 md:pt-36"}`}
        >
          <div className="container-elegant max-w-3xl min-w-0">
            <BreadcrumbTrail />
            <p className="mt-6 text-sm font-medium uppercase tracking-widest text-[#cda465]" style={sans}>
              {article.category ?? "Conteúdos"}
            </p>
            <h1 className="mt-4 break-words text-3xl font-medium leading-tight text-[#f8f1e7] md:text-5xl" style={serif} data-testid="artigo-titulo">
              {article.title}
            </h1>
            <div className="conteudo-byline mt-6 space-y-2 text-sm leading-relaxed text-[#f8f1e7]/85 md:text-base" style={sans}>
              <p>
                Por <span className="text-[#f8f1e7]">{article.author.name}</span>
              </p>
              {article.reviewer ? (
                <p data-testid="artigo-revisao">
                  Revisado por <span className="text-[#f8f1e7]">{article.reviewer.name}</span> em{" "}
                  <time dateTime={article.updated}>{formatLongDate(article.updated)}</time>
                  {article.reviewer.credential ? (
                    <span className="mt-1 block break-words text-white/70">{article.reviewer.credential}</span>
                  ) : null}
                </p>
              ) : null}
              <p>
                Publicado em <time dateTime={article.date}>{formatLongDate(article.date)}</time>
                {" · "}
                Atualizado em <time dateTime={article.updated}>{formatLongDate(article.updated)}</time>
              </p>
            </div>
          </div>
        </header>

        <article className="section-padding-sm">
          <div className="container-elegant max-w-3xl min-w-0">
            <aside className="conteudo-resumo rounded-2xl border border-[#cda465] bg-white p-6 md:p-8" data-testid="artigo-resumo">
              <h2 className="text-2xl font-medium text-[#173b5a]" style={serif}>
                Resposta rápida
              </h2>
              <p className="mt-3 break-words text-lg leading-relaxed text-[#173b5a]">{article.summary}</p>
            </aside>

            {article.cover && article.coverAlt ? (
              <figure className="mt-8 min-w-0">
                <img
                  src={article.cover}
                  alt={article.coverAlt}
                  width={article.coverWidth}
                  height={article.coverHeight}
                  className="h-auto w-full rounded-2xl object-cover"
                />
              </figure>
            ) : null}

            <div className={`mt-10 min-w-0 ${showToc ? "lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-10" : ""}`}>
              {showToc ? (
                <nav aria-label="Neste artigo" className="mb-8 min-w-0 lg:sticky lg:top-28 lg:mb-0 lg:self-start">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#cda465]" style={sans}>
                    Neste artigo
                  </p>
                  <ol className="mt-3 space-y-2">
                    {article.toc.map((item) => (
                      <li key={item.id} className={item.depth === 3 ? "pl-4" : undefined}>
                        <a href={`#${item.id}`} className="break-words text-sm text-[#173b5a] underline-offset-4 hover:underline" style={sans}>
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              ) : null}
              <div className="conteudo-body min-w-0" dangerouslySetInnerHTML={{ __html: article.html }} />
            </div>
          </div>
        </article>

        <div className="container-elegant max-w-3xl min-w-0 pb-4">
          <MedicalNotice />
        </div>

        {article.faq.length > 0 ? <FaqList faqs={article.faq} /> : null}
        {related.length > 0 ? <RelatedLinks links={related} /> : null}
        <CtaBand
          position={`cta_artigo_${article.slug}`}
          title="Quer conhecer a Métis?"
          text="A aula experimental é gratuita e sem compromisso. A equipe confirma horário e detalhes pelo WhatsApp."
          label="Agendar aula experimental gratuita"
          buttonClassName="h-auto w-full max-w-full whitespace-normal text-center sm:w-auto"
        />
      </main>
      <Footer />
    </div>
  );
}

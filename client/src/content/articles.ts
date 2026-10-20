import { includeContentDrafts } from "@/content/flags";
import { isFuturePublishDate } from "@/content/schedule";
import { splitFrontmatter, type YamlValue } from "@/content/frontmatter";
import { renderArticleMarkdown, type TocItem } from "@/content/markdown";
import { getPerson, type Person } from "@/content/people";
import { SITE_URL } from "@/lib/site";

export type ArticleFaq = {
  question: string;
  answer: string;
};

export type ArticleRelated = {
  slug?: string;
  href?: string;
  label?: string;
  text?: string;
};

export type Article = {
  file: string;
  title: string;
  description: string;
  slug: string;
  date: string;
  updated: string;
  author: Person;
  reviewer?: Person;
  summary: string;
  /** Ausente quando o artigo não tem capa. A página fica só com texto. */
  cover?: string;
  coverAlt?: string;
  coverWidth?: number;
  coverHeight?: number;
  /** Imagem 1200×630 para og:image e twitter:image. Sem isto, o Open Graph usa a capa. */
  ogImage?: string;
  category?: string;
  tags: string[];
  draft: boolean;
  /** Data futura no calendário de Recife. No preview aparece com noindex. */
  scheduled: boolean;
  faq: ArticleFaq[];
  related: ArticleRelated[];
  html: string;
  toc: TocItem[];
};

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Nome visível da etiqueta. O slug continua no filtro e no frontmatter. */
const TAG_LABELS: Record<string, string> = {
  aposentadoria: "Aposentadoria",
  arte: "Arte",
  atencao: "Atenção",
  atividades: "Atividades",
  "comprometimento-cognitivo-leve": "Comprometimento cognitivo leve",
  concentracao: "Concentração",
  conversa: "Conversa",
  convivio: "Convívio",
  cuidador: "Cuidador",
  cultura: "Cultura",
  diagnostico: "Diagnóstico",
  envelhecimento: "Envelhecimento",
  esquecimento: "Esquecimento",
  "estimulacao-cognitiva": "Estimulação cognitiva",
  familia: "Família",
  foco: "Foco",
  "funcoes-executivas": "Funções executivas",
  idosos: "Idosos",
  leitura: "Leitura",
  memoria: "Memória",
  "mente-ativa": "Mente ativa",
  musica: "Música",
  "pais-idosos": "Pais idosos",
  planejamento: "Planejamento",
  presente: "Presente",
  recife: "Recife",
  rotina: "Rotina",
  suplementos: "Suplementos",
  vitaminas: "Vitaminas",
};

export function tagLabel(slug: string): string {
  const label = TAG_LABELS[slug];
  if (!label) {
    throw new Error(`etiqueta "${slug}" sem nome em português`);
  }
  return label;
}

const modules = import.meta.glob("../../content/artigos/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function fail(file: string, message: string): never {
  throw new Error(`${file}: ${message}`);
}

function asString(file: string, data: Record<string, YamlValue>, key: string): string {
  const value = data[key];
  if (typeof value !== "string" || !value.trim()) {
    fail(file, `frontmatter "${key}" é obrigatório`);
  }
  return value.trim();
}

function asOptionalString(data: Record<string, YamlValue>, key: string): string | undefined {
  const value = data[key];
  if (value === undefined) return undefined;
  if (typeof value !== "string" || !value.trim()) return undefined;
  return value.trim();
}

function asBoolean(data: Record<string, YamlValue>, key: string): boolean {
  const value = data[key];
  if (value === undefined) return false;
  if (typeof value !== "boolean") {
    throw new Error(`frontmatter "${key}" precisa ser true ou false, sem aspas`);
  }
  return value;
}

function asOptionalNumber(file: string, data: Record<string, YamlValue>, key: string): number | undefined {
  const value = data[key];
  if (value === undefined) return undefined;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    fail(file, `frontmatter "${key}" precisa ser um número`);
  }
  return value;
}

function asStringList(file: string, value: YamlValue | undefined, key: string): string[] {
  if (value === undefined) return [];
  if (!Array.isArray(value)) fail(file, `frontmatter "${key}" precisa ser uma lista`);
  return value.map((item, index) => {
    if (typeof item !== "string" || !item.trim()) {
      fail(file, `frontmatter "${key}" item ${index + 1} precisa ser texto`);
    }
    return item.trim();
  });
}

function isRecord(value: YamlValue): value is { [key: string]: YamlValue } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asFaq(file: string, value: YamlValue | undefined): ArticleFaq[] {
  if (value === undefined) return [];
  if (!Array.isArray(value)) fail(file, 'frontmatter "faq" precisa ser uma lista');
  return value.map((item, index) => {
    if (!isRecord(item)) fail(file, `faq ${index + 1} precisa de question e answer`);
    const question = item.question;
    const answer = item.answer;
    if (typeof question !== "string" || !question.trim()) {
      fail(file, `faq ${index + 1} sem question`);
    }
    if (typeof answer !== "string" || !answer.trim()) {
      fail(file, `faq ${index + 1} sem answer`);
    }
    return { question: question.trim(), answer: answer.trim() };
  });
}

function asRelated(file: string, value: YamlValue | undefined): ArticleRelated[] {
  if (value === undefined) return [];
  if (!Array.isArray(value)) fail(file, 'frontmatter "related" precisa ser uma lista');
  return value.map((item, index) => {
    if (!isRecord(item)) fail(file, `related ${index + 1} é inválido`);
    const slug = typeof item.slug === "string" ? item.slug.trim() : undefined;
    const href = typeof item.href === "string" ? item.href.trim() : undefined;
    const label = typeof item.label === "string" ? item.label.trim() : undefined;
    const text = typeof item.text === "string" ? item.text.trim() : undefined;
    if (!slug && !href) fail(file, `related ${index + 1} precisa de slug ou href`);
    if (href && !href.startsWith("/")) fail(file, `related ${index + 1} href precisa começar com /`);
    if (href && !label) fail(file, `related ${index + 1} com href precisa de label`);
    return { slug, href, label, text };
  });
}

function isStrippedDraft(data: Record<string, YamlValue>, body: string): boolean {
  return data.draft === true && Object.keys(data).length === 1 && body.trim() === "";
}

function fileSlug(path: string): string {
  const base = path.split("/").pop() ?? path;
  return base.replace(/\.md$/, "");
}

function parseArticle(path: string, raw: string): Article | null {
  const { data, body } = splitFrontmatter(raw);
  if (isStrippedDraft(data, body)) return null;

  const file = fileSlug(path);
  const draft = asBoolean(data, "draft");
  if (draft && !includeContentDrafts) return null;

  const title = asString(file, data, "title");
  const description = asString(file, data, "description");
  const slug = asString(file, data, "slug");
  const date = asString(file, data, "date");
  const updated = asString(file, data, "updated");
  const authorId = asString(file, data, "author");
  const reviewerId = asOptionalString(data, "reviewer");
  const summary = asString(file, data, "summary");
  const cover = asOptionalString(data, "cover");
  const coverAlt = asOptionalString(data, "coverAlt");
  const ogImage = asOptionalString(data, "ogImage");

  if (slug !== file) fail(file, `o slug "${slug}" precisa ser igual ao nome do arquivo`);
  if (!SLUG.test(slug)) fail(file, "slug usa só letras minúsculas, números e hífen");
  if (description.length > 155) fail(file, `description tem ${description.length} caracteres; o máximo é 155`);
  if (/["<>]/.test(title) || /["<>]/.test(description)) {
    fail(file, "title e description não podem ter aspas ou < >");
  }
  if (!DATE.test(date) || !DATE.test(updated)) fail(file, "date e updated usam AAAA-MM-DD");
  const scheduled = !draft && isFuturePublishDate(date);
  if (summary.length > 300) fail(file, `summary tem ${summary.length} caracteres; o máximo é 300`);
  if (cover && !cover.startsWith("/")) fail(file, "cover precisa ser um caminho do site, começando com /");
  if (ogImage && !ogImage.startsWith("/")) fail(file, "ogImage precisa ser um caminho do site, começando com /");
  if (cover && !coverAlt) fail(file, "coverAlt é obrigatório quando há cover");
  if (!cover && (coverAlt || data.coverWidth !== undefined || data.coverHeight !== undefined)) {
    fail(file, "coverAlt, coverWidth e coverHeight só entram junto com cover");
  }
  if (!body.trim()) fail(file, "o artigo está sem texto depois do frontmatter");

  const author = getPerson(authorId);
  if (!author) fail(file, `author "${authorId}" não está em client/src/content/people.ts`);
  const reviewer = reviewerId ? getPerson(reviewerId) : undefined;
  if (reviewerId && !reviewer) {
    fail(file, `reviewer "${reviewerId}" não está em client/src/content/people.ts`);
  }

  if (scheduled && !includeContentDrafts) return null;

  const rendered = renderArticleMarkdown(body);
  return {
    file,
    title,
    description,
    slug,
    date,
    updated,
    author,
    reviewer,
    summary,
    cover,
    coverAlt,
    coverWidth: asOptionalNumber(file, data, "coverWidth"),
    coverHeight: asOptionalNumber(file, data, "coverHeight"),
    ogImage,
    category: asOptionalString(data, "category"),
    tags: asStringList(file, data.tags, "tags").map((tag) => {
      if (!TAG_LABELS[tag]) fail(file, `etiqueta "${tag}" sem nome em português`);
      return tag;
    }),
    draft,
    scheduled,
    faq: asFaq(file, data.faq),
    related: asRelated(file, data.related),
    html: rendered.html,
    toc: rendered.toc,
  };
}

function byDateDesc(left: Article, right: Article): number {
  if (left.date !== right.date) return left.date < right.date ? 1 : -1;
  return left.slug.localeCompare(right.slug, "pt-BR");
}

const articles: Article[] = Object.entries(modules)
  .map(([path, raw]) => parseArticle(path, raw))
  .filter((article): article is Article => article !== null)
  .sort(byDateDesc);

export function listVisibleArticles(): Article[] {
  return articles;
}

export function listPublishedArticles(): Article[] {
  return articles.filter((article) => !article.draft && !article.scheduled);
}

export function hasPublishedArticles(): boolean {
  return listPublishedArticles().length > 0;
}

export function hasVisibleArticles(): boolean {
  return articles.length > 0;
}

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

export function absoluteAssetUrl(src: string): string {
  if (src.startsWith("https://")) return src;
  return `${SITE_URL}${src.startsWith("/") ? src : `/${src}`}`;
}

const MONTHS = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
] as const;

export function formatLongDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  const monthIndex = Number(month) - 1;
  const monthName = MONTHS[monthIndex];
  if (!year || !day || !monthName) return iso;
  return `${Number(day)} de ${monthName} de ${year}`;
}

export type ResolvedRelated = {
  href: string;
  label: string;
  text: string;
};

export function relatedOf(article: Article): ResolvedRelated[] {
  const bySlug = new Map(articles.map((item) => [item.slug, item]));
  const links: ResolvedRelated[] = [];
  for (const item of article.related) {
    if (item.slug) {
      const target = bySlug.get(item.slug);
      if (!target || target.slug === article.slug) continue;
      links.push({
        href: `/conteudos/${target.slug}`,
        label: target.title,
        text: item.text || target.summary,
      });
      continue;
    }
    if (item.href && item.label) {
      links.push({ href: item.href, label: item.label, text: item.text ?? "" });
    }
  }
  return links;
}

export type NavItem = { href: string; label: string };

export function withConteudosLink<T extends NavItem>(links: readonly T[]): T[] {
  if (!hasPublishedArticles()) return [...links];
  const conteudos = { href: "/conteudos", label: "Conteúdos" } as T;
  const contato = links.findIndex((link) => link.href === "/contato");
  if (contato === -1) return [...links, conteudos];
  return [...links.slice(0, contato), conteudos, ...links.slice(contato)];
}

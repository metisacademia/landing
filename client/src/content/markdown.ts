import { Lexer, Marked, type RendererThis, type Tokens } from "marked";

export type TocItem = {
  id: string;
  text: string;
  depth: 2 | 3;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slugify(text: string): string {
  const base = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "secao";
}

function uniqueId(base: string, used: Map<string, number>): string {
  const seen = used.get(base) ?? 0;
  used.set(base, seen + 1);
  return seen === 0 ? base : `${base}-${seen + 1}`;
}

function headingDepth(depth: number): 2 | 3 | null {
  if (depth === 1 || depth === 2) return 2;
  if (depth === 3) return 3;
  return null;
}

export function renderArticleMarkdown(source: string): { html: string; toc: TocItem[] } {
  const tokens = new Lexer().lex(source);
  const toc: TocItem[] = [];
  const headingIds: string[] = [];
  const used = new Map<string, number>();

  for (const token of tokens) {
    if (token.type !== "heading") continue;
    const depth = headingDepth(token.depth);
    if (!depth) continue;
    const id = uniqueId(slugify(token.text), used);
    headingIds.push(id);
    toc.push({ id, text: token.text, depth });
  }

  let headingIndex = 0;
  const marked = new Marked({ async: false, gfm: true });
  marked.use({
    renderer: {
      heading(this: RendererThis, { tokens: inline, depth }: Tokens.Heading) {
        const inner = this.parser.parseInline(inline);
        const shown = headingDepth(depth);
        if (!shown) return `<h${depth}>${inner}</h${depth}>\n`;
        const id = headingIds[headingIndex] ?? uniqueId("secao", used);
        headingIndex += 1;
        return `<h${shown} id="${id}">${inner}</h${shown}>\n`;
      },
      image({ href, title, text }: Tokens.Image) {
        const alt = text.trim();
        if (!alt) throw new Error("Imagem no markdown sem texto alternativo");
        if (!href || /^\s*javascript:/i.test(href)) throw new Error("Endereço de imagem inválido");
        const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
        return `<img src="${escapeHtml(href)}" alt="${escapeHtml(alt)}"${titleAttr} loading="lazy" decoding="async" />`;
      },
      link(this: RendererThis, { href, title, tokens: inline }: Tokens.Link) {
        if (!href || /^\s*javascript:/i.test(href)) throw new Error("Link inválido no markdown");
        const inner = this.parser.parseInline(inline);
        const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
        const external = /^https?:\/\//i.test(href);
        const extra = external ? ' target="_blank" rel="noopener noreferrer"' : "";
        return `<a href="${escapeHtml(href)}"${titleAttr}${extra}>${inner}</a>`;
      },
      html({ text }: Tokens.HTML | Tokens.Tag) {
        return escapeHtml(text);
      },
    },
  });

  const parsed = marked.parse(source);
  if (typeof parsed !== "string") {
    throw new Error("O markdown do artigo deve ser renderizado de forma síncrona");
  }
  const html = parsed
    .replace(/<table>/g, '<div class="conteudo-table"><table>')
    .replace(/<\/table>/g, "</table></div>");
  return { html, toc };
}

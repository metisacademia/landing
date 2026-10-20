import { isFuturePublishDate } from "../client/src/content/schedule";

/**
 * Rascunhos e artigos com data futura entram no build só fora de produção.
 * O `vite build` e o prerender rodam com mode production; no Vercel,
 * VERCEL_ENV=preview (ou development) é o que libera esses textos no preview.
 * Produção (VERCEL_ENV=production) e o build local sem essa variável excluem.
 */
export function includeContentDrafts(mode: string): boolean {
  const env = process.env.VERCEL_ENV;
  if (env === "production") return false;
  if (env === "preview" || env === "development") return true;
  return mode !== "production";
}

function frontmatter(source: string): string | undefined {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match?.[1];
}

export function isDraftArticleSource(source: string): boolean {
  const body = frontmatter(source);
  if (!body) return false;
  return /^draft:\s*true\s*$/m.test(body);
}

/** Rascunho explícito ou data ainda futura em America/Recife. */
export function isHeldBackArticleSource(source: string, now: Date = new Date()): boolean {
  const body = frontmatter(source);
  if (!body) return false;
  if (/^draft:\s*true\s*$/m.test(body)) return true;
  const date = body.match(/^date:\s*["']?(\d{4}-\d{2}-\d{2})["']?\s*$/m);
  if (!date?.[1]) return false;
  return isFuturePublishDate(date[1], now);
}

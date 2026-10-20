/**
 * Rascunhos de Conteúdos entram no build só fora de produção.
 * O `vite build` e o prerender rodam com mode production; no Vercel,
 * VERCEL_ENV=preview (ou development) é o que libera o rascunho no preview.
 * Produção (VERCEL_ENV=production) e o build local sem essa variável excluem.
 */
export function includeContentDrafts(mode: string): boolean {
  const env = process.env.VERCEL_ENV;
  if (env === "production") return false;
  if (env === "preview" || env === "development") return true;
  return mode !== "production";
}

export function isDraftArticleSource(source: string): boolean {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match?.[1]) return false;
  return /^draft:\s*true\s*$/m.test(match[1]);
}

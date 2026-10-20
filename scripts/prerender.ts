import fs from "node:fs";
import path from "node:path";
import { createServer } from "vite";

const projectRoot = path.resolve(import.meta.dirname, "..");
const distDir = path.join(projectRoot, "dist/public");

const vite = await createServer({
  configFile: path.join(projectRoot, "vite.config.ts"),
  server: { middlewareMode: true },
  appType: "custom",
});

try {
  const { render } = (await vite.ssrLoadModule("/src/entry-server.tsx")) as {
    render: (url: string) => string;
  };
  const seo = (await vite.ssrLoadModule("/src/lib/seo.ts")) as {
    prerenderPages: () => Array<{
      path: string;
      title: string;
      canonical: string;
      htmlCheck: string;
      indexable: boolean;
      robots: string;
    }>;
    renderHead: (page: unknown) => string;
    renderSitemap: (lastmod: string) => string;
    renderSpaHead: () => string;
    indexablePages: () => Array<{ path: string; canonical: string }>;
    getSeo: (path: string) => unknown;
  };

  const templatePath = path.join(distDir, "index.html");
  const template = fs.readFileSync(templatePath, "utf8");
  const marker = /<!--seo-head:start-->[\s\S]*?<!--seo-head:end-->/;
  if (!marker.test(template)) {
    throw new Error("Marcadores <!--seo-head--> não encontrados em dist/public/index.html");
  }
  if (!template.includes('<div id="root"></div>')) {
    throw new Error("div#root vazia não encontrada no template");
  }

  const spa = template.replace(
    marker,
    `<!--seo-head:start-->\n    ${seo.renderSpaHead()}\n    <!--seo-head:end-->`,
  );
  fs.writeFileSync(path.join(distDir, "spa.html"), spa);

  const pages = seo.prerenderPages();
  for (const page of pages) {
    const html = render(page.path);
    const head = seo.renderHead(seo.getSeo(page.path));
    const document = template
      .replace(marker, `<!--seo-head:start-->\n    ${head}\n    <!--seo-head:end-->`)
      .replace('<div id="root"></div>', `<div id="root">${html}</div>`);

    const outFile =
      page.path === "/"
        ? path.join(distDir, "index.html")
        : path.join(distDir, page.path.slice(1), "index.html");
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, document);
    assertPage(outFile, document, page);
    console.log(`prerender ${page.path} → ${path.relative(projectRoot, outFile)} (${document.length} bytes)`);
  }

  const lastmod = "2026-10-20";
  const sitemap = seo.renderSitemap(lastmod);
  fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemap);
  fs.writeFileSync(path.join(projectRoot, "client/public/sitemap.xml"), sitemap);

  if (sitemap.includes("/equipe")) throw new Error("sitemap não pode listar /equipe");
  if (sitemap.includes("/admin")) throw new Error("sitemap não pode listar /admin");
  if (sitemap.includes("/checkout")) throw new Error("sitemap não pode listar /checkout");
  if (sitemap.includes("https://metisacademia.com.br")) {
    throw new Error("sitemap ainda aponta para o host sem www");
  }
  for (const page of seo.indexablePages()) {
    if (!sitemap.includes(`<loc>${page.canonical}</loc>`)) {
      throw new Error(`sitemap sem ${page.canonical}`);
    }
  }

  console.log(`sitemap com ${seo.indexablePages().length} URLs`);
} finally {
  await vite.close();
}

function assertPage(
  file: string,
  html: string,
  page: { path: string; title: string; canonical: string; htmlCheck: string; indexable: boolean; robots: string },
) {
  if (!html.includes(`<title>${page.title}</title>`)) {
    throw new Error(`${file} sem title esperado`);
  }
  if (!html.includes(`rel="canonical" href="${page.canonical}"`)) {
    throw new Error(`${file} sem canonical ${page.canonical}`);
  }
  if (!html.includes(page.htmlCheck)) {
    throw new Error(`${file} sem o texto "${page.htmlCheck}"`);
  }
  if (!html.includes(`content="${page.robots}"`)) {
    throw new Error(`${file} sem robots ${page.robots}`);
  }
  if (/https:\/\/metisacademia\.com\.br/.test(html)) {
    throw new Error(`${file} ainda cita o host sem www`);
  }
  const h1Count = html.match(/<h1[\s>]/g)?.length ?? 0;
  if (h1Count !== 1) {
    throw new Error(`${file} tem ${h1Count} h1`);
  }
  for (const tag of html.match(/<img\b[^>]*>/g) ?? []) {
    if (!/\balt="[^"]+"/.test(tag)) {
      throw new Error(`${file} tem imagem sem alt: ${tag.slice(0, 120)}`);
    }
  }
  if (!html.includes('lang="pt-BR"')) {
    throw new Error(`${file} sem lang pt-BR`);
  }
  if (page.path === "/") {
    const answer = "O circuito é uma jornada semanal de 2h30";
    if (!html.includes(answer)) throw new Error("Home sem a resposta do FAQ no HTML");
    if (!html.includes('"@type":"HealthClub"') && !html.includes('"@type": "HealthClub"')) {
      throw new Error("Home sem schema HealthClub");
    }
  }
  if (page.indexable && page.path !== "/" && !html.includes("BreadcrumbList")) {
    throw new Error(`${file} sem BreadcrumbList`);
  }
}

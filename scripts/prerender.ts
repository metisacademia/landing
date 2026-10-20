import fs from "node:fs";
import path from "node:path";
import { createServer } from "vite";
import { includeContentDrafts } from "./content-drafts";

const projectRoot = path.resolve(import.meta.dirname, "..");
const distDir = path.join(projectRoot, "dist/public");
const draftsInBuild = includeContentDrafts("production");

const vite = await createServer({
  configFile: path.join(projectRoot, "vite.config.ts"),
  // O mesmo mode do `vite build`. Sem isto o SSR do prerender fica em
  // development e os rascunhos entrariam no HTML de produção.
  mode: "production",
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
    publishedArticleCount: () => number;
    publishedArticleLinks: () => Array<{ title: string; canonical: string; description: string }>;
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

  const notFoundHtml = render("/404");
  const notFoundHead = seo.renderHead(seo.getSeo("/404"));
  const notFoundDocument = template
    .replace(marker, `<!--seo-head:start-->\n    ${notFoundHead}\n    <!--seo-head:end-->`)
    .replace('<div id="root"></div>', `<div id="root">${notFoundHtml}</div>`);
  const notFoundFile = path.join(distDir, "404.html");
  fs.writeFileSync(notFoundFile, notFoundDocument);
  assertPage(notFoundFile, notFoundDocument, {
    path: "/404",
    title: "Página não encontrada | Métis Academia da Mente",
    canonical: "https://www.metisacademia.com.br/404",
    htmlCheck: "Página não encontrada",
    indexable: false,
    robots: "noindex, nofollow",
  });
  console.log(`prerender /404 → ${path.relative(projectRoot, notFoundFile)} (${notFoundDocument.length} bytes)`);

  const lastmod = new Date().toISOString().slice(0, 10);
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
  if (sitemap.includes("exemplo-rascunho")) {
    throw new Error("sitemap não pode listar o rascunho de exemplo");
  }
  if (seo.publishedArticleCount() === 0 && sitemap.includes("/conteudos")) {
    throw new Error("sitemap listou /conteudos sem artigo publicado");
  }

  const llmsPath = path.join(distDir, "llms.txt");
  const publishedLinks = seo.publishedArticleLinks();
  if (publishedLinks.length > 0) {
    const current = fs.readFileSync(llmsPath, "utf8").trimEnd();
    const section = [
      "",
      "## Conteúdos",
      "",
      ...publishedLinks.map((link) => `- [${link.title}](${link.canonical}): ${link.description}`),
      "",
    ].join("\n");
    fs.writeFileSync(llmsPath, `${current}\n${section}`);
  }
  const llms = fs.readFileSync(llmsPath, "utf8");
  if (llms.includes("exemplo-rascunho")) {
    throw new Error("llms.txt não pode listar o rascunho de exemplo");
  }

  const homeHtml = fs.readFileSync(path.join(distDir, "index.html"), "utf8");
  if (seo.publishedArticleCount() === 0 && homeHtml.includes(">Conteúdos<")) {
    throw new Error("a home mostra o menu Conteúdos sem artigo publicado");
  }
  if (seo.publishedArticleCount() > 0 && !homeHtml.includes('href="/conteudos"')) {
    throw new Error("a home não mostra o menu Conteúdos com artigo publicado");
  }

  const draftFile = path.join(distDir, "conteudos/exemplo-rascunho/index.html");
  const conteudosIndex = path.join(distDir, "conteudos/index.html");
  if (fs.existsSync(draftFile)) {
    throw new Error("o rascunho de exemplo não pode ser gerado");
  }
  if (seo.publishedArticleCount() === 0 && fs.existsSync(conteudosIndex)) {
    throw new Error("build gerou /conteudos sem artigo publicado");
  }
  if (seo.publishedArticleCount() > 0) {
    if (!fs.existsSync(conteudosIndex)) throw new Error("índice /conteudos não foi pré-renderizado");
    const indexHtml = fs.readFileSync(conteudosIndex, "utf8");
    for (const link of publishedLinks) {
      const slug = new URL(link.canonical).pathname.replace(/^\//, "");
      const articleFile = path.join(distDir, slug, "index.html");
      if (!fs.existsSync(articleFile)) throw new Error(`artigo sem HTML: ${link.canonical}`);
      const articleHtml = fs.readFileSync(articleFile, "utf8");
      if (!articleHtml.includes(link.title)) throw new Error(`${link.canonical} sem o título`);
      if (!indexHtml.includes(link.title)) throw new Error(`índice sem ${link.title}`);
      if (!sitemap.includes(`<loc>${link.canonical}</loc>`)) throw new Error(`sitemap sem ${link.canonical}`);
      if (!llms.includes(link.canonical)) throw new Error(`llms.txt sem ${link.canonical}`);
      if (!articleHtml.includes("FAQPage")) throw new Error(`${link.canonical} sem FAQPage`);
      if (!articleHtml.includes('"@type":"BlogPosting"') && !articleHtml.includes('"@type": "BlogPosting"')) {
        throw new Error(`${link.canonical} sem BlogPosting`);
      }
      if (articleHtml.includes("reviewedBy") || articleHtml.includes("Revisado por")) {
        throw new Error(`${link.canonical} ainda mostra revisor`);
      }
      if (!articleHtml.includes('"author":{"@type":"Organization","name":"Métis Academia da Mente","url":"https://www.metisacademia.com.br"}')) {
        throw new Error(`${link.canonical} sem autor organização`);
      }
      const slugName = slug.split("/").pop() ?? slug;
      if (slugName === "esquecimento-e-normal" || slugName === "funcoes-executivas") {
        const shareUrl = `https://www.metisacademia.com.br/images/conteudos/og/${slugName}.jpg`;
        const coverUrl = `https://www.metisacademia.com.br/images/conteudos/${slugName}.jpg`;
        if (!articleHtml.includes(`<meta property="og:image" content="${shareUrl}" />`)) {
          throw new Error(`${link.canonical} sem og:image da imagem de compartilhamento`);
        }
        if (!articleHtml.includes(`<meta name="twitter:image" content="${shareUrl}" />`)) {
          throw new Error(`${link.canonical} sem twitter:image da imagem de compartilhamento`);
        }
        if (!articleHtml.includes('<meta property="og:image:width" content="1200" />')) {
          throw new Error(`${link.canonical} sem og:image:width 1200`);
        }
        if (!articleHtml.includes('<meta property="og:image:height" content="630" />')) {
          throw new Error(`${link.canonical} sem og:image:height 630`);
        }
        const postingAt = articleHtml.indexOf('"@type":"BlogPosting"');
        const posting = postingAt >= 0 ? articleHtml.slice(postingAt, postingAt + 1200) : "";
        if (!posting.includes(`"image":"${coverUrl}"`)) {
          throw new Error(`${link.canonical} sem a capa no BlogPosting`);
        }
        if (!articleHtml.includes(`src="/images/conteudos/${slugName}.jpg"`)) {
          throw new Error(`${link.canonical} sem a capa na página`);
        }
      }
      assertLocalImages(articleFile, articleHtml);
      for (const href of ["/como-funciona", "/aula-experimental", "/treino-cognitivo-em-recife"]) {
        if (!articleHtml.includes(`href="${href}"`)) throw new Error(`${link.canonical} sem ${href}`);
      }
      if (!articleHtml.includes('target="_blank"')) throw new Error(`${link.canonical} sem link externo em nova aba`);
    }
    const memoria = fs.readFileSync(path.join(distDir, "conteudos/esquecimento-e-normal/index.html"), "utf8");
    const executivas = fs.readFileSync(path.join(distDir, "conteudos/funcoes-executivas/index.html"), "utf8");
    if (!memoria.includes('href="/conteudos/funcoes-executivas"')) {
      throw new Error("artigo de esquecimento sem link para funções executivas");
    }
    if (!memoria.includes('href="/salas/memoria"')) throw new Error("artigo de esquecimento sem a Sala da Memória");
    if (!executivas.includes('href="/conteudos/esquecimento-e-normal"')) {
      throw new Error("artigo de funções executivas sem link para esquecimento");
    }
    if (!executivas.includes('href="/salas/funcoes-executivas"')) {
      throw new Error("artigo de funções executivas sem a sala");
    }
    for (const slugName of ["esquecimento-e-normal", "funcoes-executivas"]) {
      if (!indexHtml.includes(`src="/images/conteudos/${slugName}.jpg"`)) {
        throw new Error(`índice sem a capa de ${slugName}`);
      }
    }
    for (const label of ["Atenção", "Funções executivas", "Família", "Memória", "Envelhecimento", "Esquecimento", "Planejamento", "Recife"]) {
      if (!indexHtml.includes(label)) throw new Error(`índice sem a etiqueta ${label}`);
    }
    for (const raw of [">atencao<", ">familia<", ">funcoes-executivas<", ">memoria<"]) {
      if (indexHtml.includes(raw)) throw new Error(`índice mostra o slug cru ${raw}`);
    }
    assertLocalImages(conteudosIndex, indexHtml);
  }

  if (!draftsInBuild) {
    const assetsDir = path.join(distDir, "assets");
    for (const file of fs.readdirSync(assetsDir)) {
      if (!file.endsWith(".js")) continue;
      const js = fs.readFileSync(path.join(assetsDir, file), "utf8");
      if (js.includes("Para que serve este modelo")) {
        throw new Error(`${file} ainda contém o texto do rascunho de exemplo`);
      }
    }
  }

  console.log(
    `sitemap com ${seo.indexablePages().length} URLs; rascunhos ${draftsInBuild ? "incluídos no preview" : "fora da produção"}; artigos publicados: ${seo.publishedArticleCount()}`,
  );
} finally {
  await vite.close();
}

function assertLocalImages(file: string, html: string) {
  const urls = new Set<string>();
  for (const match of html.matchAll(/\bsrc="([^"]+)"/g)) urls.add(match[1]);
  for (const match of html.matchAll(/property="og:image" content="([^"]+)"/g)) urls.add(match[1]);
  for (const url of urls) {
    const pathOnly = url.replace(/^https:\/\/www\.metisacademia\.com\.br/, "");
    if (!pathOnly.startsWith("/") || pathOnly.includes("?")) continue;
    const local = path.join(distDir, decodeURIComponent(pathOnly).replace(/^\//, ""));
    if (!fs.existsSync(local)) {
      throw new Error(`${file} aponta para arquivo ausente: ${pathOnly}`);
    }
  }
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
  const description = html.match(/<meta name="description" content="([^"]*)"/);
  if (!description) throw new Error(`${file} sem meta description`);
  if (description[1].length > 155) {
    throw new Error(`${file} description com ${description[1].length} caracteres`);
  }
  const forbidden = [
    "programa preventivo",
    "evidências científicas comprovadas",
    "evidências comprovadas",
    "alta performance",
    "O site ",
    "neste site",
    "nesta página",
    "50+",
    "60+",
    "Não existem filiais",
  ];
  for (const phrase of forbidden) {
    if (html.includes(phrase)) throw new Error(`${file} contém "${phrase}"`);
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

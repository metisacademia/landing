import {
  ADDRESS,
  BUSINESS_DESCRIPTION,
  EMAIL,
  GEO,
  INSTAGRAM_URL,
  NAP_NAME,
  OG_IMAGE,
  PHONE_SCHEMA,
  PRICE_RANGE_SCHEMA,
  SITE_URL,
  allFaqs,
  canonicalUrl,
  extraFaqs,
  homeFaqs,
  plans,
  roomFaqs,
  roomOrder,
  rooms,
  type Faq,
  type RoomSlug,
} from "@/lib/site";

export type Crumb = {
  name: string;
  path: string;
};

export type PageSeo = {
  path: string;
  title: string;
  description: string;
  canonical: string;
  robots: string;
  indexable: boolean;
  prerender: boolean;
  changefreq: "weekly" | "monthly";
  priority: string;
  breadcrumbs: Crumb[];
  jsonLd: Record<string, unknown>;
  preloadImage?: string;
  /** Trecho que precisa existir no HTML prerenderizado. */
  htmlCheck: string;
};

const HOME_TITLE = "Métis Academia da Mente | Treino cognitivo em Recife (Graças)";
const HOME_DESCRIPTION =
  "Academia da mente criada por neurologistas nas Graças, Recife. Circuito semanal de 2h30 em grupos de até 6. Agende sua aula experimental gratuita.";

function healthClubNode(): Record<string, unknown> {
  return {
    "@type": "HealthClub",
    "@id": `${SITE_URL}/#negocio`,
    name: NAP_NAME,
    description: BUSINESS_DESCRIPTION,
    url: `${SITE_URL}/`,
    telephone: PHONE_SCHEMA,
    email: EMAIL,
    image: OG_IMAGE,
    logo: OG_IMAGE,
    priceRange: PRICE_RANGE_SCHEMA,
    currenciesAccepted: "BRL",
    slogan: "A academia que exercita sua mente.",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${ADDRESS.street}, ${ADDRESS.building}, ${ADDRESS.neighborhood}`,
      addressLocality: ADDRESS.city,
      addressRegion: ADDRESS.region,
      postalCode: ADDRESS.postalCode,
      addressCountry: ADDRESS.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: GEO.latitude,
      longitude: GEO.longitude,
    },
    hasMap: "https://maps.google.com/?q=R.+das+Pernambucanas,+407,+Gra%C3%A7as,+Recife",
    areaServed: {
      "@type": "City",
      name: "Recife",
      addressRegion: "PE",
      addressCountry: "BR",
    },
    sameAs: [INSTAGRAM_URL],
    makesOffer: [
      ...plans.map((plan) => ({
        "@type": "Offer",
        name: `Plano ${plan.name}`,
        url: canonicalUrl("/planos"),
        price: plan.priceSchema,
        priceCurrency: "BRL",
        description: `R$ ${plan.price} por mês. ${plan.benefits.join(". ")}.`,
      })),
      {
        "@type": "Offer",
        name: "Aula experimental gratuita",
        url: canonicalUrl("/aula-experimental"),
        price: "0",
        priceCurrency: "BRL",
        description:
          "Aula experimental gratuita e sem compromisso, agendada pelo WhatsApp, para conhecer a metodologia, a equipe e o ambiente.",
      },
    ],
  };
}

function organizationNode(): Record<string, unknown> {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organizacao`,
    name: NAP_NAME,
    url: `${SITE_URL}/`,
    logo: OG_IMAGE,
    email: EMAIL,
    telephone: PHONE_SCHEMA,
    sameAs: [INSTAGRAM_URL],
    address: {
      "@type": "PostalAddress",
      streetAddress: `${ADDRESS.street}, ${ADDRESS.building}, ${ADDRESS.neighborhood}`,
      addressLocality: ADDRESS.city,
      addressRegion: ADDRESS.region,
      postalCode: ADDRESS.postalCode,
      addressCountry: ADDRESS.country,
    },
  };
}

function websiteNode(): Record<string, unknown> {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: NAP_NAME,
    inLanguage: "pt-BR",
    publisher: { "@id": `${SITE_URL}/#organizacao` },
  };
}

function courseNode(): Record<string, unknown> {
  return {
    "@type": "Course",
    "@id": `${SITE_URL}/#circuito`,
    name: "Programa de Estímulo Cognitivo Métis",
    description:
      "Treino cognitivo semanal, presencial, com metodologia desenvolvida por neurologistas. O circuito dura 2h30 e percorre quatro salas: Linguagem, Memória, Funções Executivas e Contemplação, em grupos de até 6 pessoas. É estímulo cognitivo e não substitui avaliação médica.",
    provider: { "@id": `${SITE_URL}/#organizacao` },
    inLanguage: "pt-BR",
    offers: {
      "@type": "Offer",
      category: "Paid",
      priceCurrency: "BRL",
      price: "790.00",
      url: canonicalUrl("/planos"),
      description: `Planos de ${PRICE_RANGE_SCHEMA} por mês. O valor mais baixo é o plano anual.`,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "onsite",
      duration: "PT2H30M",
      repeatFrequency: "P1W",
      location: {
        "@type": "Place",
        name: ADDRESS.building,
        address: {
          "@type": "PostalAddress",
          streetAddress: ADDRESS.street,
          addressLocality: ADDRESS.city,
          addressRegion: ADDRESS.region,
          postalCode: ADDRESS.postalCode,
          addressCountry: ADDRESS.country,
        },
      },
    },
  };
}

function webPageNode(page: {
  path: string;
  title: string;
  description: string;
  canonical: string;
}): Record<string, unknown> {
  return {
    "@type": "WebPage",
    "@id": `${page.canonical}#webpage`,
    url: page.canonical,
    name: page.title,
    description: page.description,
    inLanguage: "pt-BR",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#negocio` },
    primaryImageOfPage: OG_IMAGE,
  };
}

function breadcrumbNode(crumbs: Crumb[]): Record<string, unknown> {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: canonicalUrl(crumb.path),
    })),
  };
}

function faqNode(faqs: readonly Faq[]): Record<string, unknown> {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

function graph(nodes: Record<string, unknown>[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}

type PageInput = {
  path: string;
  title: string;
  description: string;
  indexable?: boolean;
  prerender?: boolean;
  changefreq?: "weekly" | "monthly";
  priority: string;
  breadcrumbs: Crumb[];
  faqs?: readonly Faq[];
  extraNodes?: Record<string, unknown>[];
  includeBusiness?: boolean;
  preloadImage?: string;
  htmlCheck: string;
  robots?: string;
};

function buildPage(input: PageInput): PageSeo {
  const indexable = input.indexable ?? true;
  const canonical = canonicalUrl(input.path);
  const robots = input.robots ?? (indexable ? "index, follow" : "noindex, nofollow");
  const nodes: Record<string, unknown>[] = [];
  if (input.includeBusiness !== false) nodes.push(healthClubNode());
  if (input.path === "/") {
    nodes.push(organizationNode(), websiteNode(), courseNode());
  }
  if (input.path === "/como-funciona") nodes.push(courseNode());
  nodes.push(
    webPageNode({
      path: input.path,
      title: input.title,
      description: input.description,
      canonical,
    }),
  );
  if (input.breadcrumbs.length > 1) nodes.push(breadcrumbNode(input.breadcrumbs));
  if (input.faqs && input.faqs.length > 0) nodes.push(faqNode(input.faqs));
  if (input.extraNodes) nodes.push(...input.extraNodes);

  return {
    path: input.path,
    title: input.title,
    description: input.description,
    canonical,
    robots,
    indexable,
    prerender: input.prerender ?? true,
    changefreq: input.changefreq ?? "monthly",
    priority: input.priority,
    breadcrumbs: input.breadcrumbs,
    jsonLd: graph(nodes),
    preloadImage: input.preloadImage,
    htmlCheck: input.htmlCheck,
  };
}

const homeCrumb: Crumb = { name: "Início", path: "/" };

const roomPages: PageSeo[] = roomOrder.map((slug) => {
  const room = rooms[slug];
  return buildPage({
    path: `/salas/${slug}`,
    title: room.seoTitle,
    description: room.seoDescription,
    priority: "0.7",
    breadcrumbs: [
      homeCrumb,
      { name: "Como funciona", path: "/como-funciona" },
      { name: room.title, path: `/salas/${slug}` },
    ],
    faqs: roomFaqs(room),
    htmlCheck: room.title,
  });
});

const pages: PageSeo[] = [
  buildPage({
    path: "/",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    priority: "1.0",
    changefreq: "weekly",
    breadcrumbs: [homeCrumb],
    faqs: homeFaqs,
    preloadImage: "/images/new-hero-background.png",
    htmlCheck: "A academia que",
  }),
  buildPage({
    path: "/como-funciona",
    title: "Como funciona o circuito Métis | Academia da Mente em Recife",
    description:
      "O circuito da Métis: 2h30 por semana, quatro salas e grupos de até 6 adultos, nas Graças, Recife. Conheça as salas e agende uma aula experimental.",
    priority: "0.9",
    breadcrumbs: [homeCrumb, { name: "Como funciona", path: "/como-funciona" }],
    faqs: [homeFaqs[0], homeFaqs[4], homeFaqs[2]],
    htmlCheck: "Como funciona o circuito Métis",
  }),
  ...roomPages,
  buildPage({
    path: "/planos",
    title: "Planos e preços | Métis Academia da Mente em Recife",
    description:
      "Planos de treino cognitivo na Métis, nas Graças: de R$ 790 a R$ 1.145 por mês. Aula semanal de 2h30 em grupos de até 6. Aula experimental gratuita.",
    priority: "0.9",
    breadcrumbs: [homeCrumb, { name: "Planos e preços", path: "/planos" }],
    faqs: [extraFaqs[1], homeFaqs[3], homeFaqs[4]],
    htmlCheck: "Planos e preços",
  }),
  buildPage({
    path: "/aula-experimental",
    title: "Aula experimental gratuita | Métis Academia da Mente",
    description:
      "Aula experimental gratuita na Métis, nas Graças, Recife. Sem compromisso. A equipe confirma horário e detalhes pelo WhatsApp.",
    priority: "0.8",
    breadcrumbs: [
      homeCrumb,
      { name: "Aula experimental", path: "/aula-experimental" },
    ],
    faqs: [homeFaqs[3], extraFaqs[3], homeFaqs[1]],
    htmlCheck: "Aula experimental gratuita",
  }),
  buildPage({
    path: "/perguntas-frequentes",
    title: "Perguntas frequentes | Métis Academia da Mente",
    description:
      "Dúvidas sobre o treino cognitivo da Métis em Recife: como funciona, para quem é, preços, aula experimental e se é preciso encaminhamento médico.",
    priority: "0.8",
    breadcrumbs: [
      homeCrumb,
      { name: "Perguntas frequentes", path: "/perguntas-frequentes" },
    ],
    faqs: allFaqs,
    htmlCheck: "Perguntas frequentes",
  }),
  buildPage({
    path: "/contato",
    title: "Contato e como chegar | Métis nas Graças, Recife",
    description:
      "Como chegar à Métis nas Graças, Recife: Kronos Empresarial, Rua das Pernambucanas, 407, sala 1203.",
    priority: "0.8",
    breadcrumbs: [homeCrumb, { name: "Contato", path: "/contato" }],
    faqs: [extraFaqs[0], extraFaqs[5], extraFaqs[6]],
    htmlCheck: "Como chegar",
  }),
  buildPage({
    path: "/treino-cognitivo-em-recife",
    title: "Treino cognitivo em Recife | Métis nas Graças",
    description:
      "Treino cognitivo para adultos e idosos nas Graças, Recife: circuito semanal de 2h30, grupos de até 6. Aula experimental grátis.",
    priority: "0.9",
    breadcrumbs: [
      homeCrumb,
      { name: "Treino cognitivo em Recife", path: "/treino-cognitivo-em-recife" },
    ],
    faqs: [homeFaqs[0], extraFaqs[1], extraFaqs[0], extraFaqs[2]],
    htmlCheck: "Treino cognitivo em Recife",
  }),
  buildPage({
    path: "/para-medicos",
    title: "Para médicos: como indicar a Métis | Recife",
    description:
      "Como médicos e clínicas podem indicar adultos à Métis, nas Graças, Recife. Estímulo cognitivo que não substitui o cuidado médico.",
    priority: "0.6",
    breadcrumbs: [homeCrumb, { name: "Para médicos", path: "/para-medicos" }],
    faqs: [homeFaqs[1], extraFaqs[2], extraFaqs[3]],
    htmlCheck: "como indicar a Métis",
  }),
];

const byPath = new Map<string, PageSeo>(pages.map((page) => [page.path, page]));

export function normalizePath(pathname: string): string {
  const clean = pathname.split("?")[0]?.split("#")[0] ?? "/";
  if (clean.length > 1 && clean.endsWith("/")) return clean.slice(0, -1);
  return clean || "/";
}

const notFoundSeo: PageSeo = buildPage({
  path: "/404",
  title: "Página não encontrada | Métis Academia da Mente",
  description: "Este endereço não faz parte da Métis Academia da Mente.",
  indexable: false,
  prerender: false,
  robots: "noindex, nofollow",
  priority: "0",
  breadcrumbs: [homeCrumb, { name: "Página não encontrada", path: "/404" }],
  includeBusiness: false,
  htmlCheck: "Página não encontrada",
});

const privateSeo = (path: string, title: string): PageSeo =>
  buildPage({
    path,
    title,
    description: "Área interna da Métis Academia da Mente.",
    indexable: false,
    prerender: false,
    robots: "noindex, nofollow",
    priority: "0",
    breadcrumbs: [homeCrumb],
    includeBusiness: false,
    htmlCheck: title,
  });

export function getSeo(pathname: string): PageSeo {
  const path = normalizePath(pathname);
  const known = byPath.get(path);
  if (known) return known;
  if (path === "/checkout") return privateSeo(path, "Checkout | Métis Academia da Mente");
  if (path.startsWith("/admin")) return privateSeo(path, "Área interna | Métis Academia da Mente");
  return { ...notFoundSeo, path, canonical: canonicalUrl(path) };
}

export function prerenderPages(): PageSeo[] {
  return pages.filter((page) => page.prerender);
}

export function indexablePages(): PageSeo[] {
  return pages.filter((page) => page.indexable);
}

export function isRoomSlug(value: string): value is RoomSlug {
  return Object.prototype.hasOwnProperty.call(rooms, value);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderHead(seo: PageSeo): string {
  const lines = [
    `<title>${escapeHtml(seo.title)}</title>`,
    `<meta name="description" content="${escapeHtml(seo.description)}" />`,
    `<link rel="canonical" href="${escapeHtml(seo.canonical)}" />`,
    `<meta name="robots" content="${escapeHtml(seo.robots)}" />`,
    `<meta property="og:title" content="${escapeHtml(seo.title)}" />`,
    `<meta property="og:site_name" content="${escapeHtml(NAP_NAME)}" />`,
    `<meta property="og:description" content="${escapeHtml(seo.description)}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:image:secure_url" content="${OG_IMAGE}" />`,
    `<meta property="og:image:width" content="1080" />`,
    `<meta property="og:image:height" content="1080" />`,
    `<meta property="og:image:alt" content="Logotipo da Métis Academia da Mente" />`,
    `<meta property="og:url" content="${escapeHtml(seo.canonical)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
  ];
  if (seo.preloadImage) {
    lines.push(`<link rel="preload" as="image" href="${escapeHtml(seo.preloadImage)}" />`);
  }
  const json = JSON.stringify(seo.jsonLd).replace(/</g, "\\u003c");
  lines.push(`<script type="application/ld+json" id="seo-jsonld">${json}</script>`);
  return lines.join("\n    ");
}

export function renderSitemap(lastmod: string): string {
  const urls = indexablePages()
    .map(
      (page) => `  <url>
    <loc>${page.canonical}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export function renderSpaHead(): string {
  return `<title>Métis Academia da Mente</title>
    <meta name="robots" content="noindex, nofollow" />`;
}

import { useEffect } from "react";
import { useLocation } from "wouter";
import { OG_IMAGE } from "@/lib/site";
import { getSeo } from "@/lib/seo";

function upsertMeta(attribute: "name" | "property", key: string, content: string) {
  const selector = `meta[${attribute}="${key}"]`;
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let element = document.head.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

function removeMeta(attribute: "name" | "property", key: string) {
  document.head.querySelector(`meta[${attribute}="${key}"]`)?.remove();
}

export default function SeoHead() {
  const [location] = useLocation();

  useEffect(() => {
    const seo = getSeo(location);
    const image = seo.ogImage ?? OG_IMAGE;
    const ogType = seo.ogType ?? "website";
    document.title = seo.title;
    upsertMeta("name", "description", seo.description);
    upsertMeta("name", "robots", seo.robots);
    upsertCanonical(seo.canonical);
    upsertMeta("property", "og:title", seo.title);
    upsertMeta("property", "og:description", seo.description);
    upsertMeta("property", "og:url", seo.canonical);
    upsertMeta("property", "og:image", image);
    upsertMeta("property", "og:image:alt", seo.ogImageAlt ?? "Logotipo da Métis Academia da Mente");
    upsertMeta("property", "og:site_name", "Métis Academia da Mente");
    upsertMeta("property", "og:type", ogType);
    upsertMeta("property", "og:locale", "pt_BR");
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", seo.title);
    upsertMeta("name", "twitter:description", seo.description);
    upsertMeta("name", "twitter:image", image);
    if (seo.ogImageWidth && seo.ogImageHeight) {
      upsertMeta("property", "og:image:width", String(seo.ogImageWidth));
      upsertMeta("property", "og:image:height", String(seo.ogImageHeight));
    } else if (!seo.ogImage) {
      upsertMeta("property", "og:image:width", "1080");
      upsertMeta("property", "og:image:height", "1080");
    } else {
      removeMeta("property", "og:image:width");
      removeMeta("property", "og:image:height");
    }
    if (ogType === "article" && seo.publishedTime) {
      upsertMeta("property", "article:published_time", seo.publishedTime);
    } else {
      removeMeta("property", "article:published_time");
    }
    if (ogType === "article" && seo.modifiedTime) {
      upsertMeta("property", "article:modified_time", seo.modifiedTime);
    } else {
      removeMeta("property", "article:modified_time");
    }

    const json = JSON.stringify(seo.jsonLd).replace(/</g, "\\u003c");
    let script = document.getElementById("seo-jsonld");
    if (!script) {
      script = document.createElement("script");
      script.id = "seo-jsonld";
      script.setAttribute("type", "application/ld+json");
      document.head.appendChild(script);
    }
    script.textContent = json;
  }, [location]);

  return null;
}

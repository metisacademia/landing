import fs from "node:fs";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { includeContentDrafts, isHeldBackArticleSource } from "./scripts/content-drafts";

function stripDraftArticles(includeDrafts: boolean): Plugin {
  return {
    name: "strip-draft-articles",
    enforce: "pre",
    load(id) {
      if (includeDrafts) return null;
      const [filename, query = ""] = id.split("?");
      const normalized = filename.replace(/\\/g, "/");
      if (!normalized.endsWith(".md") || !normalized.includes("/content/artigos/")) return null;
      if (!query.includes("raw")) return null;
      const source = fs.readFileSync(filename, "utf8");
      if (!isHeldBackArticleSource(source)) return null;
      const stub = "---\ndraft: true\n---\n";
      return `export default ${JSON.stringify(stub)};`;
    },
  };
}

export default defineConfig(async ({ mode }) => {
  const includeDrafts = includeContentDrafts(mode);
  return {
    define: {
      __INCLUDE_CONTENT_DRAFTS__: JSON.stringify(includeDrafts),
    },
    plugins: [
      stripDraftArticles(includeDrafts),
      react(),
      runtimeErrorOverlay(),
      ...(process.env.NODE_ENV !== "production" &&
      process.env.REPL_ID !== undefined
        ? [
            await import("@replit/vite-plugin-cartographer").then((m) =>
              m.cartographer(),
            ),
            await import("@replit/vite-plugin-dev-banner").then((m) =>
              m.devBanner(),
            ),
          ]
        : []),
    ],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
    },
    root: path.resolve(import.meta.dirname, "client"),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});

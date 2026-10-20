import fs from "node:fs";
import path from "node:path";
import { isPublishWeekday } from "../client/src/content/schedule";

function frontmatter(source: string): string | undefined {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match?.[1];
}

/** Avisa, sem falhar o build, quando duas datas coincidem ou o dia não é terça/quinta. */
export function warnArticleSchedule(artigosDir: string): void {
  const files = fs
    .readdirSync(artigosDir)
    .filter((file) => file.endsWith(".md"))
    .sort();
  const byDate = new Map<string, string[]>();

  for (const file of files) {
    const raw = fs.readFileSync(path.join(artigosDir, file), "utf8");
    const body = frontmatter(raw);
    if (!body || /^draft:\s*true\s*$/m.test(body)) continue;
    const date = body.match(/^date:\s*["']?(\d{4}-\d{2}-\d{2})["']?\s*$/m)?.[1];
    if (!date) continue;
    const names = byDate.get(date) ?? [];
    names.push(file);
    byDate.set(date, names);
    if (!isPublishWeekday(date)) {
      console.warn(`aviso: ${file} publica em ${date}, que não é terça nem quinta (America/Recife).`);
    }
  }

  for (const [date, names] of byDate) {
    if (names.length < 2) continue;
    console.warn(`aviso: ${names.join(", ")} usam a mesma data ${date}.`);
  }
}

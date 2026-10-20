import fs from "node:fs";
import path from "node:path";

const artigosDir = path.resolve("client/content/artigos");

function recifeToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Recife",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function shiftDays(isoDate, days) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function weekday(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 15)).getUTCDay();
}

/** Terça ou quinta anterior, para republicar se o cron da véspera falhou. */
function previousPublishDay(today) {
  for (let back = 1; back <= 6; back += 1) {
    const candidate = shiftDays(today, -back);
    const day = weekday(candidate);
    if (day === 2 || day === 4) return candidate;
  }
  return shiftDays(today, -6);
}

function publishDate(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match?.[1] || /^draft:\s*true\s*$/m.test(match[1])) return undefined;
  return match[1].match(/^date:\s*["']?(\d{4}-\d{2}-\d{2})["']?\s*$/m)?.[1];
}

const today = recifeToday();
const from = previousPublishDay(today);
const due = [];

if (fs.existsSync(artigosDir)) {
  for (const file of fs.readdirSync(artigosDir)) {
    if (!file.endsWith(".md")) continue;
    const date = publishDate(fs.readFileSync(path.join(artigosDir, file), "utf8"));
    if (date && date >= from && date <= today) due.push(`${file} (${date})`);
  }
}

if (due.length === 0) {
  console.log(`Nenhum artigo para publicar entre ${from} e ${today} (America/Recife).`);
} else {
  console.log(`Artigos na janela ${from}..${today}: ${due.join(", ")}`);
}

const force = process.env.FORCE_PUBLISH === "true";
const shouldDeploy = force || due.length > 0;
if (force && due.length === 0) {
  console.log("Disparo manual: o deploy segue mesmo sem artigo na janela.");
}

if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `due=${shouldDeploy}\n`);
}

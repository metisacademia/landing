/** Publicação de Conteúdos no horário de Recife, que não tem horário de verão. */
export const PUBLISH_TIME_ZONE = "America/Recife";

export function recifeToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: PUBLISH_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** A data do frontmatter ainda não chegou no calendário de Recife. */
export function isFuturePublishDate(isoDate: string, now: Date = new Date()): boolean {
  return isoDate > recifeToday(now);
}

/** 0 = domingo … 2 = terça, 4 = quinta. Meio-dia em Recife, para não mudar o dia. */
export function recifeWeekday(isoDate: string): number {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 15)).getUTCDay();
}

export function isPublishWeekday(isoDate: string): boolean {
  const weekday = recifeWeekday(isoDate);
  return weekday === 2 || weekday === 4;
}

export function formatScheduledBadge(isoDate: string): string {
  const [, month, day] = isoDate.split("-");
  if (!month || !day) return `Agendado para ${isoDate}`;
  return `Agendado para ${day}/${month}`;
}

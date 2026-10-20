import { PHONE_E164 } from "@/lib/site";

export function whatsappHref(message: string): string {
  return `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(message)}`;
}

export function trackWhatsAppClick(position: string): void {
  if (typeof window === "undefined") return;
  const page = window.location.pathname || "/";
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "whatsapp_click",
    page,
    position,
    click_source: position,
  });
}

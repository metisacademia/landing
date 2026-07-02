/* Métis — Exposição "Mãos que contam histórias"
   JavaScript mínimo e robusto. O site funciona 100% sem ele;
   estes toques apenas melhoram a experiência quando disponível. */
(function () {
  "use strict";

  // Rolagem suave para âncoras internas, respeitando quem prefere menos movimento.
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("click", function (e) {
    var link = e.target.closest && e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute("href");
    if (id.length < 2) return;
    var target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    if (typeof target.focus === "function") {
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
  });

  // Controles simples dos carrosséis: sem dependências e com fallback por rolagem.
  document.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest("[data-gallery-prev], [data-gallery-next]");
    if (!btn) return;
    var panel = btn.closest(".panel--gallery");
    var strip = panel && panel.querySelector("[data-gallery]");
    if (!strip) return;
    var dir = btn.hasAttribute("data-gallery-prev") ? -1 : 1;
    var amount = Math.max(240, Math.round(strip.clientWidth * 0.82));
    strip.scrollBy({ left: dir * amount, behavior: reduce ? "auto" : "smooth" });
  });
})();

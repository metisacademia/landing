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
})();

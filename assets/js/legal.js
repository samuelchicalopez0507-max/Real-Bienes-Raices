/* REAL Bienes Raíces — página de información legal.
   Los datos del responsable van fijos en el HTML a propósito: son el
   contenido que da validez a la página y no deben depender del JS.
   Aquí solo queda la interacción. */
(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- WhatsApp ---------- */
  const WA = waLink("Hola, REAL Bienes Raíces. Tengo una consulta sobre el manejo de mis datos personales.");
  ["header-wa", "mobile-wa", "wa-float"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.href = WA;
  });

  /* ---------- Pie ---------- */
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();

  const up = $("#legal-updated");
  if (up)
    up.textContent =
      "Última actualización: " +
      new Date().toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });

  /* ---------- Menú móvil ---------- */
  const burger = $("#burger"), mobileMenu = $("#mobile-menu");
  if (burger && mobileMenu) {
    burger.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
    $$("#mobile-menu a").forEach((a) =>
      a.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        burger.classList.remove("open");
        document.body.style.overflow = "";
      })
    );
  }

  const top = $("#to-top");
  if (top) top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
})();

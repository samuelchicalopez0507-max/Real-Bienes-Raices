/* REAL Bienes Raíces — página de información legal.
   Los datos del responsable salen de LEGAL y CONTACT en data.js,
   para que existan en un solo lugar. */
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

  /* ---------- Identificación del responsable ---------- */
  const filas = [
    ["Razón social", LEGAL.razonSocial],
    ["NIT", LEGAL.nit],
    ["Responsable del tratamiento", LEGAL.responsable],
    ["Dirección", LEGAL.direccion],
    ["Correo electrónico", `<a href="mailto:${CONTACT.email}">${CONTACT.email}</a>`],
    ["Teléfono / WhatsApp", `<a href="tel:+${CONTACT.whatsapp}">${CONTACT.phones[0]}</a>`],
    ["Horario de atención", CONTACT.hours.map(([d, h]) => `${d}: ${h}`).join("<br>")],
  ];

  const idEl = $("#legal-id");
  if (idEl)
    idEl.innerHTML =
      `<h2>Datos del responsable</h2><dl>` +
      filas.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("") +
      `</dl>`;

  /* La misma tabla dentro del apartado 1.1 */
  const respEl = $("#legal-resp");
  if (respEl)
    respEl.innerHTML = filas
      .slice(0, 6)
      .map(([k, v]) => `<li><strong>${k}:</strong> ${v}</li>`)
      .join("");

  /* ---------- Pie ---------- */
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
  const fl = $("#footer-legal");
  if (fl) fl.textContent = `${LEGAL.razonSocial} · NIT ${LEGAL.nit}`;

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

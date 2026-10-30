/* ============================================================
   REAL Bienes Raíces — Gestor de consentimiento de cookies

   No es un aviso decorativo: ninguna cookie ni script no esencial
   se activa antes de que la persona lo autorice.

   - El consentimiento se guarda en una cookie propia (real_consent).
   - Tres categorías: necesarias (siempre), analíticas y marketing.
   - Nada viene premarcado y rechazar cuesta un solo clic, igual que
     aceptar: lo exige el principio de consentimiento libre.
   - Se puede cambiar de opinión en cualquier momento desde el pie.
   - Si hay herramientas de analítica configuradas, solo se cargan
     cuando la categoría correspondiente está autorizada, usando el
     Consent Mode v2 de Google.
   ============================================================ */
(() => {
  "use strict";

  const COOKIE = "real_consent";
  const VERSION = 1;          // si cambian las categorías, se vuelve a preguntar
  const DIAS = 180;           // el consentimiento caduca a los 6 meses

  /* Identificadores de analítica. Mientras estén vacíos no se carga nada.
     Para activar Google Analytics basta poner aquí el ID (G-XXXXXXXXXX). */
  const GA_ID = "";

  const CATEGORIAS = [
    {
      id: "necesarias",
      titulo: "Necesarias",
      fija: true,
      texto:
        "Imprescindibles para que el sitio funcione. Guardan tu decisión sobre " +
        "cookies y los inmuebles que marcas como favoritos. No identifican a " +
        "nadie ni salen de tu dispositivo.",
    },
    {
      id: "analiticas",
      titulo: "Analíticas",
      texto:
        "Nos permiten saber cuántas personas visitan el sitio y qué inmuebles " +
        "miran más, para mejorar el portafolio. La información se trata de forma " +
        "agregada. Hoy no hay ninguna herramienta de analítica instalada: si se " +
        "instala, solo funcionará si autorizas esta categoría.",
    },
    {
      id: "marketing",
      titulo: "Marketing",
      texto:
        "Permitirían medir el resultado de la publicidad y mostrarte anuncios " +
        "relacionados con lo que viste. Hoy no hay ninguna herramienta de este " +
        "tipo instalada y no se activará sin tu autorización.",
    },
  ];

  /* ---------- Cookie ---------- */
  const leerCookie = (nombre) => {
    const m = document.cookie.match(new RegExp("(?:^|; )" + nombre + "=([^;]*)"));
    return m ? decodeURIComponent(m[1]) : null;
  };
  const escribirCookie = (nombre, valor, dias) => {
    const exp = new Date(Date.now() + dias * 864e5).toUTCString();
    const seguro = location.protocol === "https:" ? "; Secure" : "";
    document.cookie =
      `${nombre}=${encodeURIComponent(valor)}; expires=${exp}; path=/; SameSite=Lax${seguro}`;
  };
  const borrarCookie = (nombre) => {
    document.cookie = `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  };

  const leerConsentimiento = () => {
    try {
      const c = JSON.parse(leerCookie(COOKIE) || "null");
      if (!c || c.v !== VERSION) return null;
      return c;
    } catch { return null; }
  };

  /* ---------- Consent Mode v2 ----------
     Se declara el estado "denegado" antes de que exista cualquier etiqueta,
     para que nada se dispare mientras la persona decide. */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  const estadoConsentMode = (c) => ({
    ad_storage: c && c.marketing ? "granted" : "denied",
    ad_user_data: c && c.marketing ? "granted" : "denied",
    ad_personalization: c && c.marketing ? "granted" : "denied",
    analytics_storage: c && c.analiticas ? "granted" : "denied",
    functionality_storage: "granted",
    security_storage: "granted",
  });

  const guardado = leerConsentimiento();
  gtag("consent", "default", { ...estadoConsentMode(null), wait_for_update: 500 });
  if (guardado) gtag("consent", "update", estadoConsentMode(guardado));

  /* ---------- Carga de herramientas, solo con permiso ---------- */
  let gaCargado = false;
  const activarHerramientas = (c) => {
    if (c.analiticas && GA_ID && !gaCargado) {
      gaCargado = true;
      const sc = document.createElement("script");
      sc.async = true;
      sc.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(sc);
      gtag("js", new Date());
      gtag("config", GA_ID, { anonymize_ip: true });
    }
  };

  /* Si se revoca la analítica, se borran las cookies que haya dejado Google. */
  const limpiarAnaliticas = () => {
    document.cookie.split(";").forEach((par) => {
      const n = par.split("=")[0].trim();
      if (/^_ga|^_gid|^_gat/.test(n)) {
        borrarCookie(n);
        document.cookie = `${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${location.hostname}`;
      }
    });
  };

  /* ---------- Guardar la decisión ---------- */
  const guardar = (eleccion) => {
    const c = {
      v: VERSION,
      fecha: new Date().toISOString(),
      necesarias: true,
      analiticas: !!eleccion.analiticas,
      marketing: !!eleccion.marketing,
    };
    escribirCookie(COOKIE, JSON.stringify(c), DIAS);
    gtag("consent", "update", estadoConsentMode(c));
    if (c.analiticas) activarHerramientas(c);
    else limpiarAnaliticas();
    cerrarTodo();
    return c;
  };

  /* ---------- Interfaz ---------- */
  const $ = (s, c = document) => c.querySelector(s);

  const cerrarTodo = () => {
    const b = $("#ck-banner"), m = $("#ck-modal");
    if (b) b.remove();
    if (m) { m.remove(); document.body.style.overflow = ""; }
  };

  const plantillaBanner = () => `
    <div class="ck-banner" id="ck-banner" role="dialog" aria-live="polite"
         aria-label="Aviso de cookies">
      <div class="ck-banner-in">
        <div class="ck-txt">
          <h2>Tu privacidad</h2>
          <p>Usamos cookies necesarias para que el sitio funcione. Nos gustaría
             usar también cookies analíticas y de marketing, pero solo si tú lo
             autorizas. Puedes cambiar tu decisión cuando quieras.
             <a href="legal.html#cookies">Más información</a>.</p>
        </div>
        <div class="ck-btns">
          <button type="button" class="ck-b ck-ghost" data-ck="config">Configurar</button>
          <button type="button" class="ck-b ck-sec" data-ck="rechazar">Rechazar todas</button>
          <button type="button" class="ck-b ck-pri" data-ck="aceptar">Aceptar todas</button>
        </div>
      </div>
    </div>`;

  const plantillaModal = (c) => `
    <div class="ck-modal" id="ck-modal" role="dialog" aria-modal="true" aria-labelledby="ck-ttl">
      <div class="ck-card">
        <div class="ck-head">
          <h2 id="ck-ttl">Preferencias de cookies</h2>
          <button type="button" class="ck-x" data-ck="cerrar" aria-label="Cerrar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="ck-body">
          ${CATEGORIAS.map((cat) => `
            <div class="ck-cat">
              <div class="ck-cat-top">
                <h3>${cat.titulo}</h3>
                ${cat.fija
                  ? `<span class="ck-fija">Siempre activas</span>`
                  : `<label class="ck-sw">
                       <input type="checkbox" data-cat="${cat.id}" ${c && c[cat.id] ? "checked" : ""} />
                       <span class="ck-sl" aria-hidden="true"></span>
                       <span class="ck-sr">${cat.titulo}</span>
                     </label>`}
              </div>
              <p>${cat.texto}</p>
            </div>`).join("")}
          <p class="ck-legal">
            Detalle completo en la <a href="legal.html#cookies">política de cookies</a>
            y en la <a href="legal.html#privacidad">política de privacidad</a>.
          </p>
        </div>
        <div class="ck-foot">
          <button type="button" class="ck-b ck-sec" data-ck="rechazar">Rechazar todas</button>
          <button type="button" class="ck-b ck-pri" data-ck="guardar">Guardar mis preferencias</button>
        </div>
      </div>
    </div>`;

  const abrirModal = () => {
    cerrarTodo();
    document.body.insertAdjacentHTML("beforeend", plantillaModal(leerConsentimiento()));
    document.body.style.overflow = "hidden";
    $("#ck-modal").addEventListener("click", (e) => {
      if (e.target.id !== "ck-modal") return;
      cerrarTodo();
      if (!leerConsentimiento()) mostrarBanner();
    });
  };

  const mostrarBanner = () => {
    if ($("#ck-banner")) return;
    document.body.insertAdjacentHTML("beforeend", plantillaBanner());
  };

  /* Un solo manejador para todos los botones */
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-ck]");
    if (!b) return;
    const acc = b.dataset.ck;
    if (acc === "aceptar") guardar({ analiticas: true, marketing: true });
    else if (acc === "rechazar") guardar({ analiticas: false, marketing: false });
    else if (acc === "config") abrirModal();
    else if (acc === "cerrar") {
      /* Si cierra el panel sin elegir y todavia no hay consentimiento guardado,
         el aviso vuelve: no puede quedarse sin forma de decidir. */
      cerrarTodo();
      if (!leerConsentimiento()) mostrarBanner();
    }
    else if (acc === "guardar") {
      const sel = {};
      document.querySelectorAll("#ck-modal [data-cat]").forEach((i) => (sel[i.dataset.cat] = i.checked));
      guardar(sel);
    } else if (acc === "abrir") { e.preventDefault(); abrirModal(); }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || !$("#ck-modal")) return;
    cerrarTodo();
    if (!leerConsentimiento()) mostrarBanner();
  });

  /* ---------- Arranque ---------- */
  if (guardado) activarHerramientas(guardado);
  else if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", mostrarBanner);
  else mostrarBanner();

  /* API pública, para el enlace del pie */
  window.REALCookies = {
    abrirPreferencias: abrirModal,
    estado: leerConsentimiento,
    revocar: () => { borrarCookie(COOKIE); limpiarAnaliticas(); location.reload(); },
  };
})();

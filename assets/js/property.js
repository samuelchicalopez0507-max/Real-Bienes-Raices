/* REAL Bienes Raíces — página individual del inmueble */
(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const params = new URLSearchParams(location.search);
  const prop = PROPERTIES.find((p) => p.id === params.get("id")) || PROPERTIES[0];

  /* ---------- WhatsApp ---------- */
  const WA_PROP = propWaLink(prop);
  const WA_VISIT = waLink(
    `Hola, REAL Bienes Raíces. Quiero agendar una visita a "${prop.title}" (${priceLabel(prop)}). ${prop.link}`
  );
  ["header-wa", "mobile-wa", "footer-wa", "wa-float"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.href = WA_PROP;
  });

  /* ---------- SEO dinámico ---------- */
  const areaMain = prop.type === "Lote" ? (prop.areaLote || prop.area) : prop.area;
  document.title = `${prop.title} — ${priceLabel(prop)} | REAL Bienes Raíces`;
  const desc = `${prop.type} en ${prop.operation === "arriendo" ? "arriendo" : "venta"}, ${prop.city}, Antioquia. ` +
    (areaMain ? `${areaMain} m²` : "") +
    (prop.rooms ? `, ${prop.rooms} alcobas` : "") +
    (prop.baths ? `, ${prop.baths} baños` : "") +
    `. ${priceLabel(prop)}. REAL Bienes Raíces.`;
  $('meta[name="description"]').setAttribute("content", desc);
  const og = (p, v) => {
    const m = document.createElement("meta");
    m.setAttribute("property", p); m.setAttribute("content", v);
    document.head.appendChild(m);
  };
  og("og:type", "article");
  og("og:title", document.title);
  og("og:description", desc);
  og("og:image", imgSrc(prop, prop.cover));
  const ld = document.createElement("script");
  ld.type = "application/ld+json";
  ld.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: prop.title,
    url: location.href,
    image: imgSrc(prop, prop.cover),
    offers: prop.price != null ? { "@type": "Offer", price: prop.price, priceCurrency: "COP" } : undefined,
    address: { "@type": "PostalAddress", addressLocality: prop.city, addressRegion: "Antioquia", addressCountry: "CO" },
  });
  document.head.appendChild(ld);

  /* ---------- Iconos ---------- */
  const I = {
    area: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8V5a2 2 0 0 1 2-2h3"/><path d="M16 3h3a2 2 0 0 1 2 2v3"/><path d="M21 16v3a2 2 0 0 1-2 2h-3"/><path d="M8 21H5a2 2 0 0 1-2-2v-3"/></svg>',
    bed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9V4"/><path d="M2 17v3"/><path d="M2 13h20v7"/><path d="M22 13v-2a3 3 0 0 0-3-3h-9v5"/><circle cx="6" cy="10" r="1.6"/></svg>',
    bath: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12V5a2 2 0 0 1 2-2h1.5"/><path d="M2 12h20"/><path d="M4 12v3a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-3"/><path d="M8 21v-2"/><path d="M16 21v-2"/></svg>',
    car: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 11 6.5 6.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11"/><path d="M4 11h16a1 1 0 0 1 1 1v5h-2"/><path d="M3 17v-5a1 1 0 0 1 1-1"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M9 17h6"/></svg>',
    layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.05 0C5.5 0 .16 5.33.16 11.9c0 2.1.55 4.14 1.6 5.95L.05 24l6.3-1.65a11.9 11.9 0 0 0 5.7 1.45c6.55 0 11.9-5.33 11.9-11.9 0-3.18-1.24-6.16-3.45-8.4ZM12.05 21.8c-1.78 0-3.52-.48-5.04-1.38l-.36-.21-3.74.98 1-3.64-.24-.38a9.86 9.86 0 0 1-1.51-5.27c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.46-4.44 9.89-9.89 9.89Z"/></svg>',
    cam: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="3"/></svg>',
    fb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7h2.4l.5-3h-2.9V9.1c0-.9.3-1.6 1.6-1.6h1.4V4.8c-.7-.1-1.5-.2-2.3-.2-2.4 0-4 1.4-4 4V11H8v3h2.2v7h3.3Z"/></svg>',
    in: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.5 8.5H3.6V21h2.9V8.5ZM5 7.2a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4ZM21 14.1c0-3.3-1.8-4.9-4.1-4.9-1.9 0-2.7 1-3.2 1.8V8.5H10.8V21h2.9v-6.5c0-1.7.9-2.6 2.2-2.6 1.2 0 2.1.8 2.1 2.6V21H21v-6.9Z"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.5-1.4 3-3.1 3-5.4A5.4 5.4 0 0 0 16.5 3c-1.8 0-3.4.9-4.5 2.3A5.9 5.9 0 0 0 7.5 3 5.4 5.4 0 0 0 2 8.6C2 11 3.5 12.6 5 14l7 7Z"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  };

  const loc = prop.sector ? `${prop.sector}, ${prop.city}` : `${prop.city}, Antioquia`;
  const isLandLike = prop.type === "Lote";
  const priceHeading = prop.operation === "arriendo" ? "Canon de arriendo" : "Precio de venta";

  /* ---------- Especificaciones (solo datos reales) ---------- */
  const specs = [
    prop.area != null && { i: I.area, v: `${prop.area} m²`, l: isLandLike ? "Área lote" : "Área construida" },
    (prop.areaLote != null && prop.areaLote !== prop.area) && { i: I.layers, v: `${prop.areaLote} m²`, l: "Área lote/terreno" },
    prop.rooms != null && { i: I.bed, v: prop.rooms, l: "Alcobas" },
    prop.baths != null && { i: I.bath, v: prop.baths, l: "Baños" },
    prop.garages != null && { i: I.car, v: prop.garages, l: prop.garages === 1 ? "Garaje" : "Garajes" },
    prop.estrato != null && { i: I.layers, v: prop.estrato, l: "Estrato" },
    prop.year != null && { i: I.cal, v: prop.year, l: "Año" },
    { i: I.pin, v: prop.city, l: "Municipio" },
  ].filter(Boolean);

  const heroMeta = [
    `<span>${I.pin}${loc}</span>`,
    prop.area != null ? `<span>${I.area}${prop.area} m²${isLandLike ? " lote" : ""}</span>` : "",
    prop.rooms != null ? `<span>${I.bed}${prop.rooms} alcobas</span>` : "",
    prop.baths != null ? `<span>${I.bath}${prop.baths} baños</span>` : "",
  ].join("");

  /* ---------- Descripción y distribución ---------- */
  let descHtml = "";
  if (prop.desc) {
    const d = prop.desc
      .replace(/\s*(Distribuci[oó]n\s*:|Primer nivel\s*:|Segundo nivel\s*:|Tercer nivel\s*:|Zona social\s*:|Zona privada\s*:|Amenidades\s*:|La unidad cuenta con|Cuenta con)/gi,
        (m) => `\n\n<strong>${m.trim().replace(/:$/, "")}</strong>\n`);
    const paras = d.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);
    descHtml = `
      <div class="sec-head rv" style="margin:56px 0 24px"><span class="kicker">Descripción</span><h2>Sobre esta propiedad</h2></div>
      <div class="desc-block rv">${paras.map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("")}</div>`;
  }

  /* ---------- Características internas / externas ---------- */
  const featBlock = (title, items) => {
    if (!items || !items.length) return "";
    return `<div class="feat-col">
      <h4>${title}</h4>
      <ul class="feat-list">${items.map((f) => `<li>${I.check}${f}</li>`).join("")}</ul>
    </div>`;
  };
  let featHtml = "";
  if ((prop.internas && prop.internas.length) || (prop.externas && prop.externas.length)) {
    featHtml = `
      <div class="sec-head rv" style="margin:56px 0 24px"><span class="kicker">Características</span><h2>Lo que ofrece</h2></div>
      <div class="feat-grid rv">
        ${featBlock("Interiores", prop.internas)}
        ${featBlock("Exteriores y zonas comunes", prop.externas)}
      </div>`;
  }

  /* ---------- Galería (orden curado: mejores primero) ---------- */
  const photos = prop.order && prop.order.length ? prop.order.slice() : Array.from({ length: prop.photos }, (_, k) => k + 1);
  const MAX_GRID = 11;
  const gridPhotos = photos.slice(0, MAX_GRID);
  const rest = prop.photos - MAX_GRID;

  const galleryHtml = gridPhotos
    .map((n, k) => {
      const more = k === MAX_GRID - 1 && rest > 0 ? `<span class="g-more">+${rest} fotos</span>` : "";
      return `<button class="g-item" data-idx="${k}" aria-label="Ver fotografía ${n} en pantalla completa">
        <img src="${imgSrc(prop, n, true)}" alt="${prop.title} — fotografía ${n}" loading="lazy" />${more}
      </button>`;
    })
    .join("");

  /* ---------- Similares: mismo tipo y precio cercano; respaldo por municipio ---------- */
  const priceDist = (p) => (p.price == null || prop.price == null) ? 9e14 : Math.abs(p.price - prop.price);
  let similar = PROPERTIES.filter((p) => p.id !== prop.id && p.type === prop.type)
    .sort((a, b) => priceDist(a) - priceDist(b)).slice(0, 3);
  if (similar.length < 3) {
    const extra = PROPERTIES.filter((p) => p.id !== prop.id && !similar.includes(p) && p.city === prop.city)
      .sort((a, b) => priceDist(a) - priceDist(b));
    similar = similar.concat(extra).slice(0, 3);
  }

  const simArea = (p) => (p.type === "Lote" ? (p.areaLote || p.area) : p.area);
  const simCard = (p) => `
    <article class="prop-card">
      <a class="prop-media" href="propiedad.html?id=${p.id}" aria-label="Ver ${p.title}">
        <div class="car-track"><div style="background-image:url('${coverSrc(p)}')"></div></div>
        <div class="prop-tags">${p.tags.slice(0, 2).map((t, k) => `<span class="${k === 0 ? "hot" : ""}">${t}</span>`).join("")}</div>
        <span class="prop-type-badge">${p.type}</span>
      </a>
      <div class="prop-body">
        <div class="prop-price">${priceLabel(p)}</div>
        <h3 class="prop-title">${p.title}</h3>
        <div class="prop-loc">${I.pin}${p.city}, Antioquia</div>
        <div class="prop-specs">
          ${simArea(p) != null ? `<span>${I.area}<b>${simArea(p)}</b>&nbsp;m²</span>` : ""}
          ${p.rooms != null ? `<span>${I.bed}<b>${p.rooms}</b>&nbsp;Alc.</span>` : ""}
          ${p.baths != null ? `<span>${I.bath}<b>${p.baths}</b>&nbsp;Bañ.</span>` : ""}
        </div>
        <div class="prop-actions">
          <a class="btn btn-teal" href="propiedad.html?id=${p.id}">Ver Propiedad</a>
        </div>
      </div>
    </article>`;

  /* ---------- Render ---------- */
  $("#prop-main").innerHTML = `
  <section class="p-hero">
    <div class="bg" style="background-image:url('${imgSrc(prop, prop.cover)}')"></div>
    <div class="p-hero-content">
      <div>
        <div class="crumbs rv rv-in"><a href="index.html">Inicio</a> · <a href="index.html#propiedades">Propiedades</a> · ${prop.city}</div>
        <h1>${prop.title}</h1>
        <div class="meta">${heroMeta}</div>
      </div>
      <div class="price-tag">
        <div class="l">${priceHeading}</div>
        <div class="v">${priceLabel(prop)}</div>
        <div class="btns">
          <a class="btn btn-magenta btn-sm" href="${WA_PROP}" target="_blank" rel="noopener">${I.wa} WhatsApp</a>
          <a class="btn btn-ghost btn-sm" href="${WA_VISIT}" target="_blank" rel="noopener">${I.cal} Agendar Visita</a>
        </div>
      </div>
    </div>
  </section>

  <section class="section tight" aria-label="Galería de fotografías">
    <div class="container">
      <div class="sec-head rv">
        <span class="kicker">Recorrido visual</span>
        <h2>Galería de la propiedad</h2>
        <p>${prop.photos} fotografías oficiales. Haz clic en cualquiera para verla en pantalla completa.</p>
      </div>
      <div class="gallery-grid rv">${galleryHtml}</div>
    </div>
  </section>

  <section class="section tight" aria-label="Información del inmueble">
    <div class="container">
      <div class="p-layout">
        <div>
          <div class="sec-head rv">
            <span class="kicker">Detalles</span>
            <h2>Información del inmueble</h2>
          </div>
          <div class="spec-cards rv">
            ${specs.map((s) => `<div class="spec-card">${s.i}<div class="v">${s.v}</div><div class="l">${s.l}</div></div>`).join("")}
          </div>

          ${descHtml}
          ${featHtml}

          <div class="video-slot rv" style="margin-top:56px">
            ${I.cam}
            <p style="margin:0;font-weight:600">Recorrido en video próximamente</p>
            <p style="margin:6px 0 0;font-size:14px">Estamos preparando un recorrido audiovisual de esta propiedad.</p>
          </div>
        </div>

        <aside class="p-side">
          <div class="side-card rv">
            <div class="price">${priceLabel(prop)}</div>
            <div class="stack">
              <a class="btn btn-magenta" href="${WA_PROP}" target="_blank" rel="noopener">${I.wa} Hablar por WhatsApp</a>
              <a class="btn btn-teal" href="${WA_VISIT}" target="_blank" rel="noopener">${I.cal} Agendar Visita</a>
              <button class="btn btn-outline" id="fav-btn" type="button">${I.heart} Guardar Favorito</button>
            </div>
            <div class="share-row">
              <a href="https://wa.me/?text=${encodeURIComponent(prop.title + " — " + fmtCOP(prop.price) + " COP · " + prop.link)}" target="_blank" rel="noopener" aria-label="Compartir por WhatsApp">${I.wa}</a>
              <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(prop.link)}" target="_blank" rel="noopener" aria-label="Compartir en Facebook">${I.fb}</a>
              <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(prop.link)}" target="_blank" rel="noopener" aria-label="Compartir en LinkedIn">${I.in}</a>
              <button type="button" id="copy-link" aria-label="Copiar enlace">${I.link}</button>
            </div>
          </div>

          <div class="side-card rv">
            <h3 style="font-size:19px;margin-bottom:4px">Solicitar información</h3>
            <p style="color:var(--ink-soft);font-size:14px;margin:0 0 20px">Un asesor te contactará muy pronto.</p>
            <form id="prop-form" novalidate>
              <div class="form-grid" style="grid-template-columns:1fr">
                <div class="fld"><label for="pf-name">Nombre</label><input id="pf-name" type="text" autocomplete="name" placeholder="Tu nombre" required /></div>
                <div class="fld"><label for="pf-phone">Teléfono</label><input id="pf-phone" type="tel" autocomplete="tel" placeholder="Tu número" required /></div>
                <div class="fld"><label for="pf-email">Correo</label><input id="pf-email" type="email" autocomplete="email" placeholder="tucorreo@ejemplo.com" required /></div>
                <div class="fld"><label for="pf-msg">Mensaje</label><textarea id="pf-msg" rows="3">Hola, me interesa esta propiedad y quiero más información.</textarea></div>
                <button type="submit" class="btn btn-magenta">Enviar por WhatsApp</button>
              </div>
              <p class="form-ok" id="pf-ok">✓ Tu mensaje se abrió en WhatsApp.</p>
            </form>
          </div>
        </aside>
      </div>
    </div>
  </section>

  <section class="section blush" aria-label="Propiedades similares">
    <div class="container">
      <div class="sec-head rv">
        <span class="kicker">Sigue explorando</span>
        <h2>Propiedades similares</h2>
      </div>
      <div class="prop-grid featured">${similar.map(simCard).join("")}</div>
    </div>
  </section>

  <section class="section tight" aria-label="Contactar asesor">
    <div class="container">
      <div class="cta-band rv" data-rv="scale">
        <div class="bg" style="background-image:url('${imgSrc(prop, prop.cover)}')" aria-hidden="true"></div>
        <h2>¿Quieres conocer esta propiedad?</h2>
        <p>Agenda una visita sin compromiso. Un asesor te acompañará durante todo el recorrido.</p>
        <a class="btn btn-magenta" href="${WA_VISIT}" target="_blank" rel="noopener">Agendar una Visita</a>
      </div>
    </div>
  </section>`;

  /* ---------- Header / menú ---------- */
  const header = $("#header");
  const onScroll = () => header.classList.toggle("solid", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  const burger = $("#burger"), mobileMenu = $("#mobile-menu");
  burger.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  });

  /* ---------- Reveal ---------- */
  const rvObs = new IntersectionObserver(
    (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("rv-in"); rvObs.unobserve(e.target); } }),
    { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
  );
  $$(".rv").forEach((el) => rvObs.observe(el));

  /* ---------- Lightbox ---------- */
  const lb = $("#lightbox"), lbImg = $("#lb-img"), lbCount = $("#lb-count");
  let cur = 0;
  const show = (k) => {
    cur = (k + prop.photos) % prop.photos;
    lbImg.src = imgSrc(prop, photos[cur]);
    lbImg.alt = `${prop.title} — fotografía ${cur + 1} de ${prop.photos}`;
    lbCount.textContent = `${cur + 1} / ${prop.photos}`;
    /* precarga vecinas */
    [cur + 1, cur - 1].forEach((j) => {
      const im = new Image();
      im.src = imgSrc(prop, photos[(j + prop.photos) % prop.photos]);
    });
  };
  const openLb = (k) => { show(k); lb.classList.add("open"); document.body.style.overflow = "hidden"; };
  const closeLb = () => { lb.classList.remove("open"); document.body.style.overflow = ""; };

  $$(".g-item").forEach((b) => b.addEventListener("click", () => openLb(+b.dataset.idx)));
  $("#lb-close").addEventListener("click", closeLb);
  $("#lb-prev").addEventListener("click", () => show(cur - 1));
  $("#lb-next").addEventListener("click", () => show(cur + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") show(cur - 1);
    if (e.key === "ArrowRight") show(cur + 1);
  });
  /* swipe en lightbox */
  let x0 = null;
  lb.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (x0 == null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1));
    x0 = null;
  }, { passive: true });

  /* ---------- Toast ---------- */
  const toast = $("#toast");
  let toastT = null;
  const notify = (msg) => {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove("show"), 2600);
  };

  /* copiar enlace */
  $("#copy-link").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(prop.link);
      notify("Enlace copiado ✓");
    } catch {
      notify(prop.link);
    }
  });

  /* favorito (estructura preparada, almacenamiento local) */
  const favKey = "real-favs";
  const favs = () => JSON.parse(localStorage.getItem(favKey) || "[]");
  const favBtn = $("#fav-btn");
  const paintFav = () => {
    const on = favs().includes(prop.id);
    favBtn.innerHTML = `${I.heart} ${on ? "Guardado en favoritos" : "Guardar Favorito"}`;
    favBtn.style.color = on ? "var(--magenta)" : "";
    favBtn.style.borderColor = on ? "var(--magenta)" : "";
  };
  favBtn.addEventListener("click", () => {
    let f = favs();
    f = f.includes(prop.id) ? f.filter((x) => x !== prop.id) : [...f, prop.id];
    localStorage.setItem(favKey, JSON.stringify(f));
    paintFav();
    notify(f.includes(prop.id) ? "Guardado en favoritos ♥" : "Eliminado de favoritos");
  });
  paintFav();

  /* formulario → WhatsApp */
  $("#prop-form").addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    ["pf-name", "pf-phone", "pf-email"].forEach((id) => {
      const el = document.getElementById(id);
      const bad = !el.value.trim() || (id === "pf-email" && !/^\S+@\S+\.\S+$/.test(el.value));
      el.classList.toggle("err", bad);
      if (bad) ok = false;
    });
    if (!ok) return;
    const msg =
      `Hola, REAL Bienes Raíces. Soy ${$("#pf-name").value.trim()}.\n` +
      `Me interesa: ${prop.title} (${fmtCOP(prop.price)} COP)\n${prop.link}\n` +
      `Teléfono: ${$("#pf-phone").value.trim()}\nCorreo: ${$("#pf-email").value.trim()}\n\n` +
      $("#pf-msg").value.trim();
    window.open(waLink(msg), "_blank", "noopener");
    $("#pf-ok").classList.add("show");
    setTimeout(() => $("#pf-ok").classList.remove("show"), 6000);
  });

  /* footer */
  $("#year").textContent = new Date().getFullYear();
  $("#to-top").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
})();

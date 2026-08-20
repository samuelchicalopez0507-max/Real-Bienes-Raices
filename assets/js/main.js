/* REAL Bienes Raíces — interacción de la página principal */
(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- WhatsApp genérico ---------- */
  const WA_DEFAULT = waLink(
    "Hola, REAL Bienes Raíces. Me gustaría hablar con un asesor."
  );
  ["header-wa", "mobile-wa", "hero-wa", "contact-wa", "footer-wa", "wa-float"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.href = WA_DEFAULT;
  });
  $$("[data-wa]").forEach((el) => (el.href = waLink(el.dataset.wa)));

  /* ---------- Header ---------- */
  const header = $("#header");
  const onScroll = () => header.classList.toggle("solid", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const burger = $("#burger");
  const mobileMenu = $("#mobile-menu");
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

  /* enlace activo según sección visible */
  const navLinks = $$(".nav a");
  const sections = navLinks
    .map((a) => a.getAttribute("href"))
    .filter((h) => h.startsWith("#"))
    .map((h) => $(h))
    .filter(Boolean);
  const navObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        navLinks.forEach((a) =>
          a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id)
        );
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => navObs.observe(s));

  /* ---------- Hero: slideshow cinematográfico con las mejores fachadas ---------- */
  const byId = (id) => PROPERTIES.find((p) => p.id === id);
  const HERO_SHOTS = [
    [byId("p35"), 1],  // casa campestre de lujo — drone
    [byId("p31"), 17], // Llanogrande — fachada moderna
    [byId("p36"), 25], // finca urbana — aérea + jardín
    [byId("p40"), 1],  // finca 6.060 m² — drone
    [byId("p24"), 9],  // casa con vista al paisaje
  ].filter(([p]) => p).map(([p, i]) => imgSrc(p, i));
  const heroBg = $("#hero-bg");
  HERO_SHOTS.forEach((src, i) => {
    const d = document.createElement("div");
    d.className = "slide" + (i === 0 ? " on" : "");
    d.style.backgroundImage = `url("${src}")`;
    heroBg.appendChild(d);
  });
  let heroIdx = 0;
  setInterval(() => {
    const slides = $$(".slide", heroBg);
    slides[heroIdx].classList.remove("on");
    heroIdx = (heroIdx + 1) % slides.length;
    slides[heroIdx].classList.add("on");
  }, 7000);

  /* parallax sutil */
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      if (y < window.innerHeight) heroBg.style.transform = `translateY(${y * 0.25}px)`;
    },
    { passive: true }
  );

  /* fondos de las bandas CTA (mejores exteriores) */
  const cta1 = $("#cta1-bg"), cta2 = $("#cta2-bg");
  if (cta1 && byId("p36")) cta1.style.backgroundImage = `url("${imgSrc(byId("p36"), 18)}")`;
  if (cta2 && byId("p35")) cta2.style.backgroundImage = `url("${imgSrc(byId("p35"), 2)}")`;

  /* ---------- Reveal on scroll ---------- */
  const rvObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("rv-in");
          rvObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  const watchRv = (root = document) => $$(".rv", root).forEach((el) => rvObs.observe(el));
  watchRv();

  /* ---------- Iconos ---------- */
  const I = {
    area: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8V5a2 2 0 0 1 2-2h3"/><path d="M16 3h3a2 2 0 0 1 2 2v3"/><path d="M21 16v3a2 2 0 0 1-2 2h-3"/><path d="M8 21H5a2 2 0 0 1-2-2v-3"/></svg>',
    bed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9V4"/><path d="M2 17v3"/><path d="M2 13h20v7"/><path d="M22 13v-2a3 3 0 0 0-3-3h-9v5"/><circle cx="6" cy="10" r="1.6"/></svg>',
    bath: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12V5a2 2 0 0 1 2-2h1.5"/><path d="M2 12h20"/><path d="M4 12v3a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-3"/><path d="M8 21v-2"/><path d="M16 21v-2"/></svg>',
    car: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 11 6.5 6.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11"/><path d="M4 11h16a1 1 0 0 1 1 1v5h-2"/><path d="M3 17v-5a1 1 0 0 1 1-1"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M9 17h6"/></svg>',
    layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.05 0C5.5 0 .16 5.33.16 11.9c0 2.1.55 4.14 1.6 5.95L.05 24l6.3-1.65a11.9 11.9 0 0 0 5.7 1.45c6.55 0 11.9-5.33 11.9-11.9 0-3.18-1.24-6.16-3.45-8.4ZM12.05 21.8c-1.78 0-3.52-.48-5.04-1.38l-.36-.21-3.74.98 1-3.64-.24-.38a9.86 9.86 0 0 1-1.51-5.27c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.46-4.44 9.89-9.89 9.89Z"/></svg>',
  };

  /* ---------- Tarjeta de propiedad ---------- */
  /* La tarjeta muestra las mejores fotos primero (según p.order curado). */
  const cardImages = (p, max = 6) => (p.order || [p.cover]).slice(0, max);

  const specHtml = (p, compact = false) => {
    const items = [];
    const areaMain = p.type === "Lote" ? (p.areaLote || p.area) : p.area;
    if (areaMain != null) items.push(`<span>${I.area}<b>${areaMain}</b>&nbsp;m²</span>`);
    if (p.rooms != null) items.push(`<span>${I.bed}<b>${p.rooms}</b>&nbsp;Alc.</span>`);
    if (p.baths != null) items.push(`<span>${I.bath}<b>${p.baths}</b>&nbsp;Bañ.</span>`);
    if (p.garages != null) items.push(`<span>${I.car}<b>${p.garages}</b>&nbsp;Gar.</span>`);
    if (!compact && p.estrato != null) items.push(`<span>${I.layers}<b>E${p.estrato}</b></span>`);
    return items.join("");
  };

  const cardHtml = (p) => {
    const imgs = cardImages(p);
    const slides = imgs
      .map(
        (i, k) =>
          `<div ${k === 0 ? `style="background-image:url('${imgSrc(p, i, true)}')"` : `data-bg="${imgSrc(p, i, true)}"`}></div>`
      )
      .join("");
    const dots = imgs.map((_, k) => `<i class="${k === 0 ? "on" : ""}"></i>`).join("");
    const tags = p.tags
      .slice(0, 2)
      .map((t, k) => `<span class="${k === 0 ? "hot" : ""}">${t}</span>`)
      .join("");
    const loc = p.sector ? `${p.sector}, ${p.city}` : `${p.city}, Antioquia`;
    return `
    <article class="prop-card" data-id="${p.id}">
      <a class="prop-media" href="propiedad.html?id=${p.id}" aria-label="Ver ${p.title}">
        <div class="car-track">${slides}</div>
        <div class="prop-tags">${tags}</div>
        <span class="prop-type-badge">${p.type}</span>
        <button class="car-btn prev" type="button" aria-label="Foto anterior">${I.left}</button>
        <button class="car-btn next" type="button" aria-label="Foto siguiente">${I.right}</button>
        <div class="car-dots">${dots}</div>
      </a>
      <div class="prop-body">
        <div class="prop-price">${priceLabel(p)}</div>
        <h3 class="prop-title">${p.title}</h3>
        <div class="prop-loc">${I.pin}${loc}</div>
        <div class="prop-specs">${specHtml(p)}</div>
        <div class="prop-actions">
          <a class="btn btn-teal" href="propiedad.html?id=${p.id}">Ver Propiedad</a>
          <a class="btn btn-outline" href="${propWaLink(p)}" target="_blank" rel="noopener">Solicitar Info</a>
        </div>
      </div>
    </article>`;
  };

  /* carrusel de tarjeta */
  const initCarousel = (card) => {
    const track = $(".car-track", card);
    const dots = $$(".car-dots i", card);
    const n = dots.length;
    let idx = 0, timer = null;

    const lazyLoad = (k) => {
      const s = track.children[k];
      if (s && s.dataset.bg) {
        s.style.backgroundImage = `url('${s.dataset.bg}')`;
        delete s.dataset.bg;
      }
    };
    const go = (k) => {
      idx = (k + n) % n;
      lazyLoad(idx); lazyLoad((idx + 1) % n);
      track.style.transform = `translateX(-${idx * 100}%)`;
      dots.forEach((d, j) => d.classList.toggle("on", j === idx));
    };
    const play = () => { stop(); timer = setInterval(() => go(idx + 1), 5200); };
    const stop = () => timer && clearInterval(timer);

    $(".car-btn.prev", card).addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); go(idx - 1); play(); });
    $(".car-btn.next", card).addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); go(idx + 1); play(); });

    /* swipe */
    let x0 = null;
    track.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
    track.addEventListener("touchend", (e) => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) { go(idx + (dx < 0 ? 1 : -1)); play(); }
      x0 = null;
    }, { passive: true });

    /* autoplay solo cuando es visible */
    new IntersectionObserver(
      (es) => es.forEach((e) => (e.isIntersecting ? play() : stop())),
      { threshold: 0.3 }
    ).observe(card);
  };

  const renderCards = (host, list) => {
    host.innerHTML = list.map(cardHtml).join("");
    $$(".prop-card", host).forEach(initCarousel);
  };

  /* destacadas */
  renderCards($("#featured-grid"), PROPERTIES.filter((p) => p.featured));

  /* ---------- Catálogo + filtros + buscador ---------- */
  const catalog = $("#catalog-grid");
  const count = $("#results-count");
  const noRes = $("#no-results");
  const search = $("#search");
  const searchClear = $("#search-clear");
  const loadMore = $("#load-more");
  const PAGE = 12;
  let shown = PAGE;
  let currentList = [];
  const F = {
    op: $("#f-op"), type: $("#f-type"), city: $("#f-city"),
    min: $("#f-min"), max: $("#f-max"), rooms: $("#f-rooms"),
    baths: $("#f-baths"), estrato: $("#f-estrato"), sort: $("#f-sort"),
  };

  /* Poblar tipo y municipio dinámicamente desde la base real */
  const fillSelect = (sel, values, keepFirst = true) => {
    if (!sel) return;
    const first = keepFirst ? sel.options[0].outerHTML : "";
    sel.innerHTML = first + values.map((v) => `<option value="${v}">${v}</option>`).join("");
  };
  const TYPE_ORDER = ["Casa", "Apartamento", "Apartaestudio", "Dúplex", "Finca", "Lote"];
  const types = TYPE_ORDER.filter((t) => PROPERTIES.some((p) => p.type === t));
  const cities = [...new Set(PROPERTIES.map((p) => p.city))].sort();
  fillSelect(F.type, types);
  fillSelect(F.city, cities);
  fillSelect($("#hs-type"), types);
  fillSelect($("#hs-city"), cities);

  /* texto buscable por propiedad (memoizado) */
  const norm = (s) => (s || "").toString().toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "");
  PROPERTIES.forEach((p) => {
    p._search = norm([
      p.code, p.title, p.type, p.city, p.sector, p.operation === "arriendo" ? "arriendo alquiler" : "venta comprar",
      p.tags.join(" "), (p.internas || []).join(" "), (p.externas || []).join(" "),
      p.desc, p.rooms != null ? p.rooms + " habitaciones alcobas" : "",
      p.baths != null ? p.baths + " banos" : "",
      p.garages != null ? p.garages + " garajes parqueadero" : "",
      p.estrato != null ? "estrato " + p.estrato : "",
    ].join(" "));
  });

  const matchesSearch = (p, q) => {
    if (!q) return true;
    return q.split(/\s+/).every((tok) => p._search.includes(tok));
  };

  const applyFilters = (resetPage = true) => {
    if (resetPage) shown = PAGE;
    const q = norm(search.value.trim());
    searchClear.hidden = !search.value;
    let list = PROPERTIES.filter((p) => {
      if (!matchesSearch(p, q)) return false;
      if (F.op.value && p.operation !== F.op.value) return false;
      if (F.type.value && p.type !== F.type.value) return false;
      if (F.city.value && p.city !== F.city.value) return false;
      if (F.min.value && (p.price == null || p.price < +F.min.value)) return false;
      if (F.max.value && (p.price == null || p.price > +F.max.value)) return false;
      if (F.rooms.value && (p.rooms == null || p.rooms < +F.rooms.value)) return false;
      if (F.baths.value && (p.baths == null || p.baths < +F.baths.value)) return false;
      if (F.estrato.value && String(p.estrato) !== F.estrato.value) return false;
      return true;
    });
    const areaOf = (p) => (p.type === "Lote" ? (p.areaLote || p.area) : p.area) || 0;
    const s = F.sort.value;
    if (s === "price-desc") list.sort((a, b) => (b.price || 0) - (a.price || 0));
    else if (s === "price-asc") list.sort((a, b) => (a.price || 1e15) - (b.price || 1e15));
    else if (s === "area-desc") list.sort((a, b) => areaOf(b) - areaOf(a));
    else if (s === "area-asc") list.sort((a, b) => areaOf(a) - areaOf(b));

    currentList = list;
    renderPage();
    count.textContent = list.length
      ? `${list.length} ${list.length === 1 ? "propiedad encontrada" : "propiedades encontradas"}`
      : "";
    noRes.hidden = list.length > 0;
  };

  const renderPage = () => {
    const slice = currentList.slice(0, shown);
    renderCards(catalog, slice);
    watchRv(catalog);
    loadMore.hidden = shown >= currentList.length;
    if (!loadMore.hidden)
      loadMore.textContent = `Ver más propiedades (${currentList.length - shown} restantes)`;
  };

  loadMore.addEventListener("click", () => {
    shown += PAGE;
    renderPage();
  });

  /* buscador en tiempo real (debounce ligero) */
  let searchT = null;
  search.addEventListener("input", () => {
    clearTimeout(searchT);
    searchT = setTimeout(() => applyFilters(), 160);
  });
  searchClear.addEventListener("click", () => {
    search.value = "";
    applyFilters();
    search.focus();
  });

  Object.values(F).forEach((el) => el && el.addEventListener("change", () => applyFilters()));
  $("#f-clear").addEventListener("click", () => {
    Object.values(F).forEach((el) => (el.value = el.id === "f-sort" ? "recent" : ""));
    search.value = "";
    applyFilters();
  });
  applyFilters();

  /* buscador del hero → aplica filtros y baja al catálogo */
  const heroSearch = $("#hero-search");
  let heroOp = "venta";
  $$(".ops button", heroSearch).forEach((b) =>
    b.addEventListener("click", () => {
      $$(".ops button", heroSearch).forEach((x) => x.classList.remove("on"));
      b.classList.add("on");
      heroOp = b.dataset.op;
    })
  );
  heroSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    F.op.value = heroOp;
    F.type.value = $("#hs-type").value;
    F.city.value = $("#hs-city").value;
    const pr = $("#hs-price").value;
    if (pr) {
      const [mn, mx] = pr.split("-").map(Number);
      const near = (sel, target, dir) => {
        let best = "";
        [...sel.options].forEach((o) => {
          if (!o.value) return;
          const v = +o.value;
          if (dir === "min" ? v <= target : v >= target)
            if (!best || (dir === "min" ? v > +best : v < +best)) best = o.value;
        });
        sel.value = best;
      };
      F.min.value = ""; F.max.value = "";
      if (mn > 0) near(F.min, mn, "min");
      if (mx < 99999999999) near(F.max, mx, "max");
    } else { F.min.value = ""; F.max.value = ""; }
    F.rooms.value = $("#hs-rooms").value;
    applyFilters();
    $("#propiedades").scrollIntoView({ behavior: "smooth" });
  });

  /* nav (escritorio y móvil) Comprar/Arrendar presetea operación y filtra */
  $$("a[data-op]").forEach((a) =>
    a.addEventListener("click", () => {
      F.op.value = a.dataset.op;
      applyFilters();
      setTimeout(() => $("#propiedades").scrollIntoView({ behavior: "smooth" }), 60);
    })
  );

  /* Comprar/Arrendar desde otra página llegan como index.html?op=venta#propiedades:
     aplicamos el filtro al cargar para que el catálogo abra ya filtrado. */
  const opInicial = new URLSearchParams(location.search).get("op");
  if (opInicial === "venta" || opInicial === "arriendo") {
    F.op.value = opInicial;
    applyFilters();
    setTimeout(() => $("#propiedades").scrollIntoView({ behavior: "smooth" }), 120);
  }

  /* ---------- Procesos: compra (sección general) y venta (sección propietarios) ---------- */
  const stepsHtml = (steps) =>
    steps
      .map(
        ([t, d], i) => `
      <div class="tl-step" style="animation:cardIn 500ms cubic-bezier(.22,1,.36,1) ${i * 90}ms both">
        <div class="num">${i + 1}</div><h3>${t}</h3><p>${d}</p>
      </div>`
      )
      .join("");

  const BUY_STEPS = [
    ["Escuchamos tus necesidades", "Entendemos qué buscas, tu presupuesto y tu estilo de vida."],
    ["Seleccionamos las mejores opciones", "Filtramos el portafolio y te presentamos solo lo que encaja contigo."],
    ["Programamos visitas", "Coordinamos recorridos por las propiedades que te interesan."],
    ["Acompañamiento en el proceso", "Te orientamos en cada paso, con transparencia y sin presiones."],
    ["Entrega del inmueble", "Recibes tu nueva propiedad con el respaldo de nuestro equipo."],
  ];

  /* Los 6 pasos del proceso para propietarios */
  const SELL_STEPS = [
    ["Valoración", "Visitamos el inmueble y definimos contigo un precio acorde a la zona, el área y el estado de la propiedad."],
    ["Publicación", "Preparamos las fotografías y la información completa, y la publicamos en nuestro portafolio."],
    ["Promoción", "Difundimos tu inmueble por nuestros canales para llegar a compradores realmente interesados."],
    ["Visitas", "Coordinamos y acompañamos cada recorrido, y filtramos a los que solo van a mirar."],
    ["Negociación", "Te presentamos cada oferta y negociamos buscando las mejores condiciones para ti."],
    ["Acompañamiento hasta el cierre", "Te guiamos en los documentos, la escrituración y la firma, hasta la entrega del inmueble."],
  ];

  const timeline = $("#timeline");
  if (timeline) timeline.innerHTML = stepsHtml(BUY_STEPS);
  const ownersTl = $("#owners-timeline");
  if (ownersTl) ownersTl.innerHTML = stepsHtml(SELL_STEPS);

  /* ---------- Datos de contacto y empresa ---------- */
  const hoursEl = $("#c-hours");
  if (hoursEl)
    hoursEl.innerHTML = CONTACT.hours.map(([d, h]) => `${d}: ${h}`).join("<br>");

  const covEl = $("#c-coverage");
  if (covEl) covEl.textContent = COMPANY.municipios.join(" · ");

  const teamEl = $("#team-list");
  if (teamEl)
    teamEl.innerHTML = COMPANY.equipo
      .map((n) => {
        const ini = n.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("");
        return `<div class="team-member"><span class="ini">${ini}</span><span class="nm">${n}</span></div>`;
      })
      .join("");

  /* ---------- Stats (cifras reales de la empresa) ---------- */
  const statsBand = $("#stats-band");
  const añosOperando = new Date().getFullYear() - COMPANY.desde;
  const derived = [
    { value: añosOperando, suffix: "", label: `Años de experiencia (desde ${COMPANY.desde})` },
    { value: null, text: COMPANY.inmueblesVendidos, label: "Inmuebles vendidos" },
    { value: null, text: COMPANY.familiasAtendidas, label: "Familias atendidas" },
    { value: PROPERTIES.length, suffix: "", label: "Propiedades disponibles" },
  ];
  const allStats = STATS.length ? STATS : derived;
  statsBand.innerHTML = allStats
    .map(
      (s) => `
    <div class="stat">
      <div class="v">${s.value != null ? `<span data-count="${s.value}">0</span><small>${s.suffix || ""}</small>` : s.text}</div>
      <div class="l">${s.label}</div>
    </div>`
    )
    .join("");
  /* contador animado */
  const cntObs = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      cntObs.unobserve(e.target);
      const end = +e.target.dataset.count;
      const t0 = performance.now();
      const tick = (t) => {
        const k = Math.min(1, (t - t0) / 1400);
        e.target.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });
  $$("[data-count]").forEach((el) => cntObs.observe(el));

  /* ---------- Testimonios (estructura preparada) ---------- */
  if (TESTIMONIALS.length) {
    $("#testimonios").hidden = false;
    $("#testi-track").innerHTML = TESTIMONIALS.map(
      (t) => `
      <div class="testi-card">
        <div class="stars">${"★".repeat(t.rating || 5)}</div>
        <p>“${t.comment}”</p>
        <div class="who">${t.photo ? `<img src="${t.photo}" alt="${t.name}">` : ""}${t.name}</div>
      </div>`
    ).join("");
  }

  /* ---------- FAQ ---------- */
  const FAQS = [
    ["¿Cómo agendo una visita a una propiedad?", "Escríbenos por WhatsApp al 323 227 3772 o usa el botón “Agendar Visita” en cualquier propiedad. Coordinamos contigo el día y la hora."],
    ["¿Qué zonas cubren?", "Trabajamos en La Ceja y el Oriente Antioqueño. Todo nuestro portafolio actual se encuentra en esta zona."],
    ["¿La información de las propiedades es verificada?", "Sí. Cada propiedad publicada corresponde a la información y fotografías oficiales de nuestro inventario."],
    ["¿Me acompañan durante todo el proceso de compra?", "Sí. Te acompañamos desde la primera visita hasta la entrega del inmueble, resolviendo tus dudas en cada paso."],
    ["Quiero vender mi propiedad, ¿qué debo hacer?", "Contáctanos por WhatsApp o a través del formulario. Un asesor conocerá tu propiedad y te explicará el proceso de publicación y venta."],
    ["¿Atienden por WhatsApp?", "Sí, es nuestro canal más rápido: 323 227 3772. También puedes llamarnos al 300 692 4702."],
  ];
  $("#faq-list").innerHTML = FAQS.map(
    ([q, a]) => `
    <div class="faq-item">
      <button type="button" class="faq-q" aria-expanded="false">
        ${q}<span class="chev">${I.chev}</span>
      </button>
      <div class="faq-a"><p>${a}</p></div>
    </div>`
  ).join("");
  $$(".faq-item").forEach((item) => {
    const q = $(".faq-q", item), a = $(".faq-a", item);
    q.addEventListener("click", () => {
      const open = item.classList.toggle("open");
      q.setAttribute("aria-expanded", open);
      a.style.maxHeight = open ? a.scrollHeight + "px" : 0;
    });
  });

  /* ---------- Formularios de captación (uno por tipo de solicitud) ---------- */
  const ROOM_OPTS = ["1", "2", "3", "4", "5 o más"];
  const FIELD = {
    tipoBusca:      { label: "Tipo de inmueble que buscas", el: "select", opts: () => types, any: "Cualquiera" },
    tipoMio:        { label: "Tipo de inmueble", el: "select", opts: () => types, any: "Selecciona" },
    municipio:      { label: "Municipio de interés", el: "select", opts: () => cities, any: "Cualquiera" },
    alcobas:        { label: "Alcobas que necesitas", el: "select", opts: () => ROOM_OPTS, any: "Cualquiera" },
    ubicacion:      { label: "Municipio y barrio o sector", el: "input", ph: "Ej: La Ceja, sector El Tambo" },
    presupuesto:    { label: "Presupuesto aproximado", el: "input", ph: "Ej: $600.000.000" },
    presupuestoMes: { label: "Presupuesto mensual", el: "input", ph: "Ej: $2.000.000" },
    area:           { label: "Área construida aproximada", el: "input", ph: "Ej: 140 m²" },
    precioEsperado: { label: "Precio esperado", el: "input", ph: "Ej: $700.000.000" },
    canonEsperado:  { label: "Canon mensual esperado", el: "input", ph: "Ej: $2.500.000" },
  };

  const LEAD_TYPES = {
    comprar: {
      tab: "Comprar", asunto: "Quiero comprar",
      nota: "Cuéntanos qué buscas y te enviamos las opciones que encajan.",
      extra: ["tipoBusca", "municipio", "alcobas", "presupuesto"],
    },
    arrendar: {
      tab: "Arrendar", asunto: "Quiero arrendar (busco inmueble)",
      nota: "Dinos qué necesitas y te mostramos lo que hay disponible.",
      extra: ["tipoBusca", "municipio", "alcobas", "presupuestoMes"],
    },
    vender: {
      tab: "Vender mi inmueble", asunto: "Quiero vender mi inmueble",
      nota: "Un asesor te contacta para coordinar la valoración, sin costo.",
      extra: ["tipoMio", "ubicacion", "area", "precioEsperado"],
    },
    rentar: {
      tab: "Arrendar mi inmueble", asunto: "Quiero poner mi inmueble en arriendo",
      nota: "Un asesor te contacta para conocer el inmueble.",
      extra: ["tipoMio", "ubicacion", "area", "canonEsperado"],
    },
    asesoria: {
      tab: "Asesoría", asunto: "Solicito asesoría",
      nota: "Cuéntanos tu caso y te orientamos sin compromiso.",
      extra: [],
    },
  };

  let leadSeq = 0;
  const buildLeadForm = (key, slot, showNota = true) => {
    const t = LEAD_TYPES[key];
    const uid = "lf" + ++leadSeq;
    const extraHtml = t.extra
      .map((name) => {
        const f = FIELD[name];
        const id = `${uid}-${name}`;
        const ctrl = f.el === "select"
          ? `<select id="${id}" data-f="${name}"><option value="">${f.any}</option>${f.opts().map((v) => `<option>${v}</option>`).join("")}</select>`
          : `<input id="${id}" data-f="${name}" type="text" placeholder="${f.ph}" />`;
        return `<div class="fld"><label for="${id}">${f.label}</label>${ctrl}</div>`;
      })
      .join("");

    slot.innerHTML = `
      <form class="lead-form" novalidate>
        ${showNota ? `<p class="lead-note">${t.nota}</p>` : ""}
        <div class="form-grid">
          <div class="fld"><label for="${uid}-name">Nombre completo</label><input id="${uid}-name" data-f="name" type="text" autocomplete="name" placeholder="Tu nombre" required /></div>
          <div class="fld"><label for="${uid}-phone">Teléfono / WhatsApp</label><input id="${uid}-phone" data-f="phone" type="tel" autocomplete="tel" placeholder="Tu número" required /></div>
          <div class="fld full"><label for="${uid}-email">Correo electrónico</label><input id="${uid}-email" data-f="email" type="email" autocomplete="email" placeholder="tucorreo@ejemplo.com" required /></div>
          ${extraHtml}
          <div class="fld full"><label for="${uid}-msg">Mensaje</label><textarea id="${uid}-msg" data-f="msg" rows="3" placeholder="Cuéntanos los detalles…"></textarea></div>
          <button type="submit" class="btn btn-magenta full">Enviar por WhatsApp</button>
        </div>
        <p class="form-note">Al enviar se abre WhatsApp con tu solicitud lista para nuestro equipo. Tus datos solo se usan para atenderla y autorizas su tratamiento según nuestra <a href="legal.html#datos">política de tratamiento de datos personales</a>.</p>
        <p class="form-ok">✓ ¡Listo! Tu solicitud se abrió en WhatsApp. Te respondemos muy pronto.</p>
      </form>`;

    const form = $("form", slot);
    const val = (n) => {
      const el = $(`[data-f="${n}"]`, form);
      return el ? el.value.trim() : "";
    };
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      ["name", "phone", "email"].forEach((n) => {
        const el = $(`[data-f="${n}"]`, form);
        const bad = !el.value.trim() || (n === "email" && !/^\S+@\S+\.\S+$/.test(el.value));
        el.classList.toggle("err", bad);
        if (bad) ok = false;
      });
      if (!ok) return;

      const lines = [
        `*SOLICITUD: ${t.asunto}*`, "",
        `Nombre: ${val("name")}`,
        `Teléfono: ${val("phone")}`,
        `Correo: ${val("email")}`,
      ];
      t.extra.forEach((n) => {
        const v = val(n);
        if (v) lines.push(`${FIELD[n].label}: ${v}`);
      });
      const m = val("msg");
      if (m) lines.push("", `Mensaje: ${m}`);

      window.open(waLink(lines.join("\n")), "_blank", "noopener");
      const okMsg = $(".form-ok", form);
      okMsg.classList.add("show");
      form.reset();
      setTimeout(() => okMsg.classList.remove("show"), 7000);
    });
  };

  /* Contacto: pestañas con los 5 tipos de solicitud */
  const leadTabs = $("#lead-tabs"), leadSlot = $("#lead-form-slot");
  if (leadTabs && leadSlot) {
    const keys = Object.keys(LEAD_TYPES);
    leadTabs.innerHTML = keys
      .map((k, i) => `<button type="button" role="tab" data-k="${k}" class="${i === 0 ? "on" : ""}" aria-selected="${i === 0}">${LEAD_TYPES[k].tab}</button>`)
      .join("");
    buildLeadForm(keys[0], leadSlot);
    $$("button", leadTabs).forEach((b) =>
      b.addEventListener("click", () => {
        $$("button", leadTabs).forEach((x) => {
          x.classList.remove("on"); x.setAttribute("aria-selected", "false");
        });
        b.classList.add("on"); b.setAttribute("aria-selected", "true");
        buildLeadForm(b.dataset.k, leadSlot);
      })
    );
  }

  /* Sección propietarios: formulario de venta, sin pestañas */
  const ownerSlot = $("#owner-form-slot");
  if (ownerSlot) buildLeadForm("vender", ownerSlot, false);

  /* ---------- Footer ---------- */
  $("#year").textContent = new Date().getFullYear();
  $("#to-top").addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
})();

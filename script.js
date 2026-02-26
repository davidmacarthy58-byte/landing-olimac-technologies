(function () {
  const S = window.SITE || {};

  // helpers
  const qs = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => [...el.querySelectorAll(s)];
  const enc = encodeURIComponent;

  // Preenche textos via data-site
  qsa("[data-site]").forEach((el) => {
    const key = el.getAttribute("data-site");
    if (S[key] != null) el.textContent = S[key];
  });

  // WhatsApp link builder
  function wppLink(extraMsg = "") {
    const baseMsg = (S.whatsappMensagem || "").trim();
    const finalMsg = [baseMsg, extraMsg].filter(Boolean).join("\n");
    return `https://wa.me/${S.whatsappNumero}?text=${enc(finalMsg)}`;
  }

  // Links rápidos
  const btnWhatsappHero = qs("#btnWhatsappHero");
  const btnWhatsappCard = qs("#btnWhatsappCard");
  const btnWhatsappSobre = qs("#btnWhatsappSobre");
  const wppFloat = qs("#wppFloat");
  [btnWhatsappHero, btnWhatsappCard, btnWhatsappSobre, wppFloat].forEach((b) => {
    if (!b) return;
    b.href = wppLink();
  });

  const btnInstagram = qs("#btnInstagram");
  if (btnInstagram) btnInstagram.href = S.instagramUrl || "#";

  const btnGithub = qs("#btnGithub");
  if (btnGithub) btnGithub.href = S.githubUrl || "#";

  const btnSite = qs("#btnSite");
  if (btnSite) btnSite.href = S.siteUrl || "#";

  // Email / telefone
  const emailLink = qs("#emailLink");
  if (emailLink) {
    emailLink.textContent = S.email || "";
    emailLink.href = S.email ? `mailto:${S.email}` : "#";
  }
  const telLink = qs("#telLink");
  if (telLink) {
    telLink.textContent = S.telefone || "";
    const onlyDigits = (S.telefone || "").replace(/\D/g, "");
    telLink.href = onlyDigits ? `tel:+${onlyDigits}` : "#";
  }

  // Mapa
  const mapFrame = qs("#mapFrame");
  if (mapFrame) mapFrame.src = S.mapaEmbed || "";

  // Highlights
  const hl = qs("#highlights");
  if (hl && Array.isArray(S.destaque)) {
    hl.innerHTML = S.destaque
      .slice(0, 4)
      .map((t) => `<div class="hl"><strong>✦</strong> ${t}</div>`)
      .join("");
  }

  // Grids
  function renderCards(list, targetId) {
    const el = qs(targetId);
    if (!el || !Array.isArray(list)) return;
    el.innerHTML = list
      .map(
        (item) => `
        <article class="card reveal">
          <h3>${item.titulo}</h3>
          <p>${item.desc}</p>
        </article>
      `
      )
      .join("");
  }

  renderCards(S.servicos, "#servicosGrid");
  renderCards(S.vantagens, "#vantagensGrid");
  renderCards(S.cases, "#casesGrid");

  // Menu mobile
  const navToggle = qs("#navToggle");
  const navLinks = qs("#navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("is-open");
    });

    // fecha ao clicar
    qsa("a", navLinks).forEach((a) => {
      a.addEventListener("click", () => navLinks.classList.remove("is-open"));
    });

    // fecha ao clicar fora
    document.addEventListener("click", (e) => {
      const inside = navLinks.contains(e.target) || navToggle.contains(e.target);
      if (!inside) navLinks.classList.remove("is-open");
    });
  }

  // Form -> envia pro WhatsApp
  const form = qs("#formContato");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);

      const nome = (fd.get("nome") || "").toString().trim();
      const whats = (fd.get("whats") || "").toString().trim();
      const tipo = (fd.get("tipo") || "").toString().trim();
      const msg = (fd.get("msg") || "").toString().trim();

      const extra =
        `📌 Novo contato (Landing OliMac)\n` +
        `Nome: ${nome}\n` +
        `Whats: ${whats}\n` +
        `Tipo: ${tipo}\n` +
        `Mensagem: ${msg}`;

      window.open(wppLink(extra), "_blank", "noopener,noreferrer");
      form.reset();
    });
  }

  // Reveal on scroll
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) en.target.classList.add("reveal--show");
      });
    },
    { threshold: 0.12 }
  );

  qsa(".reveal").forEach((el) => obs.observe(el));
})();
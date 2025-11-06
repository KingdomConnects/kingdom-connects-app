/* Kingdom Connects — Admin Components (FINAL) */

(() => {
  if (!/\/admin(?:\/|$)/.test(location.pathname)) return;

  function getBaseFromPath() {
    try {
      const m = location.pathname.match(/^(.*?)(\/admin(?:\/|$).*)$/);
      if (m && m[1] !== undefined) {
        return m[1].endsWith("/") ? m[1] : m[1] + "/";
      }
    } catch {}
    return "/";
  }
  const BASE = getBaseFromPath();

  const onReady = (fn) =>
    document.readyState !== "loading"
      ? fn()
      : document.addEventListener("DOMContentLoaded", fn, { once: true });

  function ensureSlot(id, where = "prepend") {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("div");
      el.id = id;
      where === "prepend" ? document.body.prepend(el) : document.body.append(el);
    }
    return el;
  }

  const NAV = [
    { href: `${BASE}admin/index.html`, label: "Dashboard" },
    { href: `${BASE}admin/manage_churches.html`, label: "Churches" },
    { href: `${BASE}admin/manage_businesses.html`, label: "Businesses" },
    { href: `${BASE}admin/pending_submissions.html`, label: "Submissions" },
    { href: `${BASE}admin/moderate_reviews.html`, label: "Reviews" },
    { href: `${BASE}admin/users.html`, label: "Users" },
    { href: `${BASE}admin/settings.html`, label: "Settings" }
  ];

  const headerHTML = () => `
<header id="header" class="header site-header" role="banner">
  <div class="header-inner">
    <a class="brand" href="${BASE}admin/index.html">
      <img class="site-logo"
           src="${BASE}library/images/kingdom-connects-logo-300.png"
           alt="Kingdom Connects Logo">
      <h1 class="site-title">Kingdom Connects <span class="gold">Admin</span></h1>
    </a>

    <ul class="nav-links" id="admin-nav" aria-label="Admin Navigation">
      ${NAV.map(i => `<li><a href="${i.href}">${i.label}</a></li>`).join("")}
    </ul>

    <div class="header-actions">
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="admin-nav">
        <span class="bar"></span><span class="bar"></span><span class="bar"></span>
        <span class="sr-only">Menu</span>
      </button>
      <a href="${BASE}index.html" class="back-to-top" target="_blank" rel="noopener">View Site ↗</a>
    </div>
  </div>
</header>
`;

  const footerHTML = () => `
<footer id="footer" class="footer site-footer" role="contentinfo">
  <div class="footer-inner">
    <nav class="footer-nav" aria-label="Admin Footer">
      ${NAV.slice(0, 4).map(i => `<a href="${i.href}">${i.label}</a>`).join("")}
    </nav>
    <a href="#top" class="back-to-top">Back to top ↑</a>
    <div class="socials" aria-hidden="true">
      <span class="social-btn">KC</span>
    </div>
    <p class="dim">© <span data-admin-year></span> Kingdom Connects — Admin</p>
  </div>
</footer>
`;

  onReady(() => {
    document.body.classList.add("is-admin");

    const headerSlot = ensureSlot("admin-header", "prepend");
    headerSlot.innerHTML = headerHTML();

    const nav = document.getElementById("admin-nav");
    const toggle = document.querySelector(".menu-toggle");
    if (toggle && nav) {
      const setState = (open) => {
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        nav.classList.toggle("open", open);
        nav.classList.toggle("active", open);
      };
      let open = false;
      toggle.addEventListener("click", () => { open = !open; setState(open); });
      document.addEventListener("click", (e) => {
        if (!open) return;
        if (e.target.closest(".menu-toggle") || e.target.closest(".nav-links")) return;
        open = false; setState(open);
      });
    }

    const footerSlot = ensureSlot("admin-footer", "append");
    footerSlot.innerHTML = footerHTML();

    const y = document.querySelector("[data-admin-year]");
    if (y) y.textContent = new Date().getFullYear();

    const logo = document.querySelector(".site-logo");
    if (logo) {
      logo.addEventListener("error", () => {
        logo.src = `${BASE}library/images/logo-fallback.png`;
      }, { once: true });
    }

    console.log("[KC admin-components] Header/footer injected; admin tint active.");
  });
})();
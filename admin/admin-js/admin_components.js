/* Kingdom Connects — Admin Components
   Builds header and footer structure directly in JavaScript.
   No inline styles, no inline JS, no fetch calls.
   Runs only on /admin/* pages.
*/

(() => {
  // Only run on /admin pages
  if (!location.pathname.startsWith("/admin/")) return;

  const BASE = "/"; // Base URL (root)
  const onReady = (fn) =>
    document.readyState !== "loading"
      ? fn()
      : document.addEventListener("DOMContentLoaded", fn, { once: true });

  // Helper to ensure a mount element exists
  function ensureSlot(id, where = "prepend") {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("div");
      el.id = id;
      where === "prepend" ? document.body.prepend(el) : document.body.append(el);
    }
    return el;
  }

  // ---------- HEADER ----------
  const headerHTML = () => `
<header class="admin-header" role="banner">
  <div class="admin-header__inner">
    <a class="admin-brand" href="${BASE}admin/index.html">
      <img class="admin-brand__logo"
           src="${BASE}library/images/kingdom-connects-logo-300.png"
           alt="Kingdom Connects Logo">
      <span class="admin-brand__title">Kingdom Connects Admin</span>
    </a>

    <nav class="admin-nav" aria-label="Admin Navigation">
      <a class="admin-nav__link" href="${BASE}admin/index.html">Dashboard</a>
      <a class="admin-nav__link" href="${BASE}admin/users.html">Users</a>
      <a class="admin-nav__link" href="${BASE}admin/listings.html">Listings</a>
      <a class="admin-nav__link" href="${BASE}index.html" target="_blank" rel="noopener">View Site ↗</a>
    </nav>
  </div>
</header>
`;

  // ---------- FOOTER ----------
  const footerHTML = () => `
<footer class="admin-footer" role="contentinfo">
  <div class="admin-footer__inner">
    <p class="admin-footer__copy">© <span data-admin-year></span> Kingdom Connects — Admin Panel</p>
    <div class="admin-footer__extra"><!-- Optional footer links or credits go here --></div>
  </div>
</footer>
`;

  // ---------- INJECT STRUCTURE ----------
  onReady(() => {
    // Header
    const headerSlot = ensureSlot("admin-header", "prepend");
    headerSlot.innerHTML = headerHTML();

    // Footer
    const footerSlot = ensureSlot("admin-footer", "append");
    footerSlot.innerHTML = footerHTML();

    // Auto-set footer year
    const yearSpan = document.querySelector("[data-admin-year]");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // Add admin class to <body> for CSS targeting
    document.body.classList.add("is-admin");

    // Add logo fallback (no inline handlers)
    const logo = document.querySelector(".admin-brand__logo");
    if (logo) {
      logo.addEventListener(
        "error",
        () => {
          logo.src = `${BASE}library/images/logo-fallback.png`;
        },
        { once: true }
      );
    }

    console.log("[KC admin-components] Admin header & footer injected successfully.");
  });
})();
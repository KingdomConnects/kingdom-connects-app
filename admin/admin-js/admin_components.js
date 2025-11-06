/* Kingdom Connects — /admin/admin-js/admin_components.js
   - Runs ONLY on /admin/* pages
   - Dynamically builds the admin header in JS (no fetch)
   - Skips injection elsewhere
*/

(() => {
  const BASE = "/"; // root path
  const path = location.pathname;

  // Exit on non-admin pages
  if (!path.startsWith("/admin/")) return;

  const onReady = (fn) =>
    document.readyState !== "loading"
      ? fn()
      : document.addEventListener("DOMContentLoaded", fn, { once: true });

  function ensureSlot(id, where = "start") {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("div");
      el.id = id;
      where === "start"
        ? document.body.prepend(el)
        : document.body.appendChild(el);
    }
    return el;
  }

  const adminHeaderHTML = () => `
<header class="admin-header glass">
  <div class="admin-header-inner">
    <a href="${BASE}admin/index.html" class="admin-brand">
      <img src="${BASE}library/images/kingdom-connects-logo-300.png"
           alt="Admin Logo" class="admin-logo" width="48" height="48"
           onerror="this.onerror=null;this.src='${BASE}library/images/logo-fallback.png';">
      <span class="admin-title">Kingdom Connects Admin</span>
    </a>
    <nav class="admin-nav">
      <a href="${BASE}admin/index.html">Dashboard</a>
      <a href="${BASE}admin/users.html">Users</a>
      <a href="${BASE}admin/listings.html">Listings</a>
      <a href="${BASE}index.html" target="_blank">View Site ↗</a>
    </nav>
  </div>
</header>
`;

  onReady(() => {
    const container = ensureSlot("admin-header", "start");
    container.innerHTML = adminHeaderHTML();
    document.body.classList.add("is-admin");
    console.log("[KC admin-components] ✅ Admin header injected.");
  });
})();
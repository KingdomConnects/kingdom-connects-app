/* Kingdom Connects — /js/components.js
   - Skips ALL injection on /admin/* pages (uses your static admin header)
   - Injects header/footer only on public pages
   - Uses root-absolute URLs so paths never break
*/

(() => {
  const BASE = "/"; // site root
  const path = location.pathname;

  // If we're on any /admin/* page, do NOTHING (no header/footer injection).
  if (path.startsWith("/admin/")) {
    // Optional: mark body for CSS targeting, but do not inject anything.
    document.addEventListener("DOMContentLoaded", () => {
      document.body.classList.add("is-admin");
      console.log("[KC components] Admin page detected — skipping injection.");
    });
    return; // <-- critical: no injection on admin
  }

  // -------- Public pages only below --------

  const onReady = (fn) =>
    document.readyState !== "loading"
      ? fn()
      : document.addEventListener("DOMContentLoaded", fn, { once: true });

  function ensureSlot(id, where = "end") {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("div");
      el.id = id;
      where === "start" ? document.body.prepend(el) : document.body.appendChild(el);
    }
    return el;
  }

  const headerHTML = () => `
<header class="site-header">
  <div class="header-inner">
    <a class="brand" href="${BASE}index.html" aria-label="Home">
      <img class="site-logo"
           src="${BASE}library/images/kingdom-connects-logo-300.png"
           alt="Kingdom Connects logo" width="48" height="48"
           onerror="this.onerror=null;this.src='${BASE}
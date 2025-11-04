/* components.js — header/footer injector that uses kc_path.js if present
   - Keeps header/footer injection in THIS file (as you wanted)
   - Reads KC_BASE / KC_IS_ADMIN from kc_path.js
   - Falls back to auto-detect if kc_path.js isn’t loaded
   - Creates #header/#footer slots if missing (can’t fail silently)
*/
(() => {
  const LOG = '[KC components]';

  // Prefer kc_path.js signals; fallback if missing
  const isAdmin = (typeof window.KC_IS_ADMIN !== 'undefined')
    ? !!window.KC_IS_ADMIN
    : /(^|\/)admin(\/|$)/i.test(location.pathname);

  const BASE = (typeof window.KC_BASE !== 'undefined')
    ? String(window.KC_BASE)
    : (isAdmin ? '../' : './');

  const onReady = (fn) =>
    (document.readyState !== 'loading')
      ? fn()
      : document.addEventListener('DOMContentLoaded', fn, { once: true });

  function ensureSlot(id, where = 'end') {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('div');
      el.id = id;
      if (where === 'start') document.body.prepend(el);
      else document.body.appendChild(el);
      console.info(LOG, `created #${id}`);
    }
    return el;
  }

  const headerHTML = () => `
<header class="site-header">
  <div class="header-inner">
    <a class="brand" href="${BASE}index.html" aria-label="Home">
      <span class="site-title">Kingdom Connects</span>
    </a>

    <button id="menuBtn" class="menu-toggle" aria-haspopup="true" aria-expanded="false" aria-controls="navMenu" type="button" title="Open menu">
      <span class="bar"></span><span class="bar"></span><span class="bar"></span>
    </button>

    <ul class="nav-links" id="navMenu">
      <li><a href="${BASE}index.html">Home</a></li>
      <li><a href="${BASE}business.html">Businesses</a></li>
      <li><a href="${BASE}submit_business.html">Submit</a></li>
      <li><a href="${BASE}about.html">About</a></li>
      <li><a href="${BASE}contact.html">Contact</a></li>
    </ul>
  </div>
</header>`.trim();

  const footerHTML = () => `
<footer class="site-footer">
  <div class="footer-inner">
    <nav class="footer-nav">
      <a href="${BASE}about.html">About</a>
      <a href="${BASE}business.html">Businesses</a>
      <a href="${BASE}submit_business.html">Submit</a>
      <a href="${BASE}contact.html">Contact</a>
    </nav>
    <a class="back-to-top" href="#top">Back to top ↑</a>
    <small>© ${new Date().getFullYear()} Kingdom Connects. All rights reserved.</small>
  </div>
</footer>`.trim();

  function injectShell() {
    // Add admin class for CSS if on /admin/
    if (isAdmin) document.body.classList.add('is-admin');

    const headerSlot = ensureSlot('header', 'start');
    const footerSlot = ensureSlot('footer', 'end');

    if (!headerSlot.dataset.kcInjected) {
      headerSlot.innerHTML = headerHTML();
      headerSlot.dataset.kcInjected = '1';
    }
    if (!footerSlot.dataset.kcInjected) {
      footerSlot.innerHTML = footerHTML();
      footerSlot.dataset.kcInjected = '1';
    }

    // Simple mobile menu
    const menuBtn = document.getElementById('menuBtn');
    const navMenu = document.getElementById('navMenu');
    if (menuBtn && navMenu) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = navMenu.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
          navMenu.classList.remove('open');
          menuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Marker for verification
    window.KC_COMPONENTS_OK = true;
    console.log(LOG, 'injected', { base: BASE, admin: isAdmin, path: location.pathname });
  }

  onReady(injectShell);
})();
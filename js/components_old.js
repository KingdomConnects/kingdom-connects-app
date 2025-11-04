/* Kingdom Connects — components.js (base-aware, slot-only, minimal) */

/* 1) Base path so links & assets work from root AND /admin/ */
const KC_BASE = /\/admin(\/|$)/i.test(location.pathname) ? '..' : '.';

/* 2) Mark admin pages for scoped CSS rules (spacing, full-width buttons, etc.) */
(() => {
  if (/\/admin(\/|$)/i.test(location.pathname)) {
    document.addEventListener('DOMContentLoaded', () => {
      document.body.classList.add('is-admin');
    });
  }
})();

/* 3) Restore theme + font size (no UI here, just state) */
(() => {
  const html = document.documentElement;

  try {
    const savedTheme = localStorage.getItem('kc-theme');
    if (savedTheme) html.setAttribute('data-theme', savedTheme);
  } catch (_) {}

  try {
    const savedScale = localStorage.getItem('kc-fontScale');
    if (savedScale) html.style.setProperty('--base-font-size', `${savedScale}px`);
  } catch (_) {}
})();

/* 4) Header/Footer injection (slot-only, and only if empty) */
document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  if (header && header.childElementCount === 0) {
    header.innerHTML = `
      <header class="site-header">
        <div class="header-inner">
          <a class="brand" href="${KC_BASE}/index.html" aria-label="Home">
            <img class="site-logo" src="${KC_BASE}/library/kingdom-connects-logo.png" alt="Kingdom Connects logo">
            <span class="site-title">Kingdom Connects</span>
          </a>

          <button id="menuBtn" class="menu-toggle" aria-haspopup="true" aria-expanded="false" aria-controls="navMenu" title="Open menu" type="button">
            <span class="bar"></span><span class="bar"></span><span class="bar"></span>
          </button>

          <ul class="nav-links" id="navMenu">
            <li><a href="${KC_BASE}/index.html">Home</a></li>
            <li><a href="${KC_BASE}/business.html">Businesses</a></li>
            <li><a href="${KC_BASE}/submit_business.html">Submit</a></li>
            <li><a href="${KC_BASE}/about.html">About</a></li>
            <li><a href="${KC_BASE}/contact.html">Contact</a></li>
          </ul>
        </div>
      </header>
    `;
  }

  const footer = document.getElementById('footer');
  if (footer && footer.childElementCount === 0) {
    footer.innerHTML = `
      <footer class="site-footer">
        <div class="footer-inner">
          <nav class="footer-nav">
            <a href="${KC_BASE}/about.html">About</a>
            <a href="${KC_BASE}/business.html">Businesses</a>
            <a href="${KC_BASE}/submit_business.html">Submit</a>
            <a href="${KC_BASE}/contact.html">Contact</a>
          </nav>
          <a class="back-to-top" href="#top">Back to top ↑</a>
          <small>© ${new Date().getFullYear()} Kingdom Connects. All rights reserved.</small>
        </div>
      </footer>
    `;
  }

  /* 5) Simple mobile menu (no-op if elements missing) */
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
});

/* 6) Optional: font size controls (safe no-op if buttons absent) */
(() => {
  const html = document.documentElement;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const getBase = () => {
    const raw = getComputedStyle(html).getPropertyValue('--base-font-size').trim();
    return raw ? parseFloat(raw) : 16;
  };
  const setBase = (px) => {
    html.style.setProperty('--base-font-size', `${px}px`);
    try { localStorage.setItem('kc-fontScale', String(px)); } catch (_) {}
  };

  document.addEventListener('DOMContentLoaded', () => {
    const minus = document.getElementById('fontMinus');
    const plus  = document.getElementById('fontPlus');
    if (minus) minus.addEventListener('click', () => setBase(clamp(getBase() - 1, 14, 22)));
    if (plus)  plus.addEventListener('click', () => setBase(clamp(getBase() + 1, 14, 22)));
  });
})();
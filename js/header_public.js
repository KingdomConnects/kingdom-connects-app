// FILE: js/header_public.js — FULL REPLACEMENT

(function () {
  const host = document.getElementById('header');
  if (!host) return;

  host.innerHTML = `
    <header class="kc-header">
      <div class="kc-header__inner">
        <a class="kc-logo" href="index.html" aria-label="Kingdom Connects Home">
          <img class="kc-logo__img" src="library/images/kingdom-connects-logo-300.png" alt="Kingdom Connects" />
        </a>

        <div class="kc-actions" aria-label="Header controls">
          <button class="kc-burger" id="kc-burger" aria-label="Main menu" type="button" aria-expanded="false" aria-controls="kc-nav">
            <span class="kc-burger__bar"></span>
            <span class="kc-burger__bar"></span>
            <span class="kc-burger__bar"></span>
          </button>
          <button class="kc-gear" id="kc-gear" aria-label="User/Settings menu" type="button">
            <svg class="kc-gear__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19.14,12.94a7.49,7.49,0,0,0,.05-.94,7.49,7.49,0,0,0-.05-.94l2.11-1.65a.5.5,0,0,0,.12-.64l-2-3.46a.5.5,0,0,0-.6-.22l-2.49,1a7.14,7.14,0,0,0-1.63-.94l-.38-2.64A.5.5,0,0,0,13,1H11a.5.5,0,0,0-.5.42L10.08,4.06a7.14,7.14,0,0,0-1.63.94l-2.49-1a.5.5,0,0,0-.6.22l-2,3.46a.5.5,0,0,0,.12.64L5.6,11.06a7.49,7.49,0,0,0-.05.94,7.49,7.49,0,0,0,.05.94L3.49,14.59a.5.5,0,0,0-.12.64l2,3.46a.5.5,0,0,0,.6.22l2.49-1a7.14,7.14,0,0,0,1.63.94l.42,2.64A.5.5,0,0,0,11,23h2a.5.5,0,0,0,.5-.42l.38-2.64a7.14,7.14,0,0,0,1.63-.94l2.49,1a.5.5,0,0,0,.6-.22l2-3.46a.5.5,0,0,0-.12-.64ZM12,15.5A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
            </svg>
          </button>
        </div>
      </div>

      <nav id="kc-nav" class="kc-nav" aria-label="Primary">
        <ul class="kc-nav__list">
          <li><a href="index.html">Home</a></li>
          <li><a href="business.html">Business Directory</a></li>
          <li><a href="submit_business.html">Submit a Business</a></li>
          <li><a href="about.html">About</a></li>
        </ul>
      </nav>

      <div id="kc-gear-panel" class="kc-gear-panel" role="menu" aria-hidden="true">
        <button class="kc-gear-panel__item" type="button">Sign In</button>
        <button class="kc-gear-panel__item" type="button">Create Account</button>
        <hr class="kc-gear-panel__sep" />
        <button class="kc-gear-panel__item" type="button" id="kc-theme-toggle">Toggle Theme</button>
      </div>
    </header>
  `;

  const burger = document.getElementById('kc-burger');
  const nav = document.getElementById('kc-nav');
  const gear = document.getElementById('kc-gear');
  const gearPanel = document.getElementById('kc-gear-panel');
  const themeToggle = document.getElementById('kc-theme-toggle');

  function closeGearPanel() {
    gearPanel?.setAttribute('aria-hidden', 'true');
    gear?.classList.remove('is-active');
  }

  function closeNav() {
    nav?.classList.remove('is-open');
    burger?.setAttribute('aria-expanded', 'false');
  }

  burger?.addEventListener('click', () => {
    const nowOpen = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', nowOpen);
    burger.setAttribute('aria-expanded', String(nowOpen));
    if (nowOpen) closeGearPanel();
  });

  gear?.addEventListener('click', () => {
    const hidden = gearPanel.getAttribute('aria-hidden') === 'true';
    gearPanel.setAttribute('aria-hidden', hidden ? 'false' : 'true');
    gear.classList.toggle('is-active', hidden);
    if (hidden) closeNav();
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#kc-gear') && !e.target.closest('#kc-gear-panel')) {
      closeGearPanel();
    }
  });

  themeToggle?.addEventListener('click', () => {
    const root = document.documentElement;
    const current = root.getAttribute('data-theme') || 'light';
    const newTheme = current === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // Restore saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
})();
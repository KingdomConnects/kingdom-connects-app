// PUBLIC HEADER — mounts into <div id="header"> in your pages.
// Keeps gear transparent, stacked above hamburger, with solid dropdown panels.

(function () {
  var host = document.getElementById('header');
  if (!host) return;

  host.innerHTML = `
    <header class="kc-header">
      <div class="kc-header__inner">
        <a class="kc-logo" href="index.html" aria-label="Kingdom Connects Home">
          <img class="kc-logo__img" src="library/images/kingdom-connects-logo-300.png" alt="Kingdom Connects" />
        </a>

        <!-- Gear above hamburger -->
        <div class="kc-actions" aria-label="Header controls">
          <button class="kc-gear" id="kc-gear" aria-label="User/Settings menu" type="button">
            <!-- SVG ensures no background ever appears behind the gear -->
            <svg class="kc-gear__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                 width="24" height="24" aria-hidden="true" focusable="false">
              <path d="M19.14,12.94a7.49,7.49,0,0,0,.05-.94,7.49,7.49,0,0,0-.05-.94l2.11-1.65a.5.5,0,0,0,.12-.64l-2-3.46a.5.5,0,0,0-.6-.22l-2.49,1a7.14,7.14,0,0,0-1.63-.94l-.38-2.64A.5.5,0,0,0,13,1H11a.5.5,0,0,0-.5.42L10.08,4.06a7.14,7.14,0,0,0-1.63.94l-2.49-1a.5.5,0,0,0-.6.22l-2,3.46a.5.5,0,0,0,.12.64L5.6,11.06a7.49,7.49,0,0,0-.05.94,7.49,7.49,0,0,0,.05.94L3.49,14.59a.5.5,0,0,0-.12.64l2,3.46a.5.5,0,0,0,.6.22l2.49-1a7.14,7.14,0,0,0,1.63.94l.42,2.64A.5.5,0,0,0,11,23h2a.5.5,0,0,0,.5-.42l.38-2.64a7.14,7.14,0,0,0,1.63-.94l2.49,1a.5.5,0,0,0,.6-.22l2-3.46a.5.5,0,0,0-.12-.64ZM12,15.5A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
            </svg>
          </button>

          <button class="kc-burger" id="kc-burger" aria-label="Main menu" type="button" aria-expanded="false" aria-controls="kc-nav">
            <span class="kc-burger__bar"></span>
            <span class="kc-burger__bar"></span>
            <span class="kc-burger__bar"></span>
          </button>
        </div>
      </div>

      <!-- Solid dropdown panel -->
      <nav id="kc-nav" class="kc-nav" aria-label="Primary">
        <ul class="kc-nav__list">
          <li><a href="index.html">Home</a></li>
          <li><a href="business.html">Business Directory</a></li>
          <li><a href="submit_business.html">Submit a Business</a></li>
          <li><a href="about.html">About</a></li>
        </ul>
      </nav>

      <!-- Solid gear panel -->
      <div id="kc-gear-panel" class="kc-gear-panel" role="menu" aria-hidden="true">
        <button class="kc-gear-panel__item" type="button">Sign In</button>
        <button class="kc-gear-panel__item" type="button">Create Account</button>
        <hr class="kc-gear-panel__sep" />
        <button class="kc-gear-panel__item" type="button" id="kc-theme-toggle">Toggle Theme</button>
      </div>
    </header>
  `;

  // Behavior
  var burger = document.getElementById('kc-burger');
  var nav = document.getElementById('kc-nav');
  var gear = document.getElementById('kc-gear');
  var gearPanel = document.getElementById('kc-gear-panel');
  var themeToggle = document.getElementById('kc-theme-toggle');

  function closeGearPanel() {
    if (!gearPanel) return;
    gearPanel.setAttribute('aria-hidden', 'true');
    if (gear) gear.classList.remove('is-active');
  }
  function closeNav() {
    if (!nav || !burger) return;
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var nowOpen = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', nowOpen);
      burger.setAttribute('aria-expanded', String(nowOpen));
      if (nowOpen) closeGearPanel();
    });
  }

  if (gear && gearPanel) {
    gear.addEventListener('click', function () {
      var hidden = gearPanel.getAttribute('aria-hidden') === 'true';
      gearPanel.setAttribute('aria-hidden', hidden ? 'false' : 'true');
      gear.classList.toggle('is-active', hidden);
      if (hidden) closeNav();
    });
  }

  document.addEventListener('click', function (e) {
    if (!gearPanel) return;
    var within = e.target.closest('#kc-gear') || e.target.closest('#kc-gear-panel');
    if (!within) closeGearPanel();
  });

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var root = document.documentElement;
      var current = root.getAttribute('data-theme') || 'light';
      root.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
    });
  }
})();
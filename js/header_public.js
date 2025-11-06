// Public header with hamburger + gear (theme + text size); relative-only.
(function () {
  const slot = document.getElementById("header");
  if (!slot) return;

  // --- Persisted settings ---
  const LS_THEME = "kc_theme";
  const LS_SCALE = "kc_font_scale"; // percent, e.g., 100, 110

  const html = document.documentElement;
  const savedTheme = localStorage.getItem(LS_THEME);
  const savedScale = parseInt(localStorage.getItem(LS_SCALE) || "100", 10);

  // Apply saved theme / scale immediately
  if (savedTheme === "light" || savedTheme === "dark") {
    html.setAttribute("data-theme", savedTheme);
  }
  setScale(clamp(savedScale, 85, 140));

  // --- Markup (no inline styles) ---
  slot.innerHTML = `
<header class="site-header">
  <div class="header-inner">
    <a class="brand" href="index.html">
      <img class="site-logo" src="library/images/kingdom-connects-logo-300.png" alt="Kingdom Connects Logo" width="48" height="48">
      <span class="site-title">Kingdom Connects</span>
    </a>

    <nav class="nav-wrap">
      <button class="menu-toggle" id="kc-menu-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="kc-nav">
        <span class="bar"></span><span class="bar"></span><span class="bar"></span>
      </button>

      <ul class="nav-links" id="kc-nav" aria-label="Main Navigation">
        <li><a href="church_directory.html">Churches</a></li>
        <li><a href="business.html">Businesses</a></li>
        <li><a href="submit_business.html">Submit</a></li>
      </ul>
    </nav>

    <div class="header-actions">
      <button class="gear-toggle" id="kc-gear" aria-haspopup="true" aria-expanded="false" aria-controls="kc-controls" title="Display settings">⚙️</button>
      <div class="user-controls" id="kc-controls" hidden>
        <div class="ctrl-row">
          <button class="ctrl-btn" id="kc-font-dec" title="Smaller text" aria-label="Decrease text size">A−</button>
          <span class="ctrl-readout" id="kc-font-readout">100%</span>
          <button class="ctrl-btn" id="kc-font-inc" title="Larger text" aria-label="Increase text size">A+</button>
        </div>
        <div class="ctrl-row">
          <button class="ctrl-btn" id="kc-theme-toggle" title="Toggle light/dark" aria-label="Toggle theme">🌙/🌞</button>
        </div>
      </div>
    </div>
  </div>
</header>
`;

  // --- Menu toggle (hamburger) ---
  const menuBtn = document.getElementById("kc-menu-toggle");
  const nav = document.getElementById("kc-nav");
  if (menuBtn && nav) {
    let open = false;
    const set = (v) => {
      open = v;
      menuBtn.setAttribute("aria-expanded", v ? "true" : "false");
      nav.classList.toggle("open", v); // your CSS should show/hide based on .open
    };
    menuBtn.addEventListener("click", () => set(!open));
    document.addEventListener("click", (e) => {
      if (!open) return;
      if (e.target.closest("#kc-menu-toggle") || e.target.closest("#kc-nav")) return;
      set(false);
    });
  }

  // --- Gear panel (display controls) ---
  const gearBtn = document.getElementById("kc-gear");
  const panel = document.getElementById("kc-controls");
  if (gearBtn && panel) {
    let open = false;
    const set = (v) => {
      open = v;
      gearBtn.setAttribute("aria-expanded", v ? "true" : "false");
      panel.hidden = !v;
    };
    gearBtn.addEventListener("click", () => set(!open));
    document.addEventListener("click", (e) => {
      if (!open) return;
      if (e.target.closest("#kc-gear") || e.target.closest("#kc-controls")) return;
      set(false);
    });
  }

  // --- Text size controls ---
  const readout = document.getElementById("kc-font-readout");
  const btnInc = document.getElementById("kc-font-inc");
  const btnDec = document.getElementById("kc-font-dec");

  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
  function setScale(pct) {
    const val = clamp(parseInt(pct || "100", 10), 85, 140);
    document.documentElement.style.fontSize = val + "%"; // global base size
    if (readout) readout.textContent = val + "%";
    localStorage.setItem(LS_SCALE, String(val));
  }

  if (btnInc) btnInc.addEventListener("click", () => setScale((parseInt(localStorage.getItem(LS_SCALE) || "100", 10)) + 10));
  if (btnDec) btnDec.addEventListener("click", () => setScale((parseInt(localStorage.getItem(LS_SCALE) || "100", 10)) - 10));

  // --- Theme toggle (light/dark) ---
  const themeBtn = document.getElementById("kc-theme-toggle");
  function setTheme(t) {
    const val = (t === "dark") ? "dark" : "light";
    html.setAttribute("data-theme", val);
    localStorage.setItem(LS_THEME, val);
  }
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = (html.getAttribute("data-theme") === "dark") ? "dark" : "light";
      setTheme(current === "dark" ? "light" : "dark");
    });
  }
})();
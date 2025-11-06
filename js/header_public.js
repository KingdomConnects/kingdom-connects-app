// Public header with top-right gear (icon only) + mobile hamburger (relative paths only)
(function () {
  var slot = document.getElementById("header");
  if (!slot) return;

  // Persist keys
  var LS_THEME = "kc_theme";
  var LS_SCALE = "kc_font_scale"; // 85–140

  // Apply saved settings immediately
  var html = document.documentElement;
  var theme = localStorage.getItem(LS_THEME);
  if (theme === "light" || theme === "dark") html.setAttribute("data-theme", theme);
  var scale = parseInt(localStorage.getItem(LS_SCALE) || "100", 10);
  if (!Number.isFinite(scale)) scale = 100;
  scale = Math.max(85, Math.min(140, scale));
  html.style.fontSize = scale + "%";

  // Header markup
  slot.innerHTML = `
<header class="site-header" role="banner">
  <div class="header-inner">
    <a class="brand" href="index.html">
      <img class="site-logo" src="library/images/kingdom-connects-logo-300.png" alt="Kingdom Connects Logo" width="48" height="48">
      <span class="site-title">Kingdom Connects</span>
    </a>

    <ul class="nav-links" id="kc-nav" aria-label="Main Navigation">
      <li><a href="church_directory.html">Churches</a></li>
      <li><a href="business.html">Businesses</a></li>
      <li><a href="submit_business.html">Submit</a></li>
    </ul>

    <!-- Fixed top-right stack -->
    <div class="actions-stack" id="kc-actions">
      <button class="gear-toggle" id="kc-gear" aria-haspopup="true" aria-expanded="false" aria-controls="kc-controls" type="button">
        <span class="gear-icon" aria-hidden="true">⚙️</span>
      </button>

      <button class="menu-toggle" id="kc-menu-toggle" aria-label="Menu" aria-expanded="false" aria-controls="kc-nav" type="button">
        <span class="bar"></span><span class="bar"></span><span class="bar"></span>
      </button>

      <div class="user-controls" id="kc-controls" hidden>
        <div class="ctrl-row">
          <button class="ctrl-btn" id="kc-font-dec" type="button" aria-label="Smaller text">A−</button>
          <span class="ctrl-readout" id="kc-font-readout">` + scale + `%</span>
          <button class="ctrl-btn" id="kc-font-inc" type="button" aria-label="Larger text">A+</button>
        </div>
        <div class="ctrl-row">
          <button class="ctrl-btn" id="kc-theme-toggle" type="button" aria-label="Toggle theme">🌙/🌞</button>
        </div>
      </div>
    </div>
  </div>
</header>
`;

  // Hamburger (mobile; CSS hides on desktop)
  var btn = document.getElementById("kc-menu-toggle");
  var nav = document.getElementById("kc-nav");
  if (btn && nav) {
    var open = false;
    function set(v){ open=v; btn.setAttribute("aria-expanded", v?"true":"false"); nav.classList.toggle("open", v); }
    btn.addEventListener("click", function(){ set(!open); });
    document.addEventListener("click", function(e){
      if(!open) return;
      if(e.target.closest("#kc-menu-toggle") || e.target.closest("#kc-nav")) return;
      set(false);
    });
  }

  // Gear dropdown
  var gear = document.getElementById("kc-gear");
  var panel = document.getElementById("kc-controls");
  if (gear && panel) {
    var gopen = false;
    function gset(v){ gopen=v; gear.setAttribute("aria-expanded", v?"true":"false"); panel.hidden = !v; }
    gear.addEventListener("click", function(){ gset(!gopen); });
    document.addEventListener("click", function(e){
      if(!gopen) return;
      if(e.target.closest("#kc-gear") || e.target.closest("#kc-controls")) return;
      gset(false);
    });
  }

  // Font size controls
  function setScale(val){
    val = Math.max(85, Math.min(140, parseInt(val,10)||100));
    html.style.fontSize = val + "%";
    localStorage.setItem(LS_SCALE, String(val));
    var r = document.getElementById("kc-font-readout");
    if (r) r.textContent = val + "%";
    scale = val;
  }
  var inc = document.getElementById("kc-font-inc");
  var dec = document.getElementById("kc-font-dec");
  if (inc) inc.addEventListener("click", function(){ setScale(scale + 10); });
  if (dec) dec.addEventListener("click", function(){ setScale(scale - 10); });

  // Theme toggle
  var themeBtn = document.getElementById("kc-theme-toggle");
  function setTheme(t){ html.setAttribute("data-theme", t); localStorage.setItem(LS_THEME, t); }
  if (themeBtn) themeBtn.addEventListener("click", function(){
    var curr = html.getAttribute("data-theme") === "dark" ? "dark" : "light";
    setTheme(curr === "dark" ? "light" : "dark");
  });
})();
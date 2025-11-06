/* Kingdom Connects — Working Header/Footer Components (clean + relative)
   ---------------------------------------------------------
   • Injects shared header/footer on all public pages
   • Skips /admin/ pages
   • Works with <script defer> at bottom of HTML
*/

(() => {
  const path = location.pathname;
  if (path.includes("/admin/")) return;

  const inject = () => {
    // ----- HEADER -----
    const header = document.getElementById("header");
    if (header) {
      header.innerHTML = `
<header class="header site-header" role="banner">
  <div class="header-inner">
    <a class="brand" href="index.html" aria-label="Home">
      <img class="site-logo"
           src="library/images/kingdom-connects-logo-300.png"
           alt="Kingdom Connects Logo" width="48" height="48"
           onerror="this.onerror=null;this.src='library/images/logo-fallback.png';">
      <h1 class="site-title">Kingdom Connects</h1>
    </a>

    <ul class="nav-links" aria-label="Main Navigation">
      <li><a href="church_directory.html">Churches</a></li>
      <li><a href="business.html">Businesses</a></li>
      <li><a href="submit_business.html">Submit</a></li>
    </ul>

    <div class="header-actions">
      <a class="back-to-top" href="admin/index.html">Admin</a>
    </div>
  </div>
</header>`;
    }

    // ----- FOOTER -----
    const footer = document.getElementById("footer");
    if (footer) {
      footer.innerHTML = `
<footer class="footer site-footer" role="contentinfo">
  <div class="footer-inner">
    <nav class="footer-nav" aria-label="Footer">
      <a href="index.html">Home</a>
      <a href="business.html">Businesses</a>
      <a href="submit_business.html">Submit</a>
    </nav>
    <a href="#top" class="back-to-top">↑ Back to Top</a>
    <div class="socials" aria-hidden="true">
      <span class="social-btn">KC</span>
    </div>
    <p class="dim">© <span id="year"></span> Kingdom Connects</p>
  </div>
</footer>`;
    }

    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject, { once: true });
  } else {
    inject();
  }
})();
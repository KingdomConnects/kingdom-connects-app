// Public header (clean + relative)
(function () {
  const el = document.getElementById("header");
  if (!el) return;
  el.innerHTML = `
<header class="site-header">
  <div class="header-inner">
    <a class="brand" href="index.html">
      <img class="site-logo" src="library/images/kingdom-connects-logo-300.png" alt="Kingdom Connects Logo" width="48" height="48">
      <span class="site-title">Kingdom Connects</span>
    </a>
    <nav class="nav-links">
      <a href="church_directory.html">Churches</a>
      <a href="business.html">Businesses</a>
      <a href="submit_business.html">Submit</a>
    </nav>
  </div>
</header>`;
})();
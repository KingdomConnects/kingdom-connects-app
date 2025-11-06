// Public footer (clean + relative)
(function () {
  const el = document.getElementById("footer");
  if (!el) return;
  el.innerHTML = `
<footer class="site-footer">
  <div class="footer-inner">
    <nav class="footer-nav">
      <a href="index.html">Home</a>
      <a href="business.html">Businesses</a>
      <a href="submit_business.html">Submit</a>
    </nav>
    <p>© ${new Date().getFullYear()} Kingdom Connects</p>
  </div>
</footer>`;
})();
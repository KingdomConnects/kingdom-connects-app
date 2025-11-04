document.addEventListener("DOMContentLoaded", () => {
  // ---- Header ----
  const headerMount = document.getElementById("header");
  headerMount.innerHTML = `
    <header class="site-header">
      <div class="header-inner">
        <img src="img/kingdom-connects-logo.png" alt="Kingdom Connects" class="logo" />
        <nav class="navbar">
          <ul class="nav-links">
            <li><a href="index.html" class="active">Home</a></li>
            <li><a href="business.html">Business Directory</a></li>
            <li><a href="about.html">About</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </nav>
        <button class="menu-toggle" aria-label="Toggle menu">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </button>
      </div>
    </header>
  `;

  // ---- Footer ----
  const year = new Date().getFullYear();
  const footerMount = document.getElementById("footer");
  footerMount.innerHTML = `
    <footer class="site-footer">
      <p>© ${year} Kingdom Connects. All rights reserved.</p>
    </footer>
  `;

  // ---- Mobile menu toggle ----
  const toggleBtn = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });

    // Close menu after a link click (better UX)
    navLinks.querySelectorAll("a").forEach(a =>
      a.addEventListener("click", () => navLinks.classList.remove("active"))
    );
  }
});
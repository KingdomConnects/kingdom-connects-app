/* Kingdom Connects Admin Include System
   Dynamically loads admin_header.html into #admin-header on all /admin/* pages.
   Author: Ghost for Stone Soup
*/

(async () => {
  // Run only on /admin/* pages
  if (!location.pathname.startsWith("/admin/")) return;

  // Helper: run after DOM ready
  const onReady = (fn) =>
    document.readyState !== "loading"
      ? fn()
      : document.addEventListener("DOMContentLoaded", fn, { once: true });

  onReady(async () => {
    try {
      // 1. Find or create the target container
      let container = document.getElementById("admin-header");
      if (!container) {
        container = document.createElement("div");
        container.id = "admin-header";
        document.body.prepend(container);
      }

      // 2. Load the header file (root-corrected path)
      const response = await fetch("./admin_header.html", { cache: "no-cache" });

      if (!response.ok) {
        console.error(`[Admin Components] Failed to fetch admin_header.html: ${response.status}`);
        return;
      }

      // 3. Inject HTML
      const html = await response.text();
      container.innerHTML = html;

      // 4. Optional: mark the page as admin
      document.body.classList.add("is-admin");

      console.log("[Admin Components] Header injected successfully ✅");
    } catch (err) {
      console.error("[Admin Components] Error loading header:", err);
    }
  });
})();
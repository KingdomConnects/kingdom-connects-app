// /admin-js/admin_components.js  (ES module)

// ---------- 1) Inject shared admin header ----------
(async () => {
  try {
    // This file lives in /admin-js/, header lives in /admin/
    const res = await fetch('../admin/admin_header.html', { cache: 'no-cache' });
    const headerHTML = await res.text();
    const mount = document.getElementById('admin-header');
    if (mount) mount.innerHTML = headerHTML;
  } catch (err) {
    console.error('Admin header load failed:', err);
  }
})();

// ---------- 2) Auth guard (requires role: 'admin') ----------
(async () => {
  try {
    // Expect a global config; define one on the page if you don't already.
    const cfg = window.KC_FIREBASE_CONFIG;
    if (!cfg) console.warn('KC_FIREBASE_CONFIG missing. Define it on the page or a shared config.');

    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js');
    const { getAuth, onAuthStateChanged, signOut } = await import('https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js');
    const { getFirestore, doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js');

    const app = initializeApp(cfg || {});
    const auth = getAuth(app);
    const db = getFirestore(app);
    const redirectHome = () => (window.location.href = '../index.html');

    onAuthStateChanged(auth, async (user) => {
      if (!user) return redirectHome();
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        const role = snap.exists() ? (snap.data().role || 'member') : 'member';
        if (role !== 'admin') return redirectHome();
      } catch (e) {
        console.error('Role check failed', e);
        return redirectHome();
      }
    });

    // Wire Sign out after header arrives
    const waitForHeader = new MutationObserver(() => {
      const btn = document.getElementById('adminSignOut');
      if (btn) {
        btn.onclick = async () => {
          try { await signOut(auth); } catch {}
          redirectHome();
        };
        waitForHeader.disconnect();
      }
    });
    waitForHeader.observe(document.body, { childList: true, subtree: true });

  } catch (err) {
    console.error('Admin guard init failed:', err);
    // Optional fallback:
    // window.location.href = '../index.html';
  }
})();
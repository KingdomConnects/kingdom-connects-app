/* kc_path.js — path/admin detector (load this BEFORE components.js)
   Exposes:
     window.KC_BASE = './' | '../'
     window.KC_IS_ADMIN = boolean
*/
(() => {
  try {
    const isAdmin = /(^|\/)admin(\/|$)/i.test(location.pathname);
    const base = isAdmin ? '../' : './';
    // Publish once (don’t overwrite if already set)
    if (typeof window.KC_IS_ADMIN === 'undefined') window.KC_IS_ADMIN = isAdmin;
    if (typeof window.KC_BASE === 'undefined') window.KC_BASE = base;
    // Marker
    window.KC_PATH_OK = true;
    // console.log('[KC path]', { base, isAdmin, path: location.pathname });
  } catch (_) {
    // If something odd happens, leave globals unset (components.js has fallback)
  }
})();
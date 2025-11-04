/* kc_path.js — path/admin detector (load BEFORE components.js)
   Exposes:
     window.KC_BASE = './' | '../'
     window.KC_IS_ADMIN = boolean
*/
(() => {
  const isAdmin = /(^|\/)admin(\/|$)/i.test(location.pathname);
  const base = isAdmin ? '../' : './';
  if (typeof window.KC_IS_ADMIN === 'undefined') window.KC_IS_ADMIN = isAdmin;
  if (typeof window.KC_BASE === 'undefined') window.KC_BASE = base;
  window.KC_PATH_OK = true;
})();
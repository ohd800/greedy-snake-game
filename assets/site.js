/* ==========================================================================
   dhh5.com — shared behaviour
   - copy-to-clipboard with toast feedback
   - keep input state in the URL (?v=...) so results are shareable/bookmarkable
   - announce results to screen readers via aria-live (markup sets aria-live)
   No dependencies. Loaded with `defer`.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Toast ---------- */
  var toastEl = null;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { toastEl.classList.remove('show'); }, 1800);
  }
  window.dhToast = toast;

  /* ---------- Copy to clipboard ---------- */
  // Any element with [data-copy-target="#id"] copies that element's text.
  // Falls back to a hidden textarea for non-secure contexts (http).
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '-1000px';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy') ? resolve() : reject(new Error('copy failed'));
      } catch (e) { reject(e); }
      document.body.removeChild(ta);
    });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-copy-target]');
    if (!btn) return;
    var target = document.querySelector(btn.getAttribute('data-copy-target'));
    if (!target) return;
    var text = (target.value !== undefined) ? target.value : target.textContent;
    if (!text || !text.trim()) { toast('Nothing to copy yet'); return; }
    copyText(text.trim()).then(
      function () { toast('Copied'); },
      function () { toast('Copy failed — select manually'); }
    );
  });

  /* ---------- Result helper ---------- */
  // Write into a result box; adds .error styling when isError is true.
  window.dhResult = function (id, text, isError) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    el.classList.toggle('error', !!isError);
  };

  /* ---------- URL state ---------- */
  // dhUrlState(key, onRead) -> { save(value), get() }
  // Keeps ?key=value in sync so a calculation can be shared or bookmarked.
  window.dhUrlState = function (key, onRead) {
    var params = new URLSearchParams(location.search);
    function get() { return params.get(key); }
    function save(value) {
      if (value === '' || value === null || value === undefined) params.delete(key);
      else params.set(key, value);
      var qs = params.toString();
      history.replaceState(null, '', qs ? '?' + qs : location.pathname);
    }
    var initial = get();
    if (initial !== null && typeof onRead === 'function') onRead(initial);
    return { get: get, save: save };
  };

  /* ---------- Number formatting ---------- */
  // Trim trailing zeros without wrecking integers: 12.5000 -> 12.5
  window.dhTrim = function (numStr) {
    return String(numStr).replace(/\.?0+$/, function (m) {
      return m.indexOf('.') === 0 ? '' : m;
    });
  };
})();

/* =====================================================================
   SAFE — small security helpers (following the OWASP XSS & CSP cheat sheets).
   - text from visitors is only ever inserted with textContent
   - links from data.js are checked against an allow-list of URL types
   - CSS variables are set through the CSSOM (no inline style="" needed,
     so the Content Security Policy can block inline styles)
   ===================================================================== */
window.SAFE = (() => {
  // HTML-escape for text placed into templates built from js/data.js
  const esc = (s) => String(s ?? "").replace(/[&<>"'`=/]/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "`": "&#96;", "=": "&#61;", "/": "&#47;",
  }[c]));

  // Only allow http(s), mailto, and relative links. Blocks javascript:, data:, vbscript: …
  const ALLOWED = new Set(["http:", "https:", "mailto:"]);
  function url(u) {
    const s = String(u ?? "").trim();
    if (!s) return "";
    const scheme = s.match(/^([a-z][a-z0-9+.-]*):/i);
    if (!scheme) return /^[\w./#?=&%-]+$/.test(s) ? s : ""; // relative path like assets/cv.pdf
    try { return ALLOWED.has(new URL(s).protocol) ? s : ""; } catch { return ""; }
  }

  // plain addresses only: no spaces, quotes, ? or & (so nothing can be smuggled into a mailto: link)
  const email = (e) => /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(String(e ?? "").trim()) ? String(e).trim() : "";

  // data-hue="20" → --hue: 20   (only these names, only numbers)
  const VARS = { i: ["--i", ""], hue: ["--hue", ""], h: ["--h", "%"], w: ["--w", "%"] };
  function vars(root) {
    root.querySelectorAll("[data-i],[data-hue],[data-h],[data-w]").forEach((el) => {
      for (const [key, [prop, unit]] of Object.entries(VARS)) {
        if (!(key in el.dataset)) continue;
        const n = Number(el.dataset[key]);
        if (Number.isFinite(n)) el.style.setProperty(prop, n + unit);
      }
    });
    return root;
  }

  // build DOM from parts: strings become text nodes, nodes are appended as-is
  function frag(...parts) {
    const f = document.createDocumentFragment();
    parts.forEach((p) => f.append(p instanceof Node ? p : document.createTextNode(String(p))));
    return f;
  }
  function el(tag, text = "", className = "") {
    const e = document.createElement(tag);
    if (className) e.className = className;
    e.textContent = text;
    return e;
  }

  return { esc, url, email, vars, frag, el };
})();

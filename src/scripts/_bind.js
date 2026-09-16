// tiny binding helper for the data-driven mocks
export function get(o, p) { return p.split('.').reduce((a, k) => (a == null ? a : a[k]), o); }
export function bind(root, vals) {
  root.querySelectorAll('[data-b]').forEach(el => { const v = get(vals, el.dataset.b); if (v != null) el.textContent = v; });
  root.querySelectorAll('[data-val]').forEach(el => { const v = get(vals, el.dataset.val); if (v != null && String(el.value) !== String(v)) el.value = v; });
  root.querySelectorAll('[data-cls]').forEach(el => { const v = get(vals, el.dataset.cls); el.classList.toggle('on', v === 'on'); });
}
export function wire(root, handlers) {
  root.querySelectorAll('[data-act]').forEach(el => {
    const h = handlers[el.dataset.act]; if (!h) return;
    const ev = el.tagName === 'INPUT' ? 'input' : 'click';
    el.addEventListener(ev, h);
  });
}
export const fmtIN = n => n.toLocaleString('en-IN');
export function typeInto(el, text, done, speed = 28) {
  el.textContent = ''; let i = 0;
  const t = setInterval(() => { el.textContent = text.slice(0, ++i); if (i >= text.length) { clearInterval(t); done && done(); } }, speed);
}
export function stagger(els, gap = 380) {
  els.forEach((el, i) => { el.classList.add('hidden'); setTimeout(() => { el.classList.remove('hidden'); el.classList.add('reveal'); }, i * gap); });
}

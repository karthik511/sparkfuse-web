import { stagger } from './_bind.js';
// Turns the fake WhatsApp composer into a real one. onSend(text) returns nothing; caller mutates the panel.
export function makeComposer(wa, onSend, placeholder = 'Type a message…') {
  const bar = wa.querySelector('.in') || wa.lastElementChild; if (!bar) return null; bar.classList.add('in');
  bar.innerHTML = `<input class="f" type="text" placeholder="${placeholder}" aria-label="Message" style="border: 0; outline: none; font-family: inherit;" /><button type="submit" aria-label="Send" style="width: 36px; height: 36px; border-radius: 50%; background: #075E54; border: 0; cursor: pointer; display: flex; align-items: center; justify-content: center;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg></button>`;
  const form = document.createElement('form'); form.style.cssText = 'display:contents';
  bar.parentNode.insertBefore(form, bar); form.appendChild(bar);
  const input = bar.querySelector('input');
  const send = () => { const t = input.value.trim(); if (!t) return; input.value = ''; onSend(t); };
  form.addEventListener('submit', e => { e.preventDefault(); send(); });
  input.addEventListener('keydown', e => { if (e.key === 'Enter' || e.code === 'Enter' || e.code === 'NumpadEnter' || e.keyCode === 13) { e.preventDefault(); send(); } });
  return input;
}
export function bubble(wa, text, me = true, meta = '') {
  const msgs = wa.querySelector('.msgs'); const b = document.createElement('div');
  b.className = 'bub' + (me ? ' me' : '') + ' reveal'; b.innerHTML = `${escape(text)}<div class="m">${meta}</div>`;
  msgs.appendChild(b); msgs.scrollTop = msgs.scrollHeight; return b;
}
export function typing(wa, ms = 900) {
  const b = bubble(wa, '…', false, 'typing'); return new Promise(r => setTimeout(() => { b.remove(); r(); }, ms));
}
export const now = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
export function escape(s) { return s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }
export { stagger };

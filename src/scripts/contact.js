// Contact form → mailto + WhatsApp (staging). Replace with an endpoint at launch.
const box = document.querySelector('.fld')?.closest('[style*="border: 1.5px solid #1B1B1B"]'); if (box) {
  const F = [['name', 'Your name', 'text'], ['business', 'Business and city', 'text'], ['team', 'Team size', 'select'], ['pain', 'The workflow costing you the most right now', 'textarea'], ['phone', 'Phone / WhatsApp', 'tel']];
  const form = document.createElement('form'); form.style.cssText = 'display:flex;flex-direction:column;gap:14px'; form.setAttribute('aria-label', 'Contact form');
  const css = 'width:100%;height:46px;background:#fff;border:1px solid #B9B8B0;padding:0 12px;font:14px Poppins,sans-serif;color:#1B1B1B;border-radius:0';
  form.innerHTML = F.map(([k, l, t]) => `<div class="fld"><label for="c-${k}">${l}</label>${t === 'textarea' ? `<textarea id="c-${k}" name="${k}" required style="${css};height:110px;padding:12px;resize:vertical"></textarea>` : t === 'select' ? `<select id="c-${k}" name="${k}" style="${css}"><option>1–10</option><option>10–50</option><option selected>50–200</option><option>200–1,000</option><option>1,000+</option></select>` : `<input id="c-${k}" name="${k}" type="${t}" ${k !== 'business' ? 'required' : ''} style="${css}" />`}</div>`).join('') +
    `<input type="hidden" name="searched" id="c-searched" /><div style="display:flex;align-items:center;gap:12px;margin-top:4px;flex-wrap:wrap"><button type="submit" class="btn" style="border:0;cursor:pointer">Send</button><a class="mono" data-wa href="#" target="_blank" rel="noopener">or message us on WhatsApp</a></div><div class="mono" style="font-size:9.5px">No newsletter, no sales sequence. One human reply.</div><div data-ok class="hidden" style="background:#E7F3EC;color:#2E7D4F;padding:10px 12px;font-size:13.5px">Thanks — your email client should have opened with the message. If it didn't, WhatsApp us instead.</div>`;
  box.replaceChildren(form);
  try { document.getElementById('c-searched').value = document.referrer || ''; } catch (e) {}
  const WA = document.body.dataset.wa || ''; const TO = document.body.dataset.email || 'business@sparkfuse.in';
  const wa = form.querySelector('[data-wa]'); wa.href = WA ? `https://wa.me/${WA}` : '#';
  form.addEventListener('submit', e => { e.preventDefault(); const d = Object.fromEntries(new FormData(form)); const body = `Business: ${d.business}\nTeam: ${d.team}\nPhone: ${d.phone}\n\nThe workflow that hurts:\n${d.pain}`; const subject = `Process that hurts — ${d.name}`;
    if (WA) wa.href = `https://wa.me/${WA}?text=${encodeURIComponent(subject + '\n' + body)}`;
    window.location.href = `mailto:${TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`; form.querySelector('[data-ok]').classList.remove('hidden'); });
}

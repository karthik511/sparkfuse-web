// Contact form → posts to FormSubmit (AJAX), which emails business@sparkfuse.in. No mail client, no page reload.
// First-ever submission triggers a one-time activation email to the inbox; after that every submission is delivered.
const box = document.querySelector('.fld')?.closest('[style*="border: 1.5px solid #1B1B1B"]'); if (box) {
  const TO = document.body.dataset.email || 'business@sparkfuse.in'; const WA = document.body.dataset.wa || '';
  const F = [['name', 'Your name', 'text'], ['business', 'Business and city', 'text'], ['team', 'Team size', 'select'], ['pain', 'The workflow costing you the most right now', 'textarea'], ['phone', 'Phone / WhatsApp', 'tel'], ['email', 'Email (optional)', 'email']];
  const form = document.createElement('form'); form.style.cssText = 'display:flex;flex-direction:column;gap:14px'; form.setAttribute('aria-label', 'Contact form'); form.noValidate = false;
  const css = 'width:100%;height:46px;background:#fff;border:1px solid #B9B8B0;padding:0 12px;font:14px Poppins,sans-serif;color:#1B1B1B;border-radius:0';
  form.innerHTML = F.map(([k, l, t]) => `<div class="fld"><label for="c-${k}">${l}</label>${t === 'textarea' ? `<textarea id="c-${k}" name="${k}" required style="${css};height:110px;padding:12px;resize:vertical"></textarea>` : t === 'select' ? `<select id="c-${k}" name="${k}" style="${css}"><option>1–10</option><option>10–50</option><option selected>50–200</option><option>200–1,000</option><option>1,000+</option></select>` : `<input id="c-${k}" name="${k}" type="${t}" ${['name', 'phone', 'pain'].includes(k) ? 'required' : ''} style="${css}" />`}</div>`).join('') +
    `<input type="text" name="_honey" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true" /><input type="hidden" name="page" id="c-page" /><div style="display:flex;align-items:center;gap:12px;margin-top:4px;flex-wrap:wrap"><button type="submit" class="btn" style="border:0;cursor:pointer" data-send>Send</button><a class="mono" data-wa href="#" target="_blank" rel="noopener">or message us on WhatsApp</a></div><div class="mono" style="font-size:9.5px">No newsletter, no sales sequence. One human reply within a business day.</div><div data-ok class="hidden" style="background:#E7F3EC;color:#2E7D4F;padding:12px 14px;font-size:14px;line-height:1.5"></div><div data-err class="hidden" style="background:#FDECEA;color:#B92F20;padding:12px 14px;font-size:14px;line-height:1.5"></div>`;
  box.replaceChildren(form);
  try { document.getElementById('c-page').value = location.href + (document.referrer ? ' · from ' + document.referrer : ''); } catch (e) {}
  const wa = form.querySelector('[data-wa]'), ok = form.querySelector('[data-ok]'), err = form.querySelector('[data-err]'), send = form.querySelector('[data-send]');
  wa.href = WA ? `https://wa.me/${WA}` : '#';
  const summary = d => `Business: ${d.business || '—'}\nTeam: ${d.team}\nPhone: ${d.phone}\nEmail: ${d.email || '—'}\n\nThe workflow that hurts:\n${d.pain}`;
  form.addEventListener('submit', async e => {
    e.preventDefault(); if (!form.reportValidity()) return; const d = Object.fromEntries(new FormData(form)); if (d._honey) return;
    ok.classList.add('hidden'); err.classList.add('hidden'); send.disabled = true; send.textContent = 'Sending…';
    if (WA) wa.href = `https://wa.me/${WA}?text=${encodeURIComponent(`Enquiry from ${d.name}\n` + summary(d))}`;
    const payload = { name: d.name, business: d.business, team: d.team, phone: d.phone, email: d.email, pain: d.pain, page: d.page, _subject: `Website enquiry — ${d.name}${d.business ? ' · ' + d.business : ''}`, _template: 'table', _captcha: 'false', _replyto: d.email || undefined };
    try {
      const r = await fetch(`https://formsubmit.co/ajax/${TO}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
      const j = await r.json().catch(() => ({}));
      if (r.ok && (j.success === 'true' || j.success === true)) { ok.innerHTML = `<b>Sent.</b> Thanks, ${d.name.split(' ')[0]} — you'll hear from us within a business day. Faster: <a href="${wa.href}" target="_blank" rel="noopener">WhatsApp us</a>.`; ok.classList.remove('hidden'); form.reset(); send.textContent = 'Sent ✓'; }
      else throw new Error(j.message || 'Could not send');
    } catch (x) {
      err.innerHTML = `<b>That didn't go through.</b> Please <a href="${wa.href}" target="_blank" rel="noopener">send it on WhatsApp</a> — your message is pre-filled — or email <a href="mailto:${TO}">${TO}</a>.`; err.classList.remove('hidden'); send.disabled = false; send.textContent = 'Try again';
    }
  });
}

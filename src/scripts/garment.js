const rows = [...document.querySelectorAll('.gr')].slice(1); const etds = [...document.querySelectorAll('.etd')]; const legend = document.querySelector('.gr')?.parentElement; const kv = [...document.querySelectorAll('.kv')]; const tag = document.querySelector('.kv')?.parentElement?.querySelector('.tag');
if (legend && etds.length) {
  const ctl = document.createElement('div'); ctl.style.cssText = 'display:flex;align-items:center;gap:12px;padding:6px 0 10px;border-bottom:1px solid #ECEBE5;margin-bottom:4px';
  ctl.innerHTML = `<span class="mono" style="font-size:9.5px">Drag the ETD</span><input type="range" min="-10" max="14" step="1" value="7" aria-label="ETD offset in days" style="flex:1;accent-color:#D93A2B"><b style="font-size:12px;min-width:60px" data-etd>12 Oct</b>`;
  legend.insertBefore(ctl, legend.firstChild);
  const inp = ctl.querySelector('input'); const lab = ctl.querySelector('[data-etd]'); const newBars = rows.map(r => r.querySelectorAll('.bar:not(.old)')[0]).filter(Boolean);
  const base = newBars.map(b => parseFloat(b.style.left)); const pxPerDay = 100 / 56; // 8 weeks across the track
  const paint = () => { const off = parseInt(inp.value, 10); const d = new Date(2026, 9, 5 + off); lab.textContent = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    etds.forEach(e => e.style.left = (82 + (off - 7) * pxPerDay) + '%'); newBars.forEach((b, i) => { if (b.classList.contains('done')) return; b.style.left = (base[i] + (off - 7) * pxPerDay) + '%'; });
    const last = newBars[newBars.length - 1]; const risk = off < 5; last?.classList.toggle('late', off <= 9); if (tag) { tag.textContent = risk ? 'ETD at risk' : off <= 9 ? '1 at risk' : 'On plan'; tag.className = 'tag ' + (risk ? 'r' : off <= 9 ? 'r' : 'g'); }
    if (kv[0]) kv[0].lastElementChild.innerHTML = `ETD ${lab.textContent} · back-scheduled from handover`; if (kv[2]) kv[2].lastElementChild.textContent = risk ? 'Handover lands after ETD — buyer must be told today' : off <= 9 ? 'Handover lands 2 days before ETD — under the 5-day buffer' : 'Buffer restored — 5+ days between handover and ETD'; };
  inp.addEventListener('input', paint); paint();
}

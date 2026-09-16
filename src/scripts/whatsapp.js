import { makeComposer, bubble, now, stagger } from './_chat.js';
const wa = document.querySelector('.wa'); const sys = document.querySelector('.sys'); if (wa && sys) {
  const typed = wa.querySelector('.bub[style*="border"]'); const secs = [...sys.querySelectorAll('.sec')]; const tag = sys.querySelector('.hd .tag');
  const MON = 'jan feb mar apr may jun jul aug sep oct nov dec'.split(' ');
  makeComposer(wa, text => {
    typed?.remove(); bubble(wa, text, true, now() + ' · you typed this');
    const m = text.match(/(\d{1,2})\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*/i);
    const d = m ? `${String(m[1]).padStart(2, '0')} ${m[2][0].toUpperCase() + m[2].slice(1, 3).toLowerCase()}` : null;
    const read = secs[0]?.querySelector('div:nth-child(2)');
    if (read) read.innerHTML = d ? `Buyer moved ETD from <b>05 Oct</b> to <b>${d}</b>. Reason inferred from the thread. No quantity change.` : `Read: “${text.slice(0, 80)}”. No date, quantity or price change detected — logged against PO 4471, no re-plan needed.`;
    if (tag) tag.textContent = (d ? 'Re-planned' : 'Logged') + ' · ' + now();
    if (d) { const news = secs[1]?.querySelectorAll('.row .new'); if (news) { const day = parseInt(m[1], 10); const mi = MON.indexOf(m[2].slice(0, 3).toLowerCase()); const f = (off) => { const dt = new Date(2026, mi, day - off); return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }); }; news[0].textContent = f(7); news[1].textContent = f(10); } }
    stagger(secs, 500);
  }, 'Try: “Delivery moved to 19 Oct”');
}

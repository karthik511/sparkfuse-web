import { bind, wire } from './_bind.js';
const root = document;
const s = { scope: 2, fast: false, cap: 2, commit: 3 };
const P = [null,
 { label: 'One workflow', lo: 1.5, hi: 3, wk: '3–5', i: ['Discovery: half a day, one team', 'One automation live on your real data', 'Hands-on rollout with the people who run it', 'One month of monitoring included'], ex: 'invoice intake into your ERP, or one WhatsApp automation' },
 { label: 'One process, end to end', lo: 3, hi: 6, wk: '5–8', i: ['Discovery: one day on your floor', 'The process redesigned, then 2–4 modules fitted', 'Rollout and training until the team runs it', 'Two months of monitoring against the agreed number'], ex: 'lead → AI first call → follow-up ladder → site visit, for a sales team' },
 { label: "One department's system", lo: 6, hi: 12, wk: '8–12', i: ['Discovery: two days, every role in the department', '4–6 modules and a dashboard, fitted', 'Data migration from sheets; rollout in two waves', 'Three months of monitoring, monthly review'], ex: 'inventory + traceability + vendor portal for a plant' },
 { label: 'Multi-department platform', lo: 12, hi: 25, wk: '12–20', i: ['Discovery: two days, 10–15 interviews, written map', '6–10 modules in three phases, each usable alone', 'Portals for customers or dealers; integrations (Tally, WhatsApp, telephony)', 'Six months of monitoring and quarterly re-planning'], ex: 'orders + production + dispatch + owner dashboards' },
 { label: 'The whole floor', lo: 25, hi: 45, wk: '20+', i: ['Discovery programme across every department', '10+ modules, phased over two to three quarters', 'Change management, training rota, SOPs', 'A year of monitoring; a retainer usually follows'], ex: 'a 10-module manufacturing programme, phased' }];
const R = [null,
 { label: 'Light', lo: 1.5, hi: 2.5, days: '2', i: ['Two founder days: one discovery/review, one on the floor', 'One builder part-time on the backlog', 'Monthly monitoring review of what is live', 'Priority answers on WhatsApp'], sla: 'same business day' },
 { label: 'Standard', lo: 3, hi: 5, days: '4', i: ['Four founder days across the month', 'One builder full-time', 'Fortnightly release; monthly numbers review', 'Process changes handled as they come, not queued'], sla: 'within 4 hours' },
 { label: 'Embedded', lo: 6, hi: 10, days: '8', i: ['Founder present two days a week', 'Two to three builders', 'Weekly releases; a standing roadmap', 'Your team trained to own what is built'], sla: 'within 1 hour, on-call for what is live' }];
const L = v => '₹' + (Math.round(v * 2) / 2).toString().replace(/\.0$/, '') + ' L';
function render() {
  const p = P[s.scope], m = s.fast ? 1.25 : 1;
  const r = R[s.cap], d = s.commit === 12 ? 0.85 : s.commit === 6 ? 0.92 : 1;
  const fr = v => '₹' + (Math.round(v * d * 10) / 10).toString().replace(/\.0$/, '') + ' L';
  bind(root, {
    proj: { value: s.scope, label: p.label, range: s.scope === 5 ? L(p.lo * m) + '+' : L(p.lo * m) + '–' + L(p.hi * m),
      weeks: s.fast ? p.wk.replace(/(\d+)/g, x => Math.max(2, Math.round(parseInt(x, 10) * 0.75))) : p.wk,
      i1: p.i[0], i2: p.i[1], i3: p.i[2], i4: p.i[3], example: p.ex, stdClass: s.fast ? '' : 'on', fastClass: s.fast ? 'on' : '' },
    ret: { value: s.cap, label: r.label, range: fr(r.lo) + '–' + fr(r.hi), days: r.days, i1: r.i[0], i2: r.i[1], i3: r.i[2], i4: r.i[3], sla: r.sla,
      c3: s.commit === 3 ? 'on' : '', c6: s.commit === 6 ? 'on' : '', c12: s.commit === 12 ? 'on' : '' }
  });
}
wire(root, {
  setScope: e => { s.scope = +e.target.value; render(); }, setStd: () => { s.fast = false; render(); }, setFast: () => { s.fast = true; render(); },
  setCap: e => { s.cap = +e.target.value; render(); }, setC3: () => { s.commit = 3; render(); }, setC6: () => { s.commit = 6; render(); }, setC12: () => { s.commit = 12; render(); }
});
render();

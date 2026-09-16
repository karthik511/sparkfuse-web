import { makeComposer, bubble, typing, now } from './_chat.js';
const wa = document.querySelector('.wa'); const panel = wa?.parentElement?.lastElementChild; if (wa && panel) {
  const typed = wa.querySelector('.bub[style*="border"]'); const evs = panel.querySelector('.ev')?.parentElement; const hdr = panel.querySelector('.tag');
  let answered = 3, handed = 1;
  const ev = (w, text, cls, lab) => { const d = document.createElement('div'); d.className = 'ev reveal'; d.innerHTML = `<div class="w">${w}</div><div>${text}</div><div class="tag ${cls}">${lab}</div>`; const anchor = panel.querySelector('.mono'); anchor?.parentElement?.insertBefore(d, anchor); };
  makeComposer(wa, async text => {
    typed?.remove(); bubble(wa, text, true, now() + ' · you typed this'); const t = text.toLowerCase();
    await typing(wa, 900);
    if (/kab|aayega|order|deliver|dispatch|track|status|pahunch/.test(t) && !/payment|rate|price/.test(t)) {
      bubble(wa, 'Gupta ji, order DO-26-1187 (₹1,86,400) dispatched aaj 14:10 se Agra warehouse, Sharma Transport, LR 44821. Expected delivery Thu 18 Sep. SWR 110 mm ke 12 pieces Kanpur se 19 Sep ko alag aayenge.', false, now() + ' · from the order book');
      ev(now(), 'Intent: delivery status · order DO-26-1187 recognised · dispatch record read', 'g', 'Answered'); answered++;
    } else if (/payment|paid|credit|bakaya|outstanding|ledger|hua/.test(t)) {
      bubble(wa, 'Haan — ₹1,52,300 received 12 Sep, receipt R-8812. Outstanding ab ₹0. Credit available ₹4.2 L.', false, now() + ' · from Tally');
      ev(now(), 'Intent: payment status · dealer ledger from Tally', 'g', 'Answered'); answered++;
    } else if (/rate|price|discount|scheme|kam|cheap|offer/.test(t)) {
      bubble(wa, 'Price ke baare mein main Vikram ko connect kar raha hoon — woh aapko 10 minute mein call karenge. Ticket bana diya.', false, now() + ' · handed to human');
      ev(now(), 'Intent: price negotiation → <b>not allowed to answer</b> (rule: pricing = human) · ticket to Vikram, SLA 15 min', 'r', 'Handoff'); handed++;
    } else if (/complain|problem|galat|broken|angry|bakwas|worst|call me|baat/.test(t)) {
      bubble(wa, 'Samajh gaya — main abhi Vikram ko yeh thread bhej raha hoon, woh 15 minute mein call karenge. Sorry for the trouble.', false, now() + ' · handed to human');
      ev(now(), 'Trigger: complaint / “call me” → human, thread attached, SLA 15 min', 'r', 'Handoff'); handed++;
    } else {
      bubble(wa, 'Yeh mujhe system mein nahi mila — main ek insaan ko connect kar raha hoon, woh 15 minute mein reply karenge.', false, now() + ' · not in the lookup');
      ev(now(), 'No lookup matched → handed over rather than guessed', 'k', 'Handoff'); handed++;
    }
    if (hdr) hdr.textContent = `${answered} answered · ${handed} handed over`;
  }, 'Try: “order kab aayega?” or “CPVC ka rate kam karo”');
}

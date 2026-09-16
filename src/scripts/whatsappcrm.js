import { makeComposer, bubble, typing, now, stagger } from './_chat.js';
const wa = document.querySelector('.wa'); const panel = wa?.parentElement?.lastElementChild; if (wa && panel) {
  const typed = wa.querySelector('.bub[style*="border"]'); const rows = [...panel.querySelectorAll('.kv')]; const lad = [...panel.querySelectorAll('.lad')];
  makeComposer(wa, async text => {
    typed?.remove(); bubble(wa, text, true, now() + ' · you typed this');
    const bhk = (text.match(/(\d)\s*bhk/i) || [])[1]; const bud = (text.match(/(\d{2,3})\s*(?:-|to|–)?\s*(\d{2,3})?\s*(?:l|lakh|lac)/i) || []);
    const loan = /loan|emi|finance/i.test(text); const when = (text.match(/(sunday|saturday|weekend|tomorrow|today|monday)/i) || [])[1];
    await typing(wa, 1000);
    bubble(wa, `Hi, thanks for writing in — yes, ${bhk ? bhk + ' BHK' : 'units'} at Vesu Heights are available${bud[1] ? ' in your range' : ''}, possession March 2027.${loan ? ' Our loan desk can help.' : ''} Would ${when ? when.toLowerCase() : 'this weekend'} work for a site visit? Kiran from our team will call you today.`, false, now() + ' · auto-reply, approved template');
    const set = (i, html) => { if (rows[i]) rows[i].lastElementChild.innerHTML = html; };
    set(0, `<b>New lead</b> · source: WhatsApp · ${now()}`);
    set(1, `${bhk ? bhk + ' BHK' : 'Unit'} · Vesu${bud[1] ? ' · budget ₹' + bud[1] + (bud[2] ? '–' + bud[2] : '') + ' L' : ''}${loan ? ' · loan needed' : ''}`);
    set(2, `Qualified → visit proposed${when ? ' · ' + when : ''} · owner Kiran`);
    set(3, 'Brochure and price sheet queued for send');
    set(4, `Kiran: call today before 6${loan ? ' · Rahul (loan): call Sat' : ''}`);
    stagger(rows.concat(lad), 260);
  }, 'Try: “2 BHK in Vesu, budget 80 lakh, loan possible?”');
}

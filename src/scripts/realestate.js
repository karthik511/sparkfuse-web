import { stagger } from './_bind.js';
const cols = [...document.querySelectorAll('.col')]; const lad = [...document.querySelectorAll('.lad')]; const head = document.querySelector('.lad')?.parentElement?.querySelector('[style*="font-weight: 600"]'); const hdrTag = document.querySelector('.lad')?.parentElement?.querySelector('.tag.g');
const NAMES = [['Aarav Shah', '3 BHK · ₹1.1 Cr · portal'], ['Meera Nair', '2 BHK · ₹78 L · walk-in'], ['Vikas Patel', '2 BHK · ₹82 L · broker']]; let n = 0;
if (cols.length) {
  const b = document.createElement('button'); b.type = 'button'; b.textContent = '+ Drop a new enquiry'; b.style.cssText = 'grid-column: 1 / -1; height: 40px; border: 1.5px dashed #D93A2B; background: #FFF7F5; color: #D93A2B; font: 600 12.5px Poppins, sans-serif; cursor: pointer; border-radius: 2px;';
  cols[0].parentElement.appendChild(b);
  b.addEventListener('click', () => { const [nm, d] = NAMES[n++ % 3]; const card = document.createElement('div'); card.className = 'lead new reveal'; card.innerHTML = `<div class="nm">${nm}</div><div>${d}</div><div class="m">${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })} · AI calling in 0:${String(Math.floor(10 + Math.random() * 20)).padStart(2, '0')}…</div><div><span class="tag r">First call</span></div>`;
    cols[0].insertBefore(card, cols[0].children[1]); const cnt = cols[0].querySelector('.h span:last-child'); cnt.textContent = String(parseInt(cnt.textContent, 10) + 1);
    if (head) head.textContent = `${nm} · what the system did`; if (hdrTag) hdrTag.textContent = 'Working…';
    stagger(lad, 420); setTimeout(() => { if (hdrTag) hdrTag.textContent = 'Hot · visit booked'; card.classList.remove('new'); card.querySelector('.m').textContent = 'called · 31 s · visit booked'; cols[2].insertBefore(card, cols[2].children[1]); const c2 = cols[2].querySelector('.h span:last-child'); c2.textContent = String(parseInt(c2.textContent, 10) + 1); cnt.textContent = String(parseInt(cnt.textContent, 10) - 1); }, lad.length * 420 + 400); });
}

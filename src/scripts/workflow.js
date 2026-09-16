import { stagger } from './_bind.js';
const tg = document.querySelector('.sw .tg'); const nodes = [...document.querySelectorAll('.node')]; const arrows = [...document.querySelectorAll('.arrow')]; const evs = [...document.querySelectorAll('.ev')]; const tiles = [...document.querySelectorAll('[style*="grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin-top: auto"] > div')];
if (tg) {
  tg.setAttribute('role', 'switch'); tg.tabIndex = 0; tg.style.cursor = 'pointer'; let on = true;
  const set = v => { on = v; tg.classList.toggle('off', !on); tg.setAttribute('aria-checked', String(on));
    if (!on) { nodes.forEach(n => n.classList.remove('fire', 'done')); arrows.forEach(a => a.classList.remove('on')); evs.forEach(e => e.classList.add('hidden')); tiles.forEach((t, i) => t.querySelector('div').textContent = '0'); }
    else { nodes.forEach(n => n.classList.add('hidden')); evs.forEach(e => e.classList.add('hidden'));
      nodes.forEach((n, i) => setTimeout(() => { n.classList.remove('hidden'); n.classList.add('reveal', i < 4 ? 'fire' : i === 4 ? 'done' : 'x'); if (arrows[i]) arrows[i].classList.toggle('on', i < 3); }, i * 450));
      setTimeout(() => stagger(evs, 350), 600); ['6', '1', '0'].forEach((v, i) => tiles[i] && (tiles[i].querySelector('div').textContent = v)); } };
  tg.addEventListener('click', () => set(!on)); tg.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); set(!on); } });
}

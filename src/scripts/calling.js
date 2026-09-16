import { stagger } from './_bind.js';
const play = document.querySelector('.wave')?.previousElementSibling; const wave = document.querySelector('.wave'); const lines = [...document.querySelectorAll('.tr .line')]; const timer = document.querySelector('.mono[style*="color: #D93A2B"]'); const gauge = document.querySelector('.gauge b'); const card = [...document.querySelectorAll('.kv')];
if (play && wave) {
  play.setAttribute('role', 'button'); play.tabIndex = 0; play.style.cursor = 'pointer'; play.setAttribute('aria-label', 'Play the call');
  const bars = [...wave.querySelectorAll('i')]; let running = false;
  const run = () => {
    if (running) return; running = true;
    lines.forEach(l => l.classList.add('hidden')); card.forEach(c => c.classList.add('hidden')); bars.forEach(b => b.classList.remove('on')); if (gauge) gauge.style.left = '30%';
    const total = 31; let t = 0; const at = [0, 6, 12, 19, 25];
    const tick = setInterval(() => {
      t++; if (timer) timer.textContent = `● 0:${String(t).padStart(2, '0')} / 0:31`;
      bars.slice(0, Math.round(bars.length * t / total)).forEach(b => b.classList.add('on'));
      at.forEach((s, i) => { if (t === s + 1 && lines[i]) { lines[i].classList.remove('hidden'); lines[i].classList.add('reveal'); } });
      if (gauge) gauge.style.left = (30 + 44 * t / total) + '%';
      if (t >= total) { clearInterval(tick); stagger(card, 220); running = false; }
    }, 1000 * 31 / 31 / 1.6);
  };
  play.addEventListener('click', run); play.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); run(); } });
}

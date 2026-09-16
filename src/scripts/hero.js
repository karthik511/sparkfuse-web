import './whatsapp.js';
// Auto-play once when the hero mock scrolls into view — unless the visitor touches the composer first.
const frame = document.getElementById('hero-mock'); const input = frame?.querySelector('.wa input'); const sys = frame?.querySelector('.sys');
if (frame && input && sys && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const secs = [...sys.querySelectorAll('.sec')];
  let played = false, cancelled = false, timer = null, kick = null;
  const cancel = () => { cancelled = true; clearInterval(timer); clearTimeout(kick); if (!played) return; secs.forEach(s => s.classList.remove('hidden')); };
  ['focus', 'keydown', 'pointerdown'].forEach(ev => input.addEventListener(ev, cancel, { once: true }));
  const io = new IntersectionObserver(es => { if (!es[0].isIntersecting || played || cancelled) return; played = true; io.disconnect();
    if (document.activeElement === input) return;
    secs.forEach(s => s.classList.add('hidden'));
    const msg = 'Delivery moved to 12 Oct'; let i = 0;
    kick = setTimeout(() => { if (cancelled) return; timer = setInterval(() => { if (cancelled) { clearInterval(timer); return; } input.value = msg.slice(0, ++i); if (i >= msg.length) { clearInterval(timer); setTimeout(() => { if (!cancelled) input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); }, 400); } }, 55); }, 1200);
  }, { threshold: .4 });
  io.observe(frame);
}

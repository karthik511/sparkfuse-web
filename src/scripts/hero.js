import './whatsapp.js';
// Auto-play once when the hero mock scrolls into view: type the message, let the system react.
const frame = document.getElementById('hero-mock'); const input = frame?.querySelector('.wa input'); const sys = frame?.querySelector('.sys');
if (frame && input && sys && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const secs = [...sys.querySelectorAll('.sec')];
  let played = false;
  const io = new IntersectionObserver(es => { if (!es[0].isIntersecting || played) return; played = true; io.disconnect();
    secs.forEach(s => s.classList.add('hidden'));
    const msg = 'Delivery moved to 12 Oct'; let i = 0;
    setTimeout(() => { const t = setInterval(() => { input.value = msg.slice(0, ++i); if (i >= msg.length) { clearInterval(t); setTimeout(() => input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })), 400); } }, 55); }, 1200);
  }, { threshold: .4 });
  io.observe(frame);
}

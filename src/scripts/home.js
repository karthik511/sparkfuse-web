// "Which of these sounds like you?" router
const base = document.querySelector('.nav .brand').getAttribute('href').replace(/\/$/, '');
const routes = [
  ['Manufacturing ERP, fitted to your plant', base + '/products/manufacturing-erp/'],
  ['AI workflow automation — the system remembers', base + '/products/ai-workflow-automation/'],
  ['MIS dashboards — an order book you can read', base + '/products/mis-dashboards/'],
];
const qs = [...document.querySelectorAll('.quote')];
const lab = document.querySelector('.quote')?.closest('div[style*="border-top"]')?.querySelector('b');
const link = document.querySelector('.quote')?.closest('div[style*="border-top"]')?.querySelector('a');
qs.forEach((q, i) => { q.setAttribute('role', 'button'); q.tabIndex = 0;
  const pick = () => { qs.forEach(x => x.classList.remove('on')); q.classList.add('on'); if (lab) lab.textContent = routes[i][0]; if (link) link.href = routes[i][1]; };
  q.addEventListener('click', pick); q.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
});

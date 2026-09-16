import { bind, wire, fmtIN } from './_bind.js';
const root = document; const s = { orders: 400, skus: 1200, people: 8 };
const lakh = v => v >= 1e7 ? '₹' + (Math.round(v / 1e6) / 10).toString().replace(/\.0$/, '') + ' Cr' : '₹' + (Math.round(v / 1e4) / 10).toString().replace(/\.0$/, '') + ' L';
function render() {
  const hours = Math.round(s.people * 160 * 0.6), saving = s.people * 25000 * 0.6 * 12, stock = s.skus * 8000 * 0.12, otif = Math.min(10, 5 + Math.round(s.orders / 400));
  bind(root, { o: { orders: fmtIN(s.orders), ordersRaw: s.orders, skus: fmtIN(s.skus), skusRaw: s.skus, people: s.people, peopleRaw: s.people,
    hours: fmtIN(hours), hoursNote: s.people + ' people × 160 h × 60% of entry removed.', stock: lakh(stock), stockNote: '12% of ' + fmtIN(s.skus) + ' SKUs idle at ₹8,000 average.',
    otif, saving: lakh(saving), vendorNow: s.people > 10 ? 'Phone calls, 75% about payment' : 'Phone calls, most about payment' } });
}
wire(root, { setOrders: e => { s.orders = +e.target.value; render(); }, setSkus: e => { s.skus = +e.target.value; render(); }, setPeople: e => { s.people = +e.target.value; render(); } });
render();

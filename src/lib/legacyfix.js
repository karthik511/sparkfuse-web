// Post-process legacy artboard HTML: swap bar-placeholder thumbnails and photo placeholders for real product screens.
const mods = import.meta.glob('../data/screens/*.json', { eager: true });
const first = slug => { const d = mods[`../data/screens/${slug}.json`]?.default; return d ? d.screens[0].file : null; };
export function fixLegacy(html, base) {
  let hero = null;
  // product cards: <div class="card"><div class="thumb">…</div> … <a href="/products/<slug>/">
  html = html.replace(/<div class="card">\s*<div class="thumb">(?:\s*<div class="bar[^>]*><\/div>)*\s*<\/div>([\s\S]*?<a href="[^"]*\/products\/([a-z0-9-]+)\/")/g, (m, rest, slug) => {
    const f = first(slug); if (!f) return m; if (!hero) hero = slug;
    return `<div class="card"><div class="thumb shot"><img src="${base}/screens/${slug}/${f}-thumb.webp" alt="" width="480" height="300" loading="lazy" /></div>${rest}`;
  });
  // photo placeholder → framed screen of the page's lead product
  html = html.replace(/<div class="img" style="height: \d+px;">[\s\S]*?<\/div><\/div>/g, m => {
    const slug = hero; const f = slug && first(slug); if (!f) return m;
    return `<div class="frame shot legacyshot"><div class="chrome"><i></i><i></i><i></i><div class="url">app.sparkfuse.in/${slug}</div><div class="live">Mock · fictional data</div></div><img src="${base}/screens/${slug}/${f}.webp" alt="" width="1440" height="900" loading="lazy" /></div>`;
  });
  return html;
}

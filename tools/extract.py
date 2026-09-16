# Extract structured copy + the mock block from each converted product page into src/data/products/*.json
import json, re, os, glob
from bs4 import BeautifulSoup
PROD = {'ProductWhatsApp':'whatsapp-automation','ProductWhatsAppCRM':'whatsapp-crm','ProductWhatsAppChatbot':'whatsapp-chatbot','ProductManufacturingERP':'manufacturing-erp','ProductAICalling':'ai-calling-agent','ProductInventory':'inventory-management','ProductDocuments':'document-processing','ProductWorkflow':'ai-workflow-automation','ProductDealer':'dealer-distributor-management','ProductRealEstateCRM':'real-estate-crm','ProductGarmentERP':'garment-erp','ProductMIS':'mis-dashboards'}
os.makedirs('src/data/products', exist_ok=True)
def txt(el): return el.decode_contents().strip() if el else ''
for name, slug in PROD.items():
    html = open(f'src/content/{name}.html').read()
    s = BeautifulSoup(html, 'lxml')
    d = {'slug': slug}
    crumbs = s.select_one('.mono'); d['chips'] = [c.get_text(strip=True) for c in s.select('.chip')][:4]
    h1 = s.select_one('.h1'); d['h1'] = h1.contents[0].strip() if h1 else ''; d['h1g'] = txt(h1.select_one('.g')) if h1 else ''
    ps = h1.find_parent().select('p.p') if h1 else []
    d['lede'] = txt(ps[0]) if ps else ''; d['semi'] = txt(ps[1]) if len(ps) > 1 else ''
    tryit = h1.find_parent().select('.mono'); d['tryit'] = tryit[-1].get_text(strip=True) if tryit else ''
    mock = s.select_one('[style*="border: 1.5px solid #1B1B1B"]'); d['mock'] = str(mock) if mock else ''
    dark = [x for x in s.select('.dark') if x.select_one('.eb')]
    ref = dark[0] if dark else None
    if ref:
        d['ref_eb'] = ref.select_one('.eb').get_text(strip=True)
        h = ref.select_one('[style*="font-weight: 700"]'); d['ref_h'] = h.contents[0].strip() if h else ''; d['ref_hg'] = txt(h.select_one('span')) if h and h.select_one('span') else ''
        d['ref_p'] = txt(ref.select_one('p.p')); d['ref_li'] = [txt(x) for x in ref.select('.li')]
        d['ref_nums'] = [[x.select_one('[style*="font-weight: 700"]').get_text(strip=True), x.select_one('.mono').get_text(strip=True)] for x in ref.select('[style*="background: #232322"]')]
    cards = s.select('.card')
    def card_by(eb):
        for c in cards:
            e = c.select_one('.eb')
            if e and eb.lower() in e.get_text(strip=True).lower(): return c
    m = card_by('Modules included') or card_by('Documents it reads'); d['modules_title'] = m.select_one('.eb').get_text(strip=True) if m else 'Modules included'; d['modules'] = [txt(x) for x in m.select('.li')] if m else []
    f = card_by('Ready vs fitted'); d['fitted'] = [txt(x) for x in f.select('.li')] if f else []
    a = card_by('What the AI actually does'); d['ai'] = [txt(x) for x in a.select('.li')] if a else []
    e = card_by('How an engagement runs')
    if e:
        d['engagement'] = [[r.select_one('.mono').get_text(strip=True), r.select('div')[-1].get_text(strip=True)] for r in e.select('[style*="display: flex; gap: 8px"]')]
        pr = e.select_one('[style*="font-weight: 700; font-size: 18px"]'); d['price'] = pr.get_text(strip=True) if pr else ''
        pl = e.select_one('.mono[style*="font-size: 10px"]'); d['price_note'] = pl.get_text(strip=True) if pl else ''
    t = s.select_one('table')
    if t:
        rows = t.select('tr'); d['cmp_head'] = [c.get_text(strip=True) for c in rows[0].select('th')]; d['cmp'] = [[c.get_text(strip=True) for c in r.select('td')] for r in rows[1:]]
        after = t.find_next_sibling('p'); d['cmp_note'] = txt(after) if after else ''
    d['faq'] = [[txt(q.select_one('.q')), txt(q.select_one('.a'))] for q in s.select('.faq')]
    faqh = [h for h in s.select('.h2') if 'ask' in h.get_text()]; d['faq_h'] = faqh[0].get_text(strip=True) if faqh else 'Questions buyers ask.'
    rel = [x for x in cards if x.select_one('.mono') and x.select_one('.mono').get_text(strip=True) == 'Related']
    d['related'] = [[a.get_text(strip=True).replace('→', '').strip(), a['href']] for a in rel[0].select('a')] if rel else []
    dk = [x for x in s.select('.dark') if x.select_one('.btn') and not x.select_one('.eb')]
    if dk: d['cta_h'] = dk[-1].select_one('[style*="font-weight: 700"]').get_text(strip=True); d['cta_p'] = txt(dk[-1].select_one('p.p')); d['cta_l'] = dk[-1].select_one('.btn').get_text(strip=True)
    # screens row (static screens card) + cost/analytics static screen blocks: keep raw html of any '.card.q' that has a .screen or a 'Static screen' tag
    extra = [c for c in s.select('.card.q') if c.select_one('.screen') or (c.select_one('.tag') and 'Static' in c.get_text())]
    d['extra'] = [str(c) for c in extra]
    # use cases / module grids outside cards (calling 'use', erp 'mod')
    d['uses'] = [[u.select_one('.mono').get_text(strip=True), u.select_one('.h3').get_text(strip=True), txt(u.select_one('p'))] for u in s.select('.use')]
    d['mods'] = [[u.select_one('.n').get_text(strip=True), u.select_one('.h3').get_text(strip=True), txt(u.select_one('p'))] for u in s.select('.mod')]
    d['usecard'] = [[u.select_one('.mono').get_text(strip=True), u.select_one('.h3').get_text(strip=True), txt(u.select_one('p'))] for u in s.select('.card.q') if u.select_one('.h3') and u.select_one('.mono') and not u.select_one('.screen')]
    json.dump(d, open(f'src/data/products/{slug}.json', 'w'), indent=1, ensure_ascii=False)
    print(slug, 'modules', len(d['modules']), 'faq', len(d['faq']), 'cmp', len(d.get('cmp', [])), 'mock', len(d['mock']))

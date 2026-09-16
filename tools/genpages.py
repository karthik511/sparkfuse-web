import json,os,re
man=json.load(open('tools/manifest.json'))
# home product cards → links
p='src/content/Main.html'; s=open(p).read()
R={'WhatsApp automation for business':'/products/whatsapp-automation/','Manufacturing ERP':'/products/manufacturing-erp/','Inventory &amp; warehouse management':'/products/inventory-management/','Invoice &amp; purchase-order processing':'/products/document-processing/','AI workflow automation':'/products/ai-workflow-automation/','AI calling agent':'/products/ai-calling-agent/','Dealer &amp; distributor order management':'/products/dealer-distributor-management/','Real-estate CRM with AI calling':'/products/real-estate-crm/','Garment &amp; textile ERP':'/products/garment-erp/','MIS dashboards':'/products/mis-dashboards/','Hotel &amp; homestay management':'/products/','AI chatbot &amp; support automation':'/products/whatsapp-chatbot/'}
for t,r in R.items():
    s=s.replace(f'<div class="t">{t}</div>', f'<div class="t"><a href="{r}" style="color: inherit;">{t}</a></div>')
open(p,'w').write(s)
for m in man:
    route=m['route']; name=m['name']
    path='src/pages'+ (route if route!='/' else '/index') 
    if route!='/': path='src/pages'+route.rstrip('/')+'/index'
    os.makedirs(os.path.dirname(path),exist_ok=True)
    script=f"<script>import '../../scripts/{m['script']}.js';</script>" if m['script'] else ''
    depth=route.count('/')-1 if route!='/' else 0
    rel='../'*(depth+ (0 if route=='/' else 0))
    # compute relative import path to src/
    up='../'*(route.count('/') if route!='/' else 1)
    if route=='/': up='../'
    script=f"<script>import '{up}scripts/{m['script']}.js';</script>" if m['script'] else ''
    astro=f'''---
import Base from '{up}layouts/Base.astro';
import raw from '{up}content/{name}.html?raw';
import '{up}content/{name}.css';
const base = import.meta.env.BASE_URL.replace(/\\/$/, '');
const html = raw.replace(/href="\\//g, `href="${{base}}/`);
const title = {json.dumps(m['title'])};
const description = {json.dumps(m['desc'])};
---
<Base title={{title}} description={{description}} section={json.dumps(m['section'])}>
  <Fragment set:html={{html}} />
  {script}
</Base>
'''
    open(path+'.astro','w').write(astro)
    print(path)

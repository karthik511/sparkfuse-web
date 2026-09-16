import re, os, json, html as H
SRC='/private/tmp/claude-501/-Users-shipramathurnarayan/89e7810f-811a-4845-a6f9-6243cb4dadba/scratchpad/canvas'
OUT='src/content'; PAGES='src/pages'
os.makedirs(OUT,exist_ok=True)
MAP={ # file -> (route, title, description, section, script)
 'Main':('/', 'SparkFuse — AI & process consulting, Bengaluru','Boutique AI and process consulting for owner-led Indian businesses. The systems you couldn’t find as a product, built from modules we already run in production. One person answerable.','', 'home'),
 'ProductWhatsApp':('/products/whatsapp-automation/','WhatsApp automation for business — semi-custom, built from proven modules | SparkFuse','WhatsApp threads that update the plan, create the work and chase the right person. Built for a garment exporter; fitted to your floor in 3–5 weeks. Try the mock.','products','whatsapp'),
 'ProductWhatsAppCRM':('/products/whatsapp-crm/','WhatsApp CRM — leads that don’t die in chats | SparkFuse','A CRM inside your WhatsApp conversations: every lead a card, every promise a follow-up, ladders that run themselves. Fitted in 3–5 weeks.','products','whatsappcrm'),
 'ProductWhatsAppChatbot':('/products/whatsapp-chatbot/','WhatsApp chatbot — answers from your real data, in Hinglish | SparkFuse','Order, dispatch and payment status answered from your system on WhatsApp, with a human one tap away. Built as a dealer and vendor desk for a Pune manufacturer.','products','chatbot'),
 'ProductManufacturingERP':('/products/manufacturing-erp/','Manufacturing ERP software for Indian factories — fitted to your plant | SparkFuse','Production planning, inventory and costing on one light system. Built for a protective-products manufacturer in Pune. Move the sliders to see what changes on your floor.','products','erp'),
 'ProductAICalling':('/products/ai-calling-agent/','AI calling agent — Hindi & English voice agents for sales and support | SparkFuse','Our own AI calling product, fitted to your flow: first call in 30 seconds, follow-ups on schedule, every call written to your CRM. 1M+ production calls.','products','calling'),
 'ProductInventory':('/products/inventory-management/','Inventory & warehouse management software — custom-fit | SparkFuse','Stock you can trust and the money sitting still made visible. Lot traceability, reorder points, dead-stock with the rupees attached. Built for a Pune manufacturer.','products','inventory'),
 'ProductDocuments':('/products/document-processing/','Invoice & purchase-order processing — AI reads the document, your ERP gets the data | SparkFuse','Supplier invoices, buyer POs and delivery notes read as they land, matched against the PO and receipt, posted to Tally. Built for a garment exporter.','products','documents'),
 'ProductWorkflow':('/products/ai-workflow-automation/','AI workflow automation — the system chases, assigns and escalates | SparkFuse','Every stage has an owner, a due date and a chase ladder. When something slips the right people hear in the right order, and a human is asked only for real decisions.','products','workflow'),
 'ProductDealer':('/products/dealer-distributor-management/','Dealer & distributor order management for manufacturers | SparkFuse','Dealers order on their phones; one order book, one credit engine, collections that run themselves. Built for a uPVC manufacturer with 300+ dealers.','products','dealer'),
 'ProductRealEstateCRM':('/products/real-estate-crm/','Real-estate CRM with AI calling & WhatsApp — first response in 30 seconds | SparkFuse','Portal leads, walk-ins and brokers in one inbox; every lead called by an AI agent in 30 seconds, qualified, booked and handed over. Designed for a Surat developer.','products','realestate'),
 'ProductGarmentERP':('/products/garment-erp/','Garment & textile ERP — sourcing, sampling, T&A and inspections | SparkFuse','One system the whole floor works from: POs and tech packs read in, a T&A per order that re-plans itself, inspections on a phone, a live order book. Our deepest reference.','products','garment'),
 'ProductMIS':('/products/mis-dashboards/','MIS dashboards — reports that compile themselves, governance that triggers itself | SparkFuse','Data in from phones, POS and cameras; compiled nightly; a digest per role by 7:30; governance rules that ask a named person a question with a deadline.','products','mis'),
 'CaseGarment':('/work/garment-sourcing-erp/','Case study: garment sourcing ERP — the process, rewritten | SparkFuse','A Tiruppur sourcing business running 200+ orders out of spreadsheets, now on one system with an AI project manager. $2.18M live order book, 112 AI suggestions, 7 spreadsheets retired.','work',''),
 'Pricing':('/pricing/','Pricing — what similar work has cost | SparkFuse','Two ways to work: project-based or retainer. Move the sliders to see indicative ranges. Every engagement starts with a discovery session.','pricing','pricing'),
 'IndustryManufacturing':('/industries/manufacturing/','AI & ERP for manufacturers — one system for the plant that runs on Excel | SparkFuse','Inventory, planning, dealers and documents for owner-led factories with one IT person. Built from a ten-module programme at a Pune manufacturer.','industries',''),
 'IndustryGarment':('/industries/garment-and-textile/','AI & ERP for garment exporters and buying houses | SparkFuse','From buyer PO to handover on one system. Our deepest reference: 200+ live orders, three buyers, twelve factories.','industries',''),
 'IndustryRealEstate':('/industries/real-estate-and-construction/','AI CRM & calling for real-estate developers | SparkFuse','Every lead called in 30 seconds, follow-ups run by the system, site visits booked. Three phases, each a finished product.','industries',''),
 'IndustryDistribution':('/industries/distribution-and-dealers/','Dealer & distributor systems for manufacturers | SparkFuse','Dealers ordering on their phones, one credit position, collections that run themselves. 300+ dealers, 20 states, one IT person.','industries',''),
 'ServiceAIConsulting':('/services/ai-consulting/','AI consulting services & custom AI development, Bengaluru | SparkFuse','Strategy, build, rollout and monitoring — one person answerable for all four. Voice, documents, vision, ERP/CRM, custom models. Founder-led.','about',''),
 'ServiceAppDev':('/services/app-development/','MVP & mobile app development, Bengaluru — shipped to the store | SparkFuse','Twelve weeks to something on the store with the unit economics worked out first. Consumer apps to 27,000 downloads; three products we run ourselves.','about',''),
 'About':('/about/','About SparkFuse — a consulting practice that builds, and runs what it builds','Boutique AI and process consultancy in Bengaluru, founder-led, grown out of the AI products it operates.','about',''),
 'Contact':('/contact/','Contact — tell us the process that hurts | SparkFuse','One human reply within a business day. WhatsApp, email, or the form.','contact','contact'),
}
ROUTES={ # link text (lower, stripped of arrows) -> route
 'whatsapp automation':'/products/whatsapp-automation/','whatsapp automation for business':'/products/whatsapp-automation/','whatsapp crm':'/products/whatsapp-crm/','whatsapp chatbot':'/products/whatsapp-chatbot/',
 'manufacturing erp':'/products/manufacturing-erp/','see manufacturing erp':'/products/manufacturing-erp/','ai calling agent':'/products/ai-calling-agent/','inventory & warehouse':'/products/inventory-management/','inventory & warehouse management':'/products/inventory-management/',
 'invoice & po processing':'/products/document-processing/','invoice & purchase-order processing':'/products/document-processing/','ai workflow automation':'/products/ai-workflow-automation/','dealer & distributor management':'/products/dealer-distributor-management/','dealer & distributor order management':'/products/dealer-distributor-management/','see dealer management':'/products/dealer-distributor-management/',
 'real-estate crm':'/products/real-estate-crm/','real-estate crm with ai calling':'/products/real-estate-crm/','see real-estate crm':'/products/real-estate-crm/','garment & textile erp':'/products/garment-erp/','see garment erp':'/products/garment-erp/','mis dashboards':'/products/mis-dashboards/','hotel & homestay management':'/products/hospitality-management/','ai chatbot & support automation':'/products/whatsapp-chatbot/',
 'case: garment sourcing erp':'/work/garment-sourcing-erp/','read the case study':'/work/garment-sourcing-erp/','see the work':'/work/','work':'/work/',
 'pricing':'/pricing/','how pricing works':'/pricing/','see what similar work has cost':'/pricing/',
 'industry: manufacturing':'/industries/manufacturing/','industry: garment & textile':'/industries/garment-and-textile/','industry: real estate & construction':'/industries/real-estate-and-construction/','industry: distribution & dealers':'/industries/distribution-and-dealers/','industry: restaurants & food':'/industries/','industry: distribution & dealers':'/industries/distribution-and-dealers/',
 'ai consulting':'/services/ai-consulting/','the method':'/services/ai-consulting/','solutions: vision ai':'/solutions/vision-ai/','solutions: custom ai models':'/solutions/custom-ai-models/',
 'lab: cutting voice-agent cost by 80%':'/lab/voice-agent-cost/','lab: the ai is the project manager':'/lab/ai-is-the-project-manager/',
 'talk to us':'/contact/','see it on a call':'/contact/','book the demo':'/contact/','hear a call on a demo':'/contact/','tell us the idea':'/contact/','tell us your process':'/contact/','tell us the process that hurts':'/contact/','send':'/contact/',
 "i'm looking for a product":'/products/',"i have a process that hurts":'/contact/','see the page':'/products/',
}
def route_for(text):
    t=H.unescape(re.sub(r'<[^>]+>','',text)).replace('→','').strip().lower()
    return ROUTES.get(t)
def convert(name, src_html):
    s=src_html
    css=re.search(r'<style>(.*?)</style>',s,re.S).group(1)
    css=re.sub(r'\n\s*body \{[^}]*\}','',css); css=re.sub(r'\n\s*a \{[^}]*\}[^\n]*','',css)
    body=re.search(r'<x-dc>(.*?)</x-dc>',s,re.S).group(1)
    body=re.sub(r'<helmet>.*?</helmet>','',body,flags=re.S)
    # strip root wrapper open
    body=re.sub(r'<!-- NAV -->','',body)
    body=re.sub(r'^\s*<div style="width: 1440px;[^"]*">','',body.strip())
    body=re.sub(r'</div>\s*$','',body)
    # strip nav block (first block ending with Talk to us</div>\n  </div>)
    body=re.sub(r'^\s*<div style="display: flex; align-items: center; justify-content: space-between; height: 72px;.*?Talk to us</div>\s*</div>','',body,count=1,flags=re.S)
    # strip footer
    body=re.sub(r'<!-- FOOTER -->.*$','',body,flags=re.S)
    body=re.sub(r'<div class="dark" style="padding: 28px 120px;.*?</div>\s*$','',body,flags=re.S)
    body=body.replace(' 120px',' var(--gx)').replace('padding: 0 120px','padding: 0 var(--gx)')
    # holes
    body=re.sub(r'value="\{\{\s*([\w.]+)\s*\}\}"', lambda m:'data-val="%s"'%m.group(1), body)
    body=re.sub(r'class="\{\{\s*([\w.]+)\s*\}\}"', lambda m:'data-cls="%s"'%m.group(1), body)
    body=re.sub(r'on(Change|Click|Input)="\{\{\s*(\w+)\s*\}\}"', lambda m:'data-act="%s"'%m.group(2), body)
    body=re.sub(r'\{\{\s*([\w.]+)\s*\}\}', lambda m:'<span data-b="%s"></span>'%m.group(1), body)
    # buttons -> links
    def btn(m):
        cls,style,text=m.group(1),m.group(2) or '',m.group(3)
        r=route_for(text)
        if r: return '<a class="%s"%s href="%s">%s</a>'%(cls,style,r,text)
        return m.group(0)
    body=re.sub(r'<div class="(btn2?)"( style="[^"]*")?>([^<]{2,60})</div>',btn,body)
    # href="#" links by text
    def lnk(m):
        attrs,text=m.group(1),m.group(2); r=route_for(text)
        return '<a href="%s"%s>%s</a>'%(r or '/contact/',attrs,text)
    body=re.sub(r'<a href="#"([^>]*)>(.*?)</a>',lnk,body)
    # industry "See the page →" cards: map via preceding title
    def card(m):
        title=m.group(1); r=route_for(title) or '/products/'
        return m.group(0).replace('href="/products/"','href="%s"'%r)
    body=re.sub(r'<div class="t">([^<]+)</div><div class="d">[^<]*</div><a href="/products/"[^>]*>See the page →</a>',card,body)
    return css, body
manifest=[]
for name,(route,title,desc,section,script) in MAP.items():
    fn = 'AboutContact' if name in ('About','Contact') else name
    src=open(f'{SRC}/{fn}.dc.html',encoding='utf-8').read()
    css,body=convert(name,src)
    if name=='About': body=body.split('<!-- CONTACT -->')[0]
    if name=='Contact':
        body=body.split('<!-- CONTACT -->')[1].replace('margin-top: 72px;','').replace('border-top: 1px solid #D4D3CB;','')
    open(f'{OUT}/{name}.html','w').write(body); open(f'{OUT}/{name}.css','w').write(css)
    manifest.append(dict(name=name,route=route,title=title,desc=desc,section=section,script=script))
json.dump(manifest,open('tools/manifest.json','w'),indent=1)
print('converted',len(manifest))

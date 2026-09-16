# Shared HTML builders for product screens.
def kpi(v, s, d=None, cls=''):
    return f'<div class="card kpi {cls}"><div class="v">{v}</div><div class="s">{s}</div>{f"<div class=\"d {d[1]}\">{d[0]}</div>" if d else ""}</div>'
def kpis(items): return '<div class="grid g4">' + ''.join(kpi(*i) for i in items) + '</div>'
def table(head, rows, sel=None, cls=''):
    h = ''.join(f'<th>{x}</th>' for x in head)
    def cell(c): return f'<td class="num">{c[1:]}</td>' if isinstance(c, str) and c.startswith('#') else f'<td>{c}</td>'
    b = ''.join(f'<tr{" class=\"sel\"" if sel == i else ""}>' + ''.join(cell(c) for c in r) + '</tr>' for i, r in enumerate(rows))
    return f'<table class="{cls}"><tr>{h}</tr>{b}</table>'
def card(title, body, right='', cls=''): return f'<div class="card {cls}"><div class="h">{title}<span class="mono">{right}</span></div>{body}</div>'
def lst(items): return '<div class="list">' + ''.join(f'<div><span class="t">{t}</span><div>{x}</div>{f"<span style=\"margin-left:auto\">{r}</span>" if r else ""}</div>' for t, x, *rr in [i if len(i) == 3 else (*i, None) for i in items] for r in [rr[0] if rr else None]) + '</div>'
def timeline(items): return '<div class="timeline">' + ''.join(f'<div><span class="n {c}">{"✓" if c == "on" else i + 1}</span><div>{t}<small>{s}</small></div></div>' for i, (t, s, c) in enumerate(items)) + '</div>'
def hbars(items): return ''.join(f'<div class="hbar"><span>{l}</span><div class="bar"><i class="{c}" style="width:{w}%"></i></div><b>{v}</b></div>' for l, w, v, c in items)
def tag(t, c=''): return f'<span class="tag {c}">{t}</span>'
def wa(name, sub, msgs, av='', warm=None, placeholder='Reply…'):
    b = ''.join(f'<div class="bub {c}">{t}<div class="m">{m}</div></div>' if c != 'sys' else f'<div class="bub sys">{t}</div>' for c, t, m in [(x if len(x) == 3 else (*x, '')) for x in msgs])
    return f'<div class="wa"><div class="hd"><div class="avatar g" style="width:32px;height:32px;font-size:11px">{av or name[:2].upper()}</div><div>{name}<small>{sub}</small></div>{tag(warm[0], warm[1]) + "" if warm else ""}</div><div class="msgs">{b}</div><div class="in"><div class="f">{placeholder}</div><button class="btn sm">Send</button></div></div>'
def kv(pairs): return '<div class="kv">' + ''.join(f'<span class="k">{k}</span><span>{v}</span>' for k, v in pairs) + '</div>'
def digest(title, lines): return f'<div class="digest"><div class="hh">{title}</div>' + ''.join(f'<div>{l}</div>' for l in lines) + '</div>'
def gantt(rows, weeks, etd=None):
    g = ''.join(f'<div class="gr"><span>{n}</span><div class="track"><i class="{c}" style="left:{l}%;width:{w}%"></i>{f"<span class=\"etd\" style=\"left:{etd}%\"></span>" if etd else ""}</div></div>' for n, l, w, c in rows)
    return f'<div class="gantt">{g}</div><div class="wk">' + ''.join(f'<span>{w}</span>' for w in weeks) + '</div>'
def kanban(cols):
    return '<div class="kan" style="grid-template-columns: repeat(%d, minmax(0,1fr))">' % len(cols) + ''.join(f'<div class="col"><div class="ch">{h} <span>{len(items)}</span></div>' + ''.join(f'<div class="lead {c}"><div class="nm">{n}</div>{d}<div class="foot"><span class="m">{m}</span>{tag(t[0], t[1]) if t else ""}</div></div>' for n, d, m, t, c in items) + '</div>' for h, items in cols) + '</div>'
def form(fields): return '<div class="form">' + ''.join(f'<div class="fld"><label>{l}</label><div class="in {c}">{v}</div></div>' for l, v, c in [(x if len(x) == 3 else (*x, '')) for x in fields]) + '</div>'
def switches(items): return ''.join(f'<div class="sw"><span class="tg {"" if on else "off"}"></span>{t}</div>' for t, on in items)
def phone(title, sub, body): return f'<div class="phone"><div class="ph"><b>{title}</b><small>{sub}</small></div><div class="pb">{body}</div></div>'
def bars(vals): return '<div class="bars">' + ''.join(f'<i class="{c}" style="height:{h}%"></i>' for h, c in vals) + '</div>'
def NAV(*items): return list(items)

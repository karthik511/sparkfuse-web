#!/usr/bin/env python3
"""Render a product's screens to WebP (+ thumbs, + MP4/GIF loop) and write captions JSON.
Usage: python3 tools/render_screens.py whatsapp-crm   (reads tools/screens/whatsapp-crm.py)
Each screens module defines APP = dict(brand, sub, client, user, role, nav=[(key,label,icon,badge)]) and
SCREENS = [dict(slug, title, caption, nav, crumb, body, toast=None, hl=None)]."""
import sys, os, json, subprocess, importlib.util, shutil
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
ICONS = { 'home': 'M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z', 'inbox': 'M22 12h-6l-2 3h-4l-2-3H2M5 5l-3 7v7h20v-7l-3-7z', 'users': 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8', 'board': 'M4 4h16v16H4zM4 10h16M10 4v16', 'ladder': 'M4 6h16M4 12h16M4 18h16', 'chart': 'M3 3v18h18M7 14l4-4 4 4 5-6', 'cog': 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z', 'doc': 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8', 'phone': 'M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.7A2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z', 'box': 'M21 16V8a2 2 0 00-1-1.7l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.7l7 4a2 2 0 002 0l7-4a2 2 0 001-1.7zM3.3 7l8.7 5 8.7-5M12 22V12', 'cal': 'M3 4h18v18H3zM16 2v4M8 2v4M3 10h18', 'bell': 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0', 'check': 'M20 6L9 17l-5-5', 'truck': 'M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z', 'rupee': 'M6 3h12M6 8h12M6 13h6a4 4 0 000-8M6 13l8 8' }
def svg(k): return f'<svg viewBox="0 0 24 24"><path d="{ICONS.get(k, ICONS["box"])}"/></svg>'
def shell(app, s):
    nav = ''.join(f'<a class="{"on" if k == s["nav"] else ""}">{svg(ic)}{lbl}{f"<span class=\"b{" g" if str(bd).startswith("g") else ""}\">{str(bd).lstrip("g")}</span>" if bd else ""}</a>' if k != '-' else f'<div class="grp">{lbl}</div>' for k, lbl, ic, bd in app['nav'])
    toast = f'<div class="toast"><i></i>{s["toast"]}</div>' if s.get('toast') else ''
    return f'''<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"><link rel="stylesheet" href="app.css"><style>{s.get('css','')}</style></head><body><div class="app">
<aside class="sb"><div class="brand"><i></i><span>{app['brand']}<span class="sub">{app['sub']}</span></span></div>{nav}<div class="me"><div class="av">{app['user'][:1]}</div><div><b>{app['user']}</b><small>{app['role']} · {app['client']}</small></div></div></aside>
<div class="main"><div class="top"><h1>{s['title']}</h1><span class="crumb">{s.get('crumb','')}</span><span class="sp"></span><div class="search">Search orders, people, documents…</div><div class="ic">🔔<i></i></div>{s.get('topbtn','')}</div>
<div class="content" style="position:relative">{s['body']}{toast}<div class="watermark">MOCK · FICTIONAL DATA · {app['client'].upper()}</div></div></div></div></body></html>'''
def main(slug):
    spec = importlib.util.spec_from_file_location(slug, os.path.join(ROOT, 'tools', 'screens', slug.replace('-', '_') + '.py')); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    out = os.path.join(ROOT, 'public', 'screens', slug); tmp = os.path.join(ROOT, 'tools', 'screens', '_tmp', slug); os.makedirs(out, exist_ok=True); os.makedirs(tmp, exist_ok=True); shutil.copy(os.path.join(ROOT, 'tools', 'screens', 'app.css'), os.path.join(tmp, 'app.css'))
    meta = []
    for i, s in enumerate(m.SCREENS, 1):
        name = f'{i:02d}-{s["slug"]}'; html = os.path.join(tmp, name + '.html'); png = os.path.join(tmp, name + '.png')
        open(html, 'w').write(shell(m.APP, s))
        subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--virtual-time-budget=6000', '--window-size=1440,900', f'--screenshot={png}', 'file://' + html], capture_output=True)
        im = Image.open(png).convert('RGB'); im.save(os.path.join(out, name + '.webp'), quality=84, method=6); im.resize((480, 300), Image.LANCZOS).save(os.path.join(out, name + '-thumb.webp'), quality=78)
        meta.append({'file': name, 'title': s['title'], 'caption': s['caption'], 'hl': s.get('hl')})
        print('rendered', name)
    # loop: 3.5 s per frame, 960 wide
    frames = os.path.join(tmp, 'f%02d.png'); [shutil.copy(os.path.join(tmp, f'{i:02d}-{s["slug"]}.png'), os.path.join(tmp, f'f{i:02d}.png')) for i, s in enumerate(m.SCREENS, 1)]
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', '1/3.5', '-i', frames, '-vf', 'scale=960:-2,format=yuv420p', '-r', '12', '-c:v', 'libx264', '-crf', '28', '-movflags', '+faststart', os.path.join(out, 'loop.mp4')])
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', '1/3.5', '-i', frames, '-vf', 'scale=720:-2,split[a][b];[a]palettegen=max_colors=96[p];[b][p]paletteuse=dither=bayer', os.path.join(out, 'loop.gif')])
    json.dump({'app': m.APP['brand'], 'client': m.APP['client'], 'screens': meta}, open(os.path.join(ROOT, 'src', 'data', 'screens', slug + '.json'), 'w'), indent=1)
    print('done', slug, len(meta), 'screens')
if __name__ == '__main__': main(sys.argv[1])

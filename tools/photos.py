#!/usr/bin/env python3
"""Filter + place people photos. Usage: python3 tools/photos.py ~/Desktop/sparkfuse-portrait.jpg founder
   python3 tools/photos.py ~/Desktop/sparkfuse-akhil.jpg akhil
Writes public/media/<name>.jpg (4:5, 720x900) and <name>-sm.jpg (360x450) with the house look:
slight desaturation, warm tone, mild contrast, vignette, a little grain."""
import sys, random
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw, ImageOps

src, name = sys.argv[1], sys.argv[2]
im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
w, h = im.size
# centre crop to 4:5, biased slightly upward (faces sit high)
tw, th = (w, int(w * 1.25)) if w * 1.25 <= h else (int(h / 1.25), h)
x0 = (w - tw) // 2; y0 = max(0, int((h - th) * 0.35))
c = im.crop((x0, y0, x0 + tw, y0 + th)).resize((720, 900), Image.LANCZOS)
c = ImageEnhance.Color(c).enhance(0.82); c = ImageEnhance.Contrast(c).enhance(1.08)
r, g, b = c.split(); r = r.point(lambda v: min(255, int(v * 1.04 + 4))); b = b.point(lambda v: int(v * 0.95)); c = Image.merge('RGB', (r, g, b))
mask = Image.new('L', c.size, 0); ImageDraw.Draw(mask).ellipse((-180, -225, 900, 1125), fill=255); mask = mask.filter(ImageFilter.GaussianBlur(220))
c = Image.composite(c, ImageEnhance.Brightness(c).enhance(0.72), mask)
random.seed(3); n = Image.effect_noise(c.size, 14).convert('L'); c = Image.blend(c, Image.merge('RGB', (n, n, n)), 0.045)
c = ImageEnhance.Contrast(c).enhance(1.03)
c.save(f'public/media/{name}.jpg', quality=86, optimize=True)
c.resize((360, 450), Image.LANCZOS).save(f'public/media/{name}-sm.jpg', quality=84, optimize=True)
print('wrote', f'public/media/{name}.jpg', f'public/media/{name}-sm.jpg')

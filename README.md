# sparkfuse-web

Marketing site for SparkFuse Business Solutions LLP. Astro static site; every screen is a mockup with fictional data.

- `src/content/*.html|css` — page bodies generated from the design canvas (`tools/convert.py` + `tools/genpages.py`)
- `src/scripts/*.js` — the interactive mocks (vanilla JS, one per product page)
- `src/data/site.js` — products, hubs, industries, cases, lab notes
- Staging: GitHub Pages under `/sparkfuse-web` (robots: noindex). Production: set `SITE_URL` and `BASE_PATH=""`, remove `public/robots.txt` disallow.

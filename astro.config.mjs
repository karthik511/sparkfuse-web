import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = process.env.SITE_URL || 'https://karthik511.github.io';
const base = process.env.BASE_PATH ?? '/sparkfuse-web';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [sitemap()],
  build: { format: 'directory' }
});

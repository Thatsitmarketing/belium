// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Produktions-URL – bei Bedarf auf die finale Domain anpassen (z. B. https://www.belium.de)
const SITE = 'https://www.belium.de';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  output: 'static',
  integrations: [
    sitemap({
      // Rechtsseiten aus der Sitemap ausschliessen ist nicht noetig – sie duerfen indexiert werden.
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: new Date('2026-08-05'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    // Sharp ist Standard; wir liefern AVIF/WebP ueber die <Image>-Komponente aus.
    responsiveStyles: true,
  },
});

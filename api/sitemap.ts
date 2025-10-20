import type { VercelRequest, VercelResponse } from '@vercel/node';

const BASE_URL = 'https://www.vincantomaiori.it';
const SUPPORTED_LANGUAGES = ['it', 'en', 'de', 'fr'];
const PAGES = ['', 'prenota']; // Corrisponde a '/' e '/prenota'

/**
 * Genera una sitemap XML dinamica per il sito.
 * Include versioni multilingua per ogni pagina usando hreflang.
 */
export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/xml');
  // Abilita la cache del browser e della CDN di Vercel per 24 ore
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${PAGES.map(page => `
    <url>
      <loc>${BASE_URL}/${page}</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>${page === '' ? '1.0' : '0.8'}</priority>
      ${SUPPORTED_LANGUAGES.map(lang =>
        `<xhtml:link
           rel="alternate"
           hreflang="${lang}"
           href="${BASE_URL}/${lang}/${page}"/>`
      ).join('')}
    </url>
  `).join('')}
</urlset>`;

  res.status(200).send(sitemap);
}
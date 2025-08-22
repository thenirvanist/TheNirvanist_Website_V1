import type { Express } from "express";
import { storage } from "./storage";

/**
 * SEO-related routes for sitemap generation and robots.txt
 */
export function registerSEORoutes(app: Express): void {
  
  // Dynamic sitemap generation
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const [journeys, sages, ashrams] = await Promise.all([
        storage.getJourneys(),
        storage.getSages(),
        storage.getAshrams()
      ]);

      const baseUrl = req.protocol + '://' + req.get('host');
      const currentDate = new Date().toISOString().split('T')[0];

      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    
    <!-- Homepage -->
    <url>
        <loc>${baseUrl}/</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>

    <!-- Main Service Pages -->
    <url>
        <loc>${baseUrl}/journeys</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>

    <url>
        <loc>${baseUrl}/sages</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>

    <url>
        <loc>${baseUrl}/ashrams</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>

    <url>
        <loc>${baseUrl}/meetups</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>

    <url>
        <loc>${baseUrl}/contact</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>

    <!-- Authentication Pages -->
    <url>
        <loc>${baseUrl}/login</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.3</priority>
    </url>

    <url>
        <loc>${baseUrl}/register</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.3</priority>
    </url>
`;

      // Add individual journey pages
      journeys.forEach(journey => {
        sitemap += `
    <url>
        <loc>${baseUrl}/journeys/${journey.id}</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>`;
      });

      // Add individual sage pages
      sages.forEach(sage => {
        sitemap += `
    <url>
        <loc>${baseUrl}/sages/${sage.id}</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>`;
      });

      // Add individual ashram pages
      ashrams.forEach(ashram => {
        sitemap += `
    <url>
        <loc>${baseUrl}/ashrams/${ashram.id}</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>`;
      });

      sitemap += '\n</urlset>';

      res.set('Content-Type', 'application/xml');
      res.send(sitemap);

    } catch (error) {
      console.error('Error generating sitemap:', error);
      res.status(500).send('Error generating sitemap');
    }
  });

  // Robots.txt route
  app.get("/robots.txt", (req, res) => {
    const baseUrl = req.protocol + '://' + req.get('host');
    
    const robotsTxt = `# Robots.txt for The Nirvanist - Spiritual Tourism Platform
# ${baseUrl}

# Allow all search engines to crawl the entire site
User-agent: *
Allow: /

# Specific rules for major search engines
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 2

# Disallow authentication and private pages
Disallow: /login
Disallow: /register
Disallow: /forgot-password
Disallow: /auth/
Disallow: /api/

# Disallow admin and internal files
Disallow: /admin/
Disallow: *.json$
Disallow: *.xml$
Disallow: /src/
Disallow: /node_modules/
Disallow: /dist/
Disallow: /.git/
Disallow: /.env
Disallow: /server/

# Allow specific assets
Allow: /assets/
Allow: /images/
Allow: /attached_assets/
Allow: /*.css$
Allow: /*.js$
Allow: /*.png$
Allow: /*.jpg$
Allow: /*.jpeg$
Allow: /*.gif$
Allow: /*.webp$
Allow: /*.svg$
Allow: /*.ico$
Allow: /*.woff$
Allow: /*.woff2$
Allow: /*.ttf$

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for general bots (seconds between requests)
Crawl-delay: 1

# Host directive (helps search engines understand the preferred domain)
Host: ${baseUrl}`;

    res.set('Content-Type', 'text/plain');
    res.send(robotsTxt);
  });
}
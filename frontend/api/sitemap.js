export default function(req, res) {
  const baseUrl = "https://yoursoundtrack.vercel.app";

  const staticPages = [
    { url: "/", changefreq: "monthly", priority: 1.0 },
    { url: "/blog", changefreq: "weekly", priority: 0.8 },
    { url: "/news", changefreq: "weekly", priority: 0.8 },
    { url: "/about", changefreq: "monthly", priority: 0.5 },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.status(200).send(sitemap);
}

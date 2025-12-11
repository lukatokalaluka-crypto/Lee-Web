export default async function(req, res) {
  const baseUrl = "https://yoursoundtrack.vercel.app";

  const staticPages = [
    { url: "/", changefreq: "monthly", priority: 1.0 },
    { url: "/blog", changefreq: "weekly", priority: 0.8 },
    { url: "/news", changefreq: "weekly", priority: 0.8 },
    { url: "/about", changefreq: "monthly", priority: 0.5 },
  ];

  try {
    // Fetch posts from backend
    const response = await fetch(`${baseUrl}/api/posts`);
    const posts = await response.json();

    // Add dynamic post pages to sitemap
    const postPages = posts.map(post => ({
      url: `/posts/${post._id}`,
      changefreq: "weekly",
      priority: 0.6,
      lastmod: new Date(post.createdAt).toISOString().split('T')[0]
    }));

    const allPages = [...staticPages, ...postPages];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Fallback to static sitemap if fetch fails
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
}

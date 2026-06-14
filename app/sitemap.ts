import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.datakwaba.com';

  const lastModified = new Date().toISOString();

  const publicRoutes = [
    { path: '/', priority: 1.0, changefreq: 'daily' },
    { path: '/auth/login', priority: 0.4, changefreq: 'yearly' },
    { path: '/auth/register', priority: 0.4, changefreq: 'yearly' },
  ];

  publicRoutes.sort((a, b) => b.priority - a.priority);

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified,
    priority: route.priority,
    changefreq: route.changefreq,
  }));
}
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dogiadmin61', '/admin', '/api/'],
    },
    sitemap: 'https://doganaykeskin.com/sitemap.xml',
  };
}

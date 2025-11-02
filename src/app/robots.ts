import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin', '/api/', '/_next/'],
            crawlDelay: 1,
        },
        sitemap: 'https://iteshxt.me/sitemap.xml',
        host: 'https://iteshxt.me',
    };
}

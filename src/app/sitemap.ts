import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const BASE_URL = 'https://iteshxt.me';

    // Static pages with priority
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/experience`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/projects`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/writings`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
    ];

    return staticPages;
}

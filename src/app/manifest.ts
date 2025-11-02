import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Itesh Tomar's Portfolio",
        short_name: 'Itesh Portfolio',
        description: 'Full-stack developer crafting interactive web experiences with AI/ML expertise',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait-primary',
        theme_color: '#5227FF',
        background_color: '#0a0a0a',
        screenshots: [
            {
                src: '/screenshot-1.png',
                sizes: '540x720',
                type: 'image/png',
                form_factor: 'narrow',
            },
            {
                src: '/screenshot-2.png',
                sizes: '1280x720',
                type: 'image/png',
                form_factor: 'wide',
            },
        ],
        icons: [
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/icon-maskable.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
        categories: ['productivity', 'business'],
    };
}

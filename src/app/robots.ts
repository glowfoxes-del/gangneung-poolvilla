import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/payment/', '/api/'], // Private areas
        },
        sitemap: 'https://poolvilla-ra.com/sitemap.xml', // Update with real domain later
    };
}

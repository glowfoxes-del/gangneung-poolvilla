import { MetadataRoute } from 'next';
import { content } from '@/constants/content';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = content.siteConfig.url;

    // Static Details
    const staticRoutes = [
        '',
        '/rooms',
        '/booking',
        '/static/facilities',
        '/static/contact',
        '/static/terms',
        '/static/privacy',
        '/static/refund',
        '/lookup',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic Rooms
    const roomRoutes = content.rooms.map((room) => ({
        url: `${baseUrl}/rooms/${room.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    return [...staticRoutes, ...roomRoutes];
}

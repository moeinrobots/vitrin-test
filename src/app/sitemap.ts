import type { MetadataRoute } from 'next';
import { getAbsoluteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date();

    return [
        {
            url: getAbsoluteUrl('/'),
            lastModified,
            changeFrequency: 'monthly',
            priority: 1,
        },
    ];
}

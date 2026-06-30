import type { MetadataRoute } from 'next';
import { getAbsoluteUrl } from '@/shared/lib/site';

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

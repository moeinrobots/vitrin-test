import type { MetadataRoute } from 'next';
import { getAbsoluteUrl } from '@/shared/lib/site';
import { getInitialSiteConfig } from '@/shared/lib/initial-config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function robots(): Promise<MetadataRoute.Robots> {
    const config = await getInitialSiteConfig();

    return {
        rules: config.robots.rules,
        sitemap: normalizeSitemapUrls(config.robots.sitemap),
        host: config.robots.host,
    };
}

function normalizeSitemapUrls(value: string | string[] | undefined) {
    if (Array.isArray(value)) {
        return value.length
            ? value.map(getAbsoluteUrl)
            : getAbsoluteUrl('/sitemap.xml');
    }

    return getAbsoluteUrl(value ?? '/sitemap.xml');
}

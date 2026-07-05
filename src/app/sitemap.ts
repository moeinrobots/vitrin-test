import type { MetadataRoute } from 'next';
import { getAbsoluteUrl } from '@/shared/lib/site';
import { getProducts } from '@/features/products/api/products.server';
import { getInitialSiteConfig } from '@/shared/lib/initial-config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const PUBLIC_ROUTES = [
    { path: '/', priority: 1, changeFrequency: 'monthly' },
    { path: '/about', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/products', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/blogs', priority: 0.6, changeFrequency: 'weekly' },
    { path: '/posts', priority: 0.6, changeFrequency: 'weekly' },
    { path: '/contents', priority: 0.6, changeFrequency: 'weekly' },
    { path: '/shop', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/order-tracking', priority: 0.3, changeFrequency: 'monthly' },
] satisfies Array<{
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
}>;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const config = await getInitialSiteConfig();

    if (!config.sitemap.enabled) return [];

    const lastModified = new Date();
    const excludedPaths = new Set(config.sitemap.exclude);
    const noIndexPaths = new Set(
        Object.entries(config.pagesSeo).flatMap(([path, seo]) =>
            seo.noIndex ? [normalizePath(path)] : [],
        ),
    );
    const items = new Map<string, MetadataRoute.Sitemap[number]>();

    if (config.sitemap.includeStaticRoutes) {
        PUBLIC_ROUTES.forEach((route) => {
            addSitemapItem(items, excludedPaths, noIndexPaths, {
                url: getAbsoluteUrl(route.path),
                lastModified,
                changeFrequency: route.changeFrequency,
                priority: route.priority,
            });
        });
    }

    config.sitemap.entries.forEach((entry) => {
        addSitemapItem(items, excludedPaths, noIndexPaths, {
            url: getAbsoluteUrl(entry.path),
            lastModified: entry.lastModified ?? lastModified,
            changeFrequency: entry.changeFrequency,
            priority: entry.priority,
        });
    });

    if (config.sitemap.includeProducts) {
        const products = await getProducts({
            limit: 100,
            page: 1,
        });

        products.results.forEach((product) => {
            addSitemapItem(items, excludedPaths, noIndexPaths, {
                url: getAbsoluteUrl(`/products/${product.slug}`),
                lastModified:
                    product.updated_date ??
                    product.updated_at ??
                    product.created_date ??
                    product.created_at ??
                    lastModified,
                changeFrequency: 'weekly',
                priority: 0.8,
            });
        });
    }

    return Array.from(items.values());
}

function addSitemapItem(
    items: Map<string, MetadataRoute.Sitemap[number]>,
    excludedPaths: Set<string>,
    noIndexPaths: Set<string>,
    item: MetadataRoute.Sitemap[number],
) {
    const pathname = normalizePath(new URL(item.url).pathname);

    if (excludedPaths.has(pathname) || noIndexPaths.has(pathname)) return;

    items.set(item.url, item);
}

function normalizePath(pathname: string) {
    const withLeadingSlash = pathname.startsWith('/')
        ? pathname
        : `/${pathname}`;
    const normalized =
        withLeadingSlash.length > 1
            ? withLeadingSlash.replace(/\/+$/, '')
            : withLeadingSlash;

    return normalized || '/';
}

import { cache } from 'react';

import { siteConfig } from './site';
import { serverFetch } from './server-fetch';
import { normalizeSeoConfig, type SeoConfig } from './seo';

import type { RuntimeTheme } from './theme-css';

export type ProductCardField =
    'brand' | 'rating' | 'price' | 'discount' | 'stock';

export type ProductListView = 'grid' | 'list';

export type SiteRedirectRule = {
    source: string;
    destination: string;
    permanent: boolean;
};

export type MaintenanceConfig = {
    enabled: boolean;
    scope: 'all' | 'pages';
    pages: PageAvailabilityConfig[];
    message?: string;
};

export type PageAvailabilityMode = 'maintenance' | 'offHours';

export type PageAvailabilityConfig = {
    path: string;
    mode: PageAvailabilityMode;
    message?: string;
    workingHours?: string;
};

export type SitemapChangeFrequency =
    'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

export type SitemapEntryConfig = {
    path: string;
    lastModified?: string;
    changeFrequency?: SitemapChangeFrequency;
    priority?: number;
};

export type SitemapConfig = {
    enabled: boolean;
    includeProducts: boolean;
    includeStaticRoutes: boolean;
    entries: SitemapEntryConfig[];
    exclude: string[];
};

export type RobotsRuleConfig = {
    userAgent: string | string[];
    allow?: string | string[];
    disallow?: string | string[];
    crawlDelay?: number;
};

export type RobotsConfig = {
    rules: RobotsRuleConfig[];
    sitemap?: string | string[];
    host?: string;
};

export type RuntimeLayoutConfig = {
    hasMegaMenu: boolean;
    productListView: ProductListView;
    productCardFields: ProductCardField[];
};

export type InitialSiteConfig = {
    siteName: string;
    description: string;
    logo?: string;
    icon?: string;
    seo?: SeoConfig;
    pagesSeo: Record<string, SeoConfig>;
    sitemap: SitemapConfig;
    robots: RobotsConfig;
    theme?: RuntimeTheme;
    layout: RuntimeLayoutConfig;
    redirects: SiteRedirectRule[];
    maintenance: MaintenanceConfig;
};

type InitialConfigResponse = Record<string, unknown>;

const CONFIG_ENDPOINT = '/config';
const DEV_CONFIG_ENDPOINT = 'http://localhost:8000/config';
const DEFAULT_PRODUCT_CARD_FIELDS: ProductCardField[] = [
    'brand',
    'rating',
    'price',
    'discount',
    'stock',
];

const CONFIG_REVALIDATE_SECONDS = 60;

export const getInitialSiteConfig = cache(
    async (): Promise<InitialSiteConfig> => {
        if (process.env.NODE_ENV !== 'production') {
            return getDevelopmentInitialSiteConfig();
        }

        try {
            const config = await serverFetch<InitialConfigResponse>(
                CONFIG_ENDPOINT,
                {
                    revalidate: CONFIG_REVALIDATE_SECONDS,
                    tags: ['app-config'],
                    authRedirect: false,
                },
            );

            return normalizeInitialSiteConfig(config);
        } catch {
            return getDevelopmentInitialSiteConfig();
        }
    },
);

export function isProjectUnderMaintenance(config: InitialSiteConfig) {
    return config.maintenance.enabled && config.maintenance.scope === 'all';
}

export function getPageSeo(config: InitialSiteConfig, pathname: string) {
    return config.pagesSeo[normalizePathname(pathname)];
}

export function isPathUnderMaintenance(
    config: InitialSiteConfig,
    pathname: string,
) {
    return Boolean(getPathAvailability(config, pathname));
}

export function getPathAvailability(
    config: InitialSiteConfig,
    pathname: string,
): PageAvailabilityConfig | null {
    if (!config.maintenance.enabled) return null;
    if (config.maintenance.scope === 'all') {
        return {
            path: normalizePathname(pathname),
            mode: 'maintenance',
            message: config.maintenance.message,
        };
    }

    return (
        config.maintenance.pages.find(
            (page) =>
                normalizePathname(page.path) === normalizePathname(pathname),
        ) ?? null
    );
}

async function getDevelopmentInitialSiteConfig() {
    if (process.env.NODE_ENV === 'production') {
        return getFallbackInitialSiteConfig();
    }

    try {
        const response = await fetch(DEV_CONFIG_ENDPOINT, {
            next: {
                revalidate: CONFIG_REVALIDATE_SECONDS,
                tags: ['app-config'],
            },
            headers: {
                Accept: 'application/json',
            },
        });

        if (!response.ok) {
            return getFallbackInitialSiteConfig();
        }

        const config = (await response.json()) as InitialConfigResponse;

        return normalizeInitialSiteConfig(config);
    } catch {
        return getFallbackInitialSiteConfig();
    }
}

function normalizeInitialSiteConfig(
    config: InitialConfigResponse,
): InitialSiteConfig {
    const site = getRecord(config.site);
    const layout = getRecord(config.layout);
    const maintenance = getRecord(config.maintenance);
    const seoSource =
        getRecord(site?.seo) ??
        getRecord(config.seo) ??
        getRecord(config.meta) ??
        getRecord(config.metadata);
    const siteName =
        getString(site?.name) ?? getString(config.siteName) ?? siteConfig.name;
    const description =
        getString(site?.description) ??
        getString(config.description) ??
        siteConfig.description;
    const logo = getString(site?.logo) ?? getString(config.logo);
    const icon =
        getString(site?.icon) ??
        getString(config.icon) ??
        getString(config.favicon) ??
        getString(config.favIcon) ??
        getString(config.appleIcon) ??
        logo;

    return {
        siteName,
        description,
        logo,
        icon,
        seo: normalizeSeoConfig(seoSource, {
            title: siteName,
            description,
            images: normalizeSeoImagesFromUrls([logo, icon]),
        }),
        pagesSeo: normalizePagesSeoConfig(config, seoSource),
        sitemap: normalizeSitemapConfig(config.sitemap),
        robots: normalizeRobotsConfig(config.robots),
        theme: getTheme(config),
        layout: normalizeLayoutConfig(layout),
        redirects: normalizeRedirects(config.redirects),
        maintenance: normalizeMaintenanceConfig(maintenance),
    };
}

function normalizeLayoutConfig(
    layout: Record<string, unknown> | undefined,
): RuntimeLayoutConfig {
    return {
        hasMegaMenu: getBoolean(layout?.hasMegaMenu) ?? false,
        productListView: getProductListView(layout?.productListView),
        productCardFields: getProductCardFields(layout?.productCardFields),
    };
}

function normalizeRedirects(value: unknown): SiteRedirectRule[] {
    if (!Array.isArray(value)) return [];

    return value.reduce<SiteRedirectRule[]>((redirects, item) => {
        const redirect = getRecord(item);
        const source = getString(redirect?.source);
        const destination = getString(redirect?.destination);

        if (!source || !destination || !source.startsWith('/')) {
            return redirects;
        }

        redirects.push({
            source,
            destination,
            permanent: getBoolean(redirect?.permanent) ?? true,
        });

        return redirects;
    }, []);
}

function normalizeMaintenanceConfig(
    maintenance: Record<string, unknown> | undefined,
): MaintenanceConfig {
    const scope =
        maintenance?.scope === 'pages' || maintenance?.scope === 'all'
            ? maintenance.scope
            : 'all';

    return {
        enabled: getBoolean(maintenance?.enabled) ?? false,
        scope,
        pages: normalizePageAvailability(maintenance?.pages),
        message: getString(maintenance?.message),
    };
}

function normalizePageAvailability(value: unknown): PageAvailabilityConfig[] {
    if (!Array.isArray(value)) return [];

    return value.flatMap<PageAvailabilityConfig>((item) => {
        if (typeof item === 'string') {
            return [
                {
                    path: normalizePathname(item),
                    mode: 'maintenance' as const,
                },
            ];
        }

        const page = getRecord(item);
        const path =
            getString(page?.path) ??
            getString(page?.page) ??
            getString(page?.route);

        if (!path) return [];

        return [
            {
                path: normalizePathname(path),
                mode: getAvailabilityMode(page?.mode ?? page?.type),
                message: getString(page?.message),
                workingHours:
                    getString(page?.workingHours) ??
                    getString(page?.hours) ??
                    getWorkingHoursRange(page?.workingHours),
            },
        ];
    });
}

function getFallbackInitialSiteConfig(): InitialSiteConfig {
    return {
        siteName: siteConfig.name,
        description: siteConfig.description,
        seo: normalizeSeoConfig(undefined, {
            title: siteConfig.name,
            description: siteConfig.description,
        }),
        pagesSeo: {},
        sitemap: getFallbackSitemapConfig(),
        robots: getFallbackRobotsConfig(),
        layout: {
            hasMegaMenu: false,
            productListView: 'grid',
            productCardFields: DEFAULT_PRODUCT_CARD_FIELDS,
        },
        redirects: [],
        maintenance: {
            enabled: false,
            scope: 'all',
            pages: [],
        },
    };
}

function getFallbackSitemapConfig(): SitemapConfig {
    return {
        enabled: true,
        includeProducts: true,
        includeStaticRoutes: true,
        entries: [],
        exclude: [],
    };
}

function getFallbackRobotsConfig(): RobotsConfig {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api', '/signin', '/signup'],
            },
        ],
    };
}

function normalizePagesSeoConfig(
    config: InitialConfigResponse,
    seoSource: Record<string, unknown> | undefined,
) {
    const pageSeoSource =
        config.pagesSeo ??
        config.pageSeo ??
        config.seoPages ??
        config.metadataPages ??
        seoSource?.pages ??
        seoSource?.routes;
    const pageSeoRecord = getRecord(pageSeoSource);

    if (pageSeoRecord) {
        return Object.entries(pageSeoRecord).reduce<Record<string, SeoConfig>>(
            (pagesSeo, [path, seo]) => {
                pagesSeo[normalizePathname(path)] = normalizeSeoConfig(seo);

                return pagesSeo;
            },
            {},
        );
    }

    if (!Array.isArray(pageSeoSource)) return {};

    return pageSeoSource.reduce<Record<string, SeoConfig>>((pagesSeo, item) => {
        const page = getRecord(item);
        const path =
            getString(page?.path) ??
            getString(page?.page) ??
            getString(page?.route) ??
            getString(page?.url);

        if (!path) return pagesSeo;

        pagesSeo[normalizePathname(path)] = normalizeSeoConfig(page);

        return pagesSeo;
    }, {});
}

function normalizeSitemapConfig(value: unknown): SitemapConfig {
    const sitemap = getRecord(value);
    const entriesSource =
        sitemap?.entries ?? sitemap?.routes ?? sitemap?.pages ?? sitemap?.urls;
    const exclude =
        getStringArray(sitemap?.exclude) ??
        getStringArray(sitemap?.excluded) ??
        [];

    return {
        enabled: getBoolean(sitemap?.enabled) ?? true,
        includeProducts: getBoolean(sitemap?.includeProducts) ?? true,
        includeStaticRoutes: getBoolean(sitemap?.includeStaticRoutes) ?? true,
        entries: normalizeSitemapEntries(entriesSource),
        exclude: exclude.map(normalizePathname),
    };
}

function normalizeSitemapEntries(value: unknown): SitemapEntryConfig[] {
    if (!Array.isArray(value)) return [];

    return value.flatMap((item) => {
        const entry = getRecord(item);
        const path =
            getString(item) ??
            getString(entry?.path) ??
            getString(entry?.url) ??
            getString(entry?.loc) ??
            getString(entry?.route);

        if (!path) return [];

        return [
            {
                path,
                lastModified:
                    getString(entry?.lastModified) ??
                    getString(entry?.lastmod) ??
                    getString(entry?.updatedAt) ??
                    getString(entry?.updated_at),
                changeFrequency: getSitemapChangeFrequency(
                    entry?.changeFrequency ?? entry?.changefreq,
                ),
                priority: getPriority(entry?.priority),
            },
        ];
    });
}

function normalizeRobotsConfig(value: unknown): RobotsConfig {
    const robots = getRecord(value);
    const rulesSource = robots?.rules ?? robots?.rule;
    const rules = normalizeRobotsRules(rulesSource);

    return {
        rules: rules.length ? rules : getFallbackRobotsConfig().rules,
        sitemap:
            getString(robots?.sitemap) ??
            getStringArray(robots?.sitemap) ??
            getStringArray(robots?.sitemaps),
        host: getString(robots?.host),
    };
}

function normalizeRobotsRules(value: unknown): RobotsRuleConfig[] {
    if (!Array.isArray(value)) {
        const rule = normalizeRobotsRule(value);

        return rule ? [rule] : [];
    }

    return value.flatMap((item) => {
        const rule = normalizeRobotsRule(item);

        return rule ? [rule] : [];
    });
}

function normalizeRobotsRule(value: unknown): RobotsRuleConfig | null {
    const rule = getRecord(value);
    const userAgent =
        getOptionalStringArray(rule?.userAgent) ??
        getOptionalStringArray(rule?.user_agent) ??
        getString(rule?.userAgent) ??
        getString(rule?.user_agent) ??
        '*';

    return {
        userAgent,
        allow: getOptionalStringArray(rule?.allow) ?? getString(rule?.allow),
        disallow:
            getOptionalStringArray(rule?.disallow) ?? getString(rule?.disallow),
        crawlDelay: getPositiveNumber(rule?.crawlDelay ?? rule?.crawl_delay),
    };
}

function normalizeSeoImagesFromUrls(urls: Array<string | undefined>) {
    const images = urls.flatMap((url) => (url ? [{ url }] : []));

    return images.length ? images : undefined;
}

function getAvailabilityMode(value: unknown): PageAvailabilityMode {
    return value === 'offHours' ? 'offHours' : 'maintenance';
}

function getWorkingHoursRange(value: unknown) {
    const workingHours = getRecord(value);
    const from = getString(workingHours?.from);
    const to = getString(workingHours?.to);

    return from && to ? `${from} تا ${to}` : undefined;
}

function getTheme(config: InitialConfigResponse) {
    const theme = config.theme;

    return isRecord(theme) ? (theme as RuntimeTheme) : undefined;
}

function normalizePathname(pathname: string) {
    const withLeadingSlash = pathname.startsWith('/')
        ? pathname
        : `/${pathname}`;
    const normalized =
        withLeadingSlash.length > 1
            ? withLeadingSlash.replace(/\/+$/, '')
            : withLeadingSlash;

    return normalized || '/';
}

function getProductListView(value: unknown): ProductListView {
    return value === 'list' ? 'list' : 'grid';
}

function getProductCardFields(value: unknown): ProductCardField[] {
    const fields = getStringArray(value).filter(isProductCardField);

    return fields.length > 0 ? fields : DEFAULT_PRODUCT_CARD_FIELDS;
}

function isProductCardField(value: string): value is ProductCardField {
    return DEFAULT_PRODUCT_CARD_FIELDS.includes(value as ProductCardField);
}

function getSitemapChangeFrequency(
    value: unknown,
): SitemapChangeFrequency | undefined {
    const changeFrequency = getString(value);
    const allowed: SitemapChangeFrequency[] = [
        'always',
        'hourly',
        'daily',
        'weekly',
        'monthly',
        'yearly',
        'never',
    ];

    return allowed.includes(changeFrequency as SitemapChangeFrequency)
        ? (changeFrequency as SitemapChangeFrequency)
        : undefined;
}

function getPriority(value: unknown) {
    const priority = getPositiveNumber(value);

    if (priority === undefined) return undefined;

    return Math.min(priority, 1);
}

function getPositiveNumber(value: unknown) {
    if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
        return value;
    }

    if (typeof value === 'string') {
        const numberValue = Number(value);

        return Number.isFinite(numberValue) && numberValue >= 0
            ? numberValue
            : undefined;
    }

    return undefined;
}

function getStringArray(value: unknown) {
    if (!Array.isArray(value)) return [];

    return value.flatMap((item) => {
        const stringValue = getString(item);

        return stringValue ? [stringValue] : [];
    });
}

function getOptionalStringArray(value: unknown) {
    const values = getStringArray(value);

    return values.length ? values : undefined;
}

function getString(value: unknown) {
    if (typeof value !== 'string') return undefined;

    const trimmed = value.trim();

    return trimmed || undefined;
}

function getBoolean(value: unknown) {
    if (typeof value === 'boolean') return value;
    if (value === 'true') return true;
    if (value === 'false') return false;

    return undefined;
}

function getRecord(value: unknown) {
    return isRecord(value) ? value : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

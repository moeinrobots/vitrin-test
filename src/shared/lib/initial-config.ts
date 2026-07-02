import { cache } from 'react';

import { siteConfig } from './site';
import { serverFetch } from './server-fetch';

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

    return {
        siteName:
            getString(site?.name) ??
            getString(config.siteName) ??
            siteConfig.name,
        description:
            getString(site?.description) ??
            getString(config.description) ??
            siteConfig.description,
        logo: getString(site?.logo) ?? getString(config.logo),
        icon:
            getString(site?.icon) ??
            getString(config.icon) ??
            getString(config.favicon) ??
            getString(config.favIcon) ??
            getString(config.appleIcon) ??
            getString(site?.logo) ??
            getString(config.logo),
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

function getStringArray(value: unknown) {
    if (!Array.isArray(value)) return [];

    return value.flatMap((item) => {
        const stringValue = getString(item);

        return stringValue ? [stringValue] : [];
    });
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

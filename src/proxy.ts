import { NextResponse, type NextRequest } from 'next/server';

type RedirectRule = {
    source?: unknown;
    destination?: unknown;
    permanent?: unknown;
};

type NormalizedRedirectRule = {
    source: string;
    destination: string;
    permanent: boolean;
};

type PageMaintenanceMode = 'maintenance' | 'offHours';

type NormalizedPageMaintenanceRule = {
    path: string;
    mode: PageMaintenanceMode;
};

type RuntimeConfig = {
    redirects: NormalizedRedirectRule[];
    maintenance: {
        enabled: boolean;
        scope: 'all' | 'pages';
        pages: NormalizedPageMaintenanceRule[];
    };
};

// constants
const RUNTIME_CONFIG_ENDPOINT =
    process.env.NEXT_PUBLIC_CONFIG_ENDPOINT ?? '/config';
const AUTH_CHECK_ENDPOINT =
    process.env.NEXT_PUBLIC_REDIRECTS_ENDPOINT ?? RUNTIME_CONFIG_ENDPOINT;
const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://vtb1.hamgam.online';
const DEV_CONFIG_BASE_URL = 'http://localhost:8001';
const REDIRECTS_CACHE_TTL_MS = 60_000;
const TOKEN_COOKIE_NAME = 'token';
const SIGNIN_PATH = '/signin';
const AUTHENTICATED_HOME_PATH = '/panel';

const privateRoutes = ['/panel', '/checkout'];
const authRoutes = ['/signin', '/signup'];
const MAINTENANCE_PATH = '/maintenance';
let runtimeConfigCache:
    | {
          expiresAt: number;
          config: RuntimeConfig;
      }
    | undefined;

export async function proxy(request: NextRequest) {
    const { pathname, search } = request.nextUrl;
    const runtimeConfig = await getRuntimeConfig();

    // check and apply redirects
    const normalizedPathname = normalizePathname(pathname);
    const redirect = runtimeConfig.redirects.find(
        (item) => normalizePathname(item.source) === normalizedPathname,
    );

    if (redirect) {
        const url = new URL(redirect.destination, request.url);

        return NextResponse.redirect(url, redirect.permanent ? 308 : 307);
    }

    const pageMaintenance = getPageMaintenance(
        runtimeConfig,
        normalizedPathname,
    );

    if (pageMaintenance && normalizedPathname !== MAINTENANCE_PATH) {
        const url = request.nextUrl.clone();
        url.pathname = MAINTENANCE_PATH;
        url.search = '';
        url.searchParams.set('path', normalizedPathname);

        return NextResponse.rewrite(url);
    }

    // check public and private routes
    const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;
    const isAuthenticated = token ? await isValidToken(token) : false;

    if (!isAuthenticated && isRouteMatch(pathname, privateRoutes)) {
        const signinUrl = new URL(SIGNIN_PATH, request.url);
        signinUrl.searchParams.set('next', `${pathname}${search}`);

        return NextResponse.redirect(signinUrl);
    }

    if (isAuthenticated && isRouteMatch(pathname, authRoutes)) {
        return NextResponse.redirect(
            new URL(AUTHENTICATED_HOME_PATH, request.url),
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)',
    ],
};

// helper functions
async function getRuntimeConfig(): Promise<RuntimeConfig> {
    const configBaseUrl = getConfigBaseUrl();

    if (!configBaseUrl) return getEmptyRuntimeConfig();

    if (runtimeConfigCache && runtimeConfigCache.expiresAt > Date.now()) {
        return runtimeConfigCache.config;
    }

    try {
        const response = await fetch(
            new URL(RUNTIME_CONFIG_ENDPOINT, configBaseUrl),
            {
                headers: {
                    Accept: 'application/json',
                },
            },
        );

        if (!response.ok) return getEmptyRuntimeConfig();

        const payload = (await response.json()) as unknown;
        const config = normalizeRuntimeConfig(payload);

        runtimeConfigCache = {
            expiresAt: Date.now() + REDIRECTS_CACHE_TTL_MS,
            config,
        };

        return config;
    } catch {
        return getEmptyRuntimeConfig();
    }
}

async function isValidToken(token: string) {
    const configBaseUrl = getConfigBaseUrl();
    const response = await fetch(new URL(AUTH_CHECK_ENDPOINT, configBaseUrl), {
        headers: {
            Accept: 'application/json',
            Token: `${token}`,
        },
    });
    if (response.status == 401) return false;
    return true;
}

function getConfigBaseUrl() {
    if (process.env.NEXT_PUBLIC_CONFIG_BASE_URL) {
        return process.env.NEXT_PUBLIC_CONFIG_BASE_URL;
    }

    if (process.env.NODE_ENV !== 'production') {
        return DEV_CONFIG_BASE_URL;
    }

    return API_BASE_URL;
}

function normalizeRedirect(rule: unknown) {
    if (!isRecord(rule)) return [];

    const redirect = rule as RedirectRule;
    const source = getString(redirect.source);
    const destination = getString(redirect.destination);

    if (!source || !destination || !source.startsWith('/')) {
        return [];
    }

    return [
        {
            source,
            destination,
            permanent: getBoolean(redirect.permanent) ?? true,
        },
    ];
}

function normalizeRuntimeConfig(payload: unknown): RuntimeConfig {
    const config = getConfigRecord(payload);
    const redirects = Array.isArray(payload)
        ? payload
        : Array.isArray(config?.redirects)
          ? config.redirects
          : [];

    return {
        redirects: redirects.flatMap(normalizeRedirect),
        maintenance: normalizeMaintenance(config?.maintenance),
    };
}

function getConfigRecord(payload: unknown) {
    const record = getRecord(payload);
    const nestedConfig = getRecord(record?.config);

    return nestedConfig ?? record;
}

function normalizeMaintenance(value: unknown): RuntimeConfig['maintenance'] {
    const maintenance = getRecord(value);
    const scope =
        maintenance?.scope === 'pages' || maintenance?.scope === 'all'
            ? maintenance.scope
            : 'all';

    return {
        enabled: getBoolean(maintenance?.enabled) ?? false,
        scope,
        pages: normalizePageMaintenance(maintenance?.pages),
    };
}

function normalizePageMaintenance(value: unknown) {
    if (!Array.isArray(value)) return [];

    return value.flatMap<NormalizedPageMaintenanceRule>((item) => {
        const page = getRecord(item);
        const path =
            getString(item) ??
            getString(page?.path) ??
            getString(page?.page) ??
            getString(page?.route);

        if (!path) return [];

        return [
            {
                path: normalizePathname(path),
                mode: page?.mode === 'offHours' ? 'offHours' : 'maintenance',
            },
        ];
    });
}

function getPageMaintenance(config: RuntimeConfig, pathname: string) {
    if (!config.maintenance.enabled) return null;
    if (config.maintenance.scope === 'all') {
        return {
            path: pathname,
            mode: 'maintenance' as const,
        };
    }

    return (
        config.maintenance.pages.find((page) => page.path === pathname) ?? null
    );
}

function getEmptyRuntimeConfig(): RuntimeConfig {
    return {
        redirects: [],
        maintenance: {
            enabled: false,
            scope: 'all',
            pages: [],
        },
    };
}

// for remove "/" of at end of urls.
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

function isRouteMatch(pathname: string, routes: string[]) {
    return routes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`),
    );
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

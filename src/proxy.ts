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

// constants
const REDIRECTS_ENDPOINT =
    process.env.NEXT_PUBLIC_REDIRECTS_ENDPOINT ?? '/config';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://vtb1.hamgam.online';
const DEV_CONFIG_BASE_URL = 'http://localhost:8000';
const REDIRECTS_CACHE_TTL_MS = 60_000;
const TOKEN_COOKIE_NAME = 'token';
const SIGNIN_PATH = '/signin';
const AUTHENTICATED_HOME_PATH = '/panel';

const privateRoutes = ['/panel', '/checkout'];
const authRoutes = ['/signin', '/signup'];
let redirectsCache:
    | {
          expiresAt: number;
          redirects: NormalizedRedirectRule[];
      }
    | undefined;

export async function proxy(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    // check and apply redirects
    const normalizedPathname = normalizePathname(pathname);
    const redirects = await getRedirects();
    const redirect = redirects.find(
        (item) => normalizePathname(item.source) === normalizedPathname,
    );

    if (redirect) {
        const url = new URL(redirect.destination, request.url);

        return NextResponse.redirect(url, redirect.permanent ? 308 : 307);
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
async function getRedirects() {
    const configBaseUrl = getConfigBaseUrl();

    if (!configBaseUrl) return [];

    if (redirectsCache && redirectsCache.expiresAt > Date.now()) {
        return redirectsCache.redirects;
    }

    try {
        const response = await fetch(
            new URL(REDIRECTS_ENDPOINT, configBaseUrl),
            {
                headers: {
                    Accept: 'application/json',
                },
            },
        );

        if (!response.ok) return [];

        const payload = (await response.json()) as unknown;
        const redirects = Array.isArray(payload)
            ? payload
            : isRecord(payload) && Array.isArray(payload.redirects)
              ? payload.redirects
              : [];

        const normalizedRedirects = redirects.flatMap(normalizeRedirect);
        redirectsCache = {
            expiresAt: Date.now() + REDIRECTS_CACHE_TTL_MS,
            redirects: normalizedRedirects,
        };

        return normalizedRedirects;
    } catch {
        return [];
    }
}

async function isValidToken(token: string) {
    const configBaseUrl = getConfigBaseUrl();
    const response = await fetch(new URL(REDIRECTS_ENDPOINT, configBaseUrl), {
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

// for remove "/" of at end of urls.
function normalizePathname(pathname: string) {
    const normalized =
        pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;

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

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

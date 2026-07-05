const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://vtb1.hamgam.online';

export type ApiQuery = Record<
    string,
    string | number | boolean | null | undefined
>;

export function resolveApiUrl(path: string, query?: ApiQuery) {
    const url =
        path.startsWith('http://') || path.startsWith('https://')
            ? new URL(path)
            : new URL(path, getApiBaseUrl());

    if (query) {
        Object.entries(query).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '') return;
            url.searchParams.set(key, String(value));
        });
    }

    return url.toString();
}

function getApiBaseUrl() {
    if (!apiBaseUrl) {
        throw new Error('NEXT_PUBLIC_API_BASE_URL is required');
    }

    return apiBaseUrl;
}

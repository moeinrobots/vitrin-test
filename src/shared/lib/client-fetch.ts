import { ApiError } from './api-error';
import { resolveApiUrl, type ApiQuery } from './api-url';

type ClientFetchOptions = RequestInit & {
    query?: ApiQuery;
};

async function parseResponseBody(response: Response) {
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
        return response.json();
    }

    return response.text();
}

export async function clientFetch<T>(
    path: string,
    { query, headers, ...init }: ClientFetchOptions = {},
): Promise<T> {
    const response = await fetch(resolveClientUrl(path, query), {
        ...init,
        headers: {
            Accept: 'application/json',
            ...headers,
        },
    });

    if (!response.ok) {
        const body = await parseResponseBody(response);

        throw new ApiError(
            `Client fetch failed with status ${response.status}`,
            response.status,
            body,
        );
    }

    return parseResponseBody(response) as Promise<T>;
}

function resolveClientUrl(path: string, query?: ApiQuery) {
    if (!path.startsWith('/api/')) {
        return resolveApiUrl(path, query);
    }

    const url = new URL(path, window.location.origin);

    if (query) {
        Object.entries(query).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '') return;
            url.searchParams.set(key, String(value));
        });
    }

    return url.toString();
}

import { resolveApiUrl, type ApiQuery } from './api-url';
import { ApiError } from './api-error';

type ServerFetchOptions = Omit<RequestInit, 'cache'> & {
    cache?: 'force-cache' | 'no-store';
    revalidate?: false | 0 | number;
    tags?: string[];
    query?: ApiQuery;
    authRedirect?: boolean;
};

async function parseResponseBody(response: Response) {
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
        return response.json();
    }

    return response.text();
}

export async function serverFetch<T>(
    path: string,
    {
        revalidate,
        tags,
        query,
        authRedirect = true,
        headers,
        ...init
    }: ServerFetchOptions = {},
): Promise<T> {
    const response = await fetch(resolveApiUrl(path, query), {
        ...init,
        headers: {
            Accept: 'application/json',
            ...headers,
        },
        next: {
            revalidate,
            tags,
        },
    });

    if (authRedirect && (response.status === 401 || response.status === 403)) {
        const { redirect } = await import('next/navigation');

        redirect('/api/auth/logout?next=/signin');
    }

    if (!response.ok) {
        const body = await parseResponseBody(response);

        throw new ApiError(
            `Server fetch failed with status ${response.status}`,
            response.status,
            body,
        );
    }

    return parseResponseBody(response) as Promise<T>;
}

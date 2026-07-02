import { AuthSearchParams } from '../types/auth.types';

export async function getAuthQuery(searchParams: AuthSearchParams) {
    const params = await searchParams;

    return {
        next: getFirstValue(params.next),
    };
}

export function getAuthHref(pathname: string, query: { next?: string }) {
    const params = new URLSearchParams();

    if (query.next) params.set('next', query.next);

    const queryString = params.toString();

    if (!queryString) return pathname;

    return `${pathname}?${queryString}`;
}

function getFirstValue(value?: string | string[]) {
    if (Array.isArray(value)) return value[0];

    return value;
}

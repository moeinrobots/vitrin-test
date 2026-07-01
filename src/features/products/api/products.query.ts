import {
    allowedQueryKeys,
    DEFAULT_LIMIT,
} from '../utils/PorductList.constants';

import type { ApiQuery } from '@/shared/lib/api-url';
import type {
    NormalizedProductQuery,
    ProductQuery,
} from '../types/ProductList.types';

export function normalizeProductQuery(
    query: ProductQuery = {},
): NormalizedProductQuery {
    const normalized: NormalizedProductQuery = {
        limit: DEFAULT_LIMIT,
    };

    allowedQueryKeys.forEach((key) => {
        const value = firstValue(query[key]);
        if (!value) return;

        normalized[key] = value;
    });

    const page = Number(normalized.page ?? 1);
    const limit = Number(normalized.limit ?? DEFAULT_LIMIT);

    normalized.page = Number.isFinite(page) && page > 0 ? page : 1;
    normalized.limit =
        Number.isFinite(limit) && limit > 0 ? limit : DEFAULT_LIMIT;

    return normalized;
}

export function productQueryToApiQuery(
    query: NormalizedProductQuery,
): ApiQuery {
    const apiQuery: ApiQuery = {};
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? DEFAULT_LIMIT);

    Object.entries(query).forEach(([key, value]) => {
        if (key === 'page') return;
        apiQuery[key] = value;
    });

    if (!query.offset) {
        apiQuery.offset = (page - 1) * limit;
    }

    return apiQuery;
}

export function productListQueryKey(query: NormalizedProductQuery) {
    return ['products', query] as const;
}

function firstValue(value: ProductQuery[keyof ProductQuery]) {
    if (Array.isArray(value)) return value[0];

    return value;
}

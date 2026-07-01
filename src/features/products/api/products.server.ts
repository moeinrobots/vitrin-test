import { serverFetch } from '@/shared/lib/server-fetch';
import type {
    NormalizedProductQuery,
    ProductResponse,
    ProductResult,
} from '../types/ProductList.types';
import { productQueryToApiQuery } from './products.query';

const PRODUCTS_ENDPOINT = '/api/shop/products/';

export function getProducts(query: NormalizedProductQuery) {
    return serverFetch<ProductResponse>(PRODUCTS_ENDPOINT, {
        query: productQueryToApiQuery(query),
        revalidate: 60,
        tags: ['products'],
        authRedirect: false,
    });
}

export async function getProductBySlug(
    slug: string,
): Promise<ProductResult | null> {
    const products = await serverFetch<ProductResponse>(PRODUCTS_ENDPOINT, {
        query: {
            limit: 100,
        },
        revalidate: 60,
        tags: ['products', `product:${slug}`],
        authRedirect: false,
    });

    return products.results.find((product) => product.slug === slug) ?? null;
}

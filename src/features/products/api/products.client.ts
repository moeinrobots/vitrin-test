import { clientFetch } from '@/shared/lib/client-fetch';
import type {
    NormalizedProductQuery,
    ProductResponse,
} from '../types/ProductList.types';
import { productQueryToApiQuery } from './products.query';

const PRODUCTS_ENDPOINT = '/api/products';

export function getProductsClient(query: NormalizedProductQuery) {
    return clientFetch<ProductResponse>(PRODUCTS_ENDPOINT, {
        query: productQueryToApiQuery(query),
    });
}

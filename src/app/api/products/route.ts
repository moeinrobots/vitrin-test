import { NextResponse, type NextRequest } from 'next/server';
import { ApiError } from '@/shared/lib/api-error';
import { serverFetch } from '@/shared/lib/server-fetch';
import type { ProductResponse } from '@/features/products/types/ProductList.types';

const PRODUCTS_ENDPOINT = '/api/shop/products/';

export async function GET(request: NextRequest) {
    const query = Object.fromEntries(request.nextUrl.searchParams.entries());

    try {
        const products = await serverFetch<ProductResponse>(PRODUCTS_ENDPOINT, {
            query,
            authRedirect: false,
            cache: 'no-store',
        });

        return NextResponse.json(products);
    } catch (error) {
        if (error instanceof ApiError) {
            return NextResponse.json(error.body, { status: error.status });
        }

        return NextResponse.json(
            { detail: 'خطای دریافت محصولات' },
            { status: 500 },
        );
    }
}

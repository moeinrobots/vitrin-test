import { ProductQuery } from '@/features/products/types/ProductList.types';
import React from 'react';

export default async function ProductPage(searchParams: ProductQuery) {
    const params = await searchParams;

    //   const products = await getProducts({
    //     page: Number(params.page ?? 1),
    //     sort: params.sort ?? "newest",
    //     category: params.category,
    //   })

    return (
        <div>ProductList</div>
        // <ProductList initialProducts={products}/>
    );
}

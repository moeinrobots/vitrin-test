// product list types
export interface ProductResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ProductResult[];
}

export interface ProductResult {
    hasSelected?: boolean;
    id: number;
    image: MediaType;
    code: string;
    title: string;
    slug: string;
    stock_type: string;
    in_stock: boolean;
    stock: number;
    regular_price: number;
    sale_price: number;
    discount: number;
    discount_percent: number;
    price: number;
    rating: number;
    comments_count: number;
    price_notes: string;
    excerpt: string;
    is_favorite: boolean;
    brand_data: ProductBrand;
    category_data: ProductCategory[];
}

export interface MediaType {
    hasSelected?: boolean;
    id: number;
    type?: string;
    name: string;
    size: number;
    human_readable_size: string;
    f: string;
    width?: number;
    height?: number;
    mode?: string;
    thumbnails?: MediaThumbnail[];
}

export interface MediaThumbnail {
    id: number;
    f: string;
    size: number;
}

export interface ProductBrand {
    id: number;
    name: string;
}

export interface ProductCategory {
    id: number;
    name: string;
}

// query param types
type QueryParamValue = string | string[] | undefined;

export interface ProductQuery {
    page?: QueryParamValue;
    limit?: QueryParamValue;
    offset?: QueryParamValue;
    search?: QueryParamValue;
    ordering?: QueryParamValue;
    brand_id?: QueryParamValue;
    brand_in?: QueryParamValue;
    category_id?: QueryParamValue;
    category_in?: QueryParamValue;
    category_tree_id?: QueryParamValue;
    regular_price_min?: QueryParamValue;
    regular_price_max?: QueryParamValue;
    sale_price_min?: QueryParamValue;
    sale_price_max?: QueryParamValue;
    has_discount?: QueryParamValue;
    discount_percent_min?: QueryParamValue;
    discount_percent_max?: QueryParamValue;
    discount_min?: QueryParamValue;
    discount_max?: QueryParamValue;
    price_min?: QueryParamValue;
    price_max?: QueryParamValue;
    in_stock?: QueryParamValue;
    has_image?: QueryParamValue;
    has_comments?: QueryParamValue;
    comments_count_min?: QueryParamValue;
    comments_count_max?: QueryParamValue;
    rating_min?: QueryParamValue;
    rating_max?: QueryParamValue;
    id_min?: QueryParamValue;
    id_max?: QueryParamValue;
    created_date?: QueryParamValue;
    updated_date?: QueryParamValue;
    created_from?: QueryParamValue;
    created_to?: QueryParamValue;
    updated_from?: QueryParamValue;
    updated_to?: QueryParamValue;
}

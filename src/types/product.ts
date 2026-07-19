export interface ProductDimensions {
    width: number;
    height: number;
    depth: number;
}

export interface Product {
    id: number;
    title: string;
    description: string;
    subCategoryId: number;
    subCategoryName: string;
    categoryId: number;
    categoryName: string;
    price: number | null;
    discountPercentage: number | null;
    rating: number | null;
    stock: number;
    size: string | null;
    brand: string | null;
    sku: string | null;
    barcode: string;
    weight: number | null;
    availabilityStatus: string | null;

    // Artık URL listesi
    images: string[];

    thumbnail: string | null;

    userId: number;
    userEmail: string | null;
}

export interface CreateProductRequest {
    title: string;
    description: string;
    price: number | null;
    stock: number;
    categoryId: number;
    subCategoryId: number;
    brand: string;
    sku: string;
    discountPercentage: number;
    weight: number;
    size: string;
    dimensions: ProductDimensions;

    // Backend'e gönderilecek URL listesi
    images: string[];
}

export interface UpdateProductRequest {
    title: string;
    description: string;
    price: number | null;
    stock: number;
    categoryId: number;
    subCategoryId: number;
    brand: string;
    sku: string;
    discountPercentage: number;
    weight: number;
    size: string;
    dimensions: ProductDimensions;

    images: string[];
}

export interface ProductPage {
    content: Product[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    numberOfElements: number;
    empty: boolean;
}
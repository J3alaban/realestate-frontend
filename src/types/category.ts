export interface Category {
    id: number;
    name: string;
    slug: string;
    url: string;
}

export interface CreateCategoryRequest {
    name: string;
    slug: string;
}


export interface UpdateSubCategoryRequest {
    id: number;
    name: string;
    categoryId: number;
}
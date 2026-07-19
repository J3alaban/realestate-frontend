export interface SubCategory {
    id: number;
    name: string;
    categoryId: number;
    categoryName: string;
}

export interface CreateSubCategoryRequest {
    name: string;
    categoryId: number;
}
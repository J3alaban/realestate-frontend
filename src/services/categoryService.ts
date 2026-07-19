import api from "./api";
import {
    Category,
    CreateCategoryRequest,
} from "@/types/category";

export const getAllCategories = async (): Promise<Category[]> => {
    const response = await api.get<Category[]>("/api/v1/categories");

    return response.data;
};

export const createCategory = async (
    data: CreateCategoryRequest
): Promise<Category> => {
    const response = await api.post<Category>(
        "/api/v1/categories",
        data
    );

    return response.data;
};
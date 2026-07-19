import api from "./api";
import {
    SubCategory,
    CreateSubCategoryRequest,
} from "@/types/subcategory";

export const getAllSubCategories = async (): Promise<SubCategory[]> => {
    const response = await api.get<SubCategory[]>(
        "/api/v1/subcategories"
    );

    return response.data;
};

export const createSubCategory = async (
    data: CreateSubCategoryRequest
): Promise<SubCategory> => {
    const response = await api.post<SubCategory>(
        "/api/v1/subcategories",
        data
    );

    return response.data;
};
import {ProductPage} from "@/types/product";
import api from "@/services/api";

export const searchService = async (
    query: string,
    page = 0,
    size = 20
): Promise<ProductPage> => {
    const response = await api.get<ProductPage>(
        "/api/v1/products/search",
        {
            params: {
                query,
                page,
                size,
            },
        }
    );

    return response.data;
};
import api from "./api";
import {
    Product,
    ProductPage,
    CreateProductRequest,
    UpdateProductRequest,
} from "@/types/product";

export const getAllProducts = async (
    page: number = 0,
    size: number = 20
): Promise<ProductPage> => {
    const response = await api.get<ProductPage>(
        "/api/v1/products",
        {
            params: {
                page,
                size,
            },
        }
    );

    return response.data;
};

export const getProductById = async (
    id: number
): Promise<Product> => {
    const response = await api.get<Product>(
        `/api/v1/products/${id}`
    );

    return response.data;
};

export const getProductByBarcode = async (
    barcode: string
): Promise<Product> => {
    const response = await api.get<Product>(
        `/api/v1/products/barcode/${barcode}`
    );

    return response.data;
};

export const createProduct = async (
    userId: number,
    data: CreateProductRequest
): Promise<Product> => {
    const response = await api.post<Product>(
        `/api/v1/products/${userId}`,
        data
    );

    return response.data;
};

export const updateProduct = async (
    id: number,
    data: UpdateProductRequest
): Promise<Product> => {
    const response = await api.put<Product>(
        `/api/v1/products/${id}`,
        data
    );

    return response.data;
};

export const deleteProduct = async (
    id: number
): Promise<void> => {
    await api.delete(
        `/api/v1/products/${id}`
    );
};

export const updateProductStock = async (
    id: number,
    stock: number
): Promise<Product> => {
    const response = await api.put<Product>(
        `/api/v1/products/${id}/stock`,
        null,
        {
            params: {
                stock,
            },
        }
    );

    return response.data;
};

export const getProductsBySubCategory = async (
    subCategoryId: number,
    page: number = 0,
    size: number = 20
): Promise<ProductPage> => {
    const response = await api.get<ProductPage>(
        `/api/v1/products/sub-category/${subCategoryId}`,
        {
            params: {
                page,
                size,
            },
        }
    );

    return response.data;
};

export const uploadImage = async (
    file: File
): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<string>(
        "/api/v1/products/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};
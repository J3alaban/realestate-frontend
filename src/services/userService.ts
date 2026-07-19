import api from "./api";

import {
    LoginRequest,
    LoginResponse,
    User,
    UserRequest,
    ProductPage,
} from "@/types/user";

export const loginUser = async (
    data: LoginRequest
): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(
        "/api/v1/auth/login",
        data
    );

    return response.data;
};

export const registerUser = async (
    data: UserRequest
): Promise<User> => {
    const response = await api.post<User>(
        "/api/v1/auth/register",
        data
    );

    return response.data;
};

export const registerUsersBulk = async (
    data: UserRequest[]
): Promise<User[]> => {
    const response = await api.post<User[]>(
        "/api/v1/auth/register/bulk",
        data
    );

    return response.data;
};

export const getUserProfile = async (
    userId: number
): Promise<User> => {
    const response = await api.get<User>(
        `/api/v1/auth/${userId}/profile`
    );

    return response.data;
};

export const getUserProducts = async (
    userId: number,
    page: number = 0,
    size: number = 20
): Promise<ProductPage> => {
    const response = await api.get<ProductPage>(
        `/api/v1/auth/${userId}/products`,
        {
            params: {
                page,
                size,
            },
        }
    );

    return response.data;
};

export const getAllUsers = async (): Promise<User[]> => {
    const response = await api.get<User[]>(
        "/api/v1/auth"
    );

    return response.data;
};

export const updateUserProfile = async (
    userId: number,
    data: UserRequest
): Promise<User> => {
    const response = await api.put<User>(
        `/api/v1/auth/${userId}/profile`,
        data
    );

    return response.data;
};
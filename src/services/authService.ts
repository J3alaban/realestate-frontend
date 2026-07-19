import api from "./api";

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
}

export interface RegisterResponse {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    emailVerified: boolean;
}

export const registerUser = async (
    data: RegisterRequest
): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>(
        "/api/v1/auth/register",
        data
    );

    return response.data;
};
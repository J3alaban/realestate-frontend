import { Product } from "./product";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    id: string;
    role: string;
}

export interface UserRequest {
    firstName: string;
    lastName?: string;
    email?: string;
    password?: string;
    phone?: string;
    tcNo?: string;
}

export interface User {
    id: number;
    firstName: string;
    lastName?: string;
    email?: string;
    phone?: string;
    tcNo?: string;
    role: string;
    emailVerified?: boolean;
}

export interface ProductPage {
    content: Product[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}
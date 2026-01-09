import { User } from "@/types/type";

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        user: User;
    };
}

export interface RegisterCredentials {
    email: string;
    password: string;
    name?: string;
}

export interface RegisterResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        user: User;
    };
}

export interface ProfileResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
    };
}

export interface ApiResponse<T = never> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    token?: string;
    details?: never;
}
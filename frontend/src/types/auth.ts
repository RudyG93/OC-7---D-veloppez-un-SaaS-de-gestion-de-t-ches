import { User }  from "@/types/type";

export type LoginCredentials = {
    email: string;
    password: string;
};

export type LoginResponse = {
    success: boolean;
    message: string;
    data: {
        token: string;
        user: User;
    };
};
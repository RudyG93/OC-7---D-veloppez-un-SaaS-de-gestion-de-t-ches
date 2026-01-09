import { API_BASE_URL } from "@/lib/api";
import { cookieUtils } from "@/lib/cookies";
import {
    LoginCredentials,
    LoginResponse,
    RegisterCredentials,
    RegisterResponse,
    ProfileResponse,
} from "@/types/auth";

export async function loginApi(
    credentials: LoginCredentials
): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Échec de la connexion");
    }

    return data;
}

export async function registerApi(
    credentials: RegisterCredentials
): Promise<RegisterResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Échec de l'inscription");
    }

    return data;
}

export async function getProfileApi(): Promise<ProfileResponse> {
    const token = cookieUtils.getToken();

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Échec de la récupération du profil");
    }

    return data;
}

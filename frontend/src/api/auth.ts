/**
 * API d'authentification
 *
 * Ce module gère toutes les requêtes API liées à l'authentification :
 * - Connexion (login)
 * - Inscription (register)
 * - Récupération du profil
 * - Mise à jour du profil
 */

import { API_BASE_URL } from '@/lib/api';
import { cookieUtils } from '@/lib/cookies';
import {
    LoginCredentials,
    LoginResponse,
    RegisterCredentials,
    RegisterResponse,
    ProfileResponse,
    UpdateProfileData,
} from '@/types/auth';

// ============================================================================
// Fonctions API
// ============================================================================

/**
 * Connecte un utilisateur avec ses credentials
 *
 * @param credentials - Email et mot de passe de l'utilisateur
 * @returns Réponse contenant le token JWT et les infos utilisateur
 * @throws Error si les credentials sont invalides ou si le serveur renvoie une erreur
 *
 * @example
 * const response = await loginApi({ email: 'user@example.com', password: 'Password123' });
 * // response.data.token contient le JWT
 * // response.data.user contient les infos utilisateur
 */
export async function loginApi(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Échec de la connexion');
    }

    return data;
}

/**
 * Inscrit un nouvel utilisateur
 *
 * @param credentials - Email, mot de passe et nom (optionnel) de l'utilisateur
 * @returns Réponse contenant le token JWT et les infos utilisateur
 * @throws Error si l'email existe déjà ou si le serveur renvoie une erreur
 *
 * @example
 * const response = await registerApi({
 *   email: 'newuser@example.com',
 *   password: 'Password123',
 *   name: 'John Doe'
 * });
 */
export async function registerApi(credentials: RegisterCredentials): Promise<RegisterResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Échec de l'inscription");
    }

    return data;
}

/**
 * Récupère le profil de l'utilisateur connecté
 *
 * Nécessite un token JWT valide stocké dans les cookies.
 *
 * @returns Réponse contenant les informations du profil
 * @throws Error si le token est invalide ou expiré
 *
 * @example
 * const response = await getProfileApi();
 * // response.data.user contient les infos du profil
 */
export async function getProfileApi(): Promise<ProfileResponse> {
    const token = cookieUtils.getToken();

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Échec de la récupération du profil');
    }

    return data;
}

/**
 * Met à jour le profil de l'utilisateur connecté
 *
 * Seuls les champs fournis seront mis à jour.
 * Nécessite un token JWT valide stocké dans les cookies.
 *
 * @param profileData - Données à mettre à jour (name, email, password)
 * @returns Réponse contenant les informations du profil mis à jour
 * @throws Error si le token est invalide ou si la mise à jour échoue
 *
 * @example
 * // Mettre à jour uniquement le nom
 * await updateProfileApi({ name: 'Nouveau Nom' });
 *
 * // Mettre à jour email et mot de passe
 * await updateProfileApi({ email: 'new@email.com', password: 'NewPass123' });
 */
export async function updateProfileApi(profileData: UpdateProfileData): Promise<ProfileResponse> {
    const token = cookieUtils.getToken();

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Échec de la mise à jour du profil');
    }

    return data;
}

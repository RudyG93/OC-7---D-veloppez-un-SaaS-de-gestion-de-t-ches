/**
 * Configuration de l'API
 *
 * Ce module exporte les constantes de configuration pour les appels API.
 */

import { cookieUtils } from '@/lib/cookies';

// ============================================================================
// Configuration
// ============================================================================

/**
 * URL de base de l'API backend
 *
 * Utilise la variable d'environnement NEXT_PUBLIC_API_BASE_URL si définie,
 * sinon utilise localhost:8000 par défaut pour le développement.
 *
 * @example
 * // Dans un appel fetch
 * fetch(`${API_BASE_URL}/users/me`)
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

/**
 * Génère les headers d'authentification pour les requêtes API
 * Inclut le Content-Type JSON et le token Bearer JWT
 *
 * @returns Headers avec authentification
 *
 * @example
 * fetch(`${API_BASE_URL}/projects`, { headers: authHeaders() })
 */
export const authHeaders = () => {
    const token = cookieUtils.getToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    return headers;
};
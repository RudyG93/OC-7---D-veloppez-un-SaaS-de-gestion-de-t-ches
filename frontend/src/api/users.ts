/**
 * API des utilisateurs
 *
 * Ce module gère les appels API liés aux utilisateurs :
 * - Recherche d'utilisateurs
 *
 * @module api/users
 */

import { API_BASE_URL, authHeaders } from '@/lib/api';
import type { ApiResponse, User } from '@/types';

// ============================================================================
// Types
// ============================================================================

/** Réponse de la recherche d'utilisateurs */
interface UsersSearchResponse {
    users: User[];
}

// ============================================================================
// Endpoints
// ============================================================================

/**
 * Recherche des utilisateurs par nom ou email
 *
 * @param query - Terme de recherche (minimum 2 caractères)
 * @returns Liste des utilisateurs correspondants
 *
 * @example
 * const { data } = await searchUsersApi('john');
 * console.log(data.users); // [{ id: '1', name: 'John Doe', ... }]
 */
export async function searchUsersApi(query: string): Promise<ApiResponse<UsersSearchResponse>> {
    const response = await fetch(
        `${API_BASE_URL}/users/search?query=${encodeURIComponent(query)}`,
        {
            headers: authHeaders(),
        }
    );

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la recherche');
    }
    return data;
}
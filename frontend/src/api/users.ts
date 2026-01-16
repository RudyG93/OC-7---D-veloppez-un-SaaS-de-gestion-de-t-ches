import { API_BASE_URL } from '@/lib/api';
import { cookieUtils } from '@/lib/cookies';
import type { ApiResponse, User } from '@/types';

const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${cookieUtils.getToken()}`,
});

interface UsersSearchResponse {
    users: User[];
}

// Rechercher des utilisateurs
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
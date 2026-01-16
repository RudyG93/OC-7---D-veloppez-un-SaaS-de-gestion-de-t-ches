/**
 * Hooks pour la gestion des utilisateurs
 *
 * Ce module fournit des hooks React pour :
 * - useSearchUsers : Rechercher des utilisateurs par nom ou email
 */

'use client';

import { useState, useCallback } from 'react';
import { searchUsersApi } from '@/api/users';
import type { User } from '@/types';

// ============================================================================
// Hook recherche d'utilisateurs
// ============================================================================

/**
 * Hook pour rechercher des utilisateurs
 *
 * @returns Objet avec la fonction searchUsers, les résultats et les états
 *
 * @example
 * const { searchUsers, users, isLoading } = useSearchUsers();
 * await searchUsers('john');
 */
export function useSearchUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchUsers = useCallback(async (query: string) => {
        if (!query || query.length < 2) {
            setUsers([]);
            return [];
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await searchUsersApi(query);
            const foundUsers = response.data?.users ?? [];
            setUsers(foundUsers);
            return foundUsers;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur de recherche';
            setError(message);
            setUsers([]);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearUsers = useCallback(() => {
        setUsers([]);
    }, []);

    return { searchUsers, users, isLoading, error, clearUsers };
}

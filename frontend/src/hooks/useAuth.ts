/**
 * Hooks d'authentification
 *
 * Ce module fournit des hooks React pour gérer l'authentification :
 * - useLogin : Connexion avec gestion automatique du token
 * - useRegister : Inscription avec gestion automatique du token
 * - useProfile : Récupération du profil utilisateur
 * - useUpdateProfile : Mise à jour du profil
 * - useLogout : Déconnexion
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { loginApi, registerApi, getProfileApi, updateProfileApi } from '@/api/auth';
import { cookieUtils } from '@/lib/cookies';
import type { LoginCredentials, RegisterCredentials, UpdateProfileData, User } from '@/types';

// ============================================================================
// Hook de connexion
// ============================================================================

/**
 * Hook pour la connexion utilisateur
 *
 * @returns Objet avec la fonction login et les états
 *
 * @example
 * const { login, isLoading, error } = useLogin();
 * login({ email: 'user@example.com', password: 'Password123' });
 */
export function useLogin() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = useCallback(async (credentials: LoginCredentials) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await loginApi(credentials);
            cookieUtils.setToken(response.data.token);
            router.push('/dashboard');
            router.refresh();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur de connexion';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    return { login, isLoading, error };
}

// ============================================================================
// Hook d'inscription
// ============================================================================

/**
 * Hook pour l'inscription utilisateur
 *
 * @returns Objet avec la fonction register et les états
 *
 * @example
 * const { register, isLoading, error } = useRegister();
 * register({ email: 'user@example.com', password: 'Password123', name: 'John' });
 */
export function useRegister() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const register = useCallback(async (credentials: RegisterCredentials) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await registerApi(credentials);
            cookieUtils.setToken(response.data.token);
            router.push('/dashboard');
            router.refresh();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Erreur d'inscription";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    return { register, isLoading, error };
}

// ============================================================================
// Hook de profil
// ============================================================================

/**
 * Hook pour récupérer le profil utilisateur
 *
 * @returns Objet avec les données utilisateur et les états
 *
 * @example
 * const { user, isLoading, error, refetch } = useProfile();
 * if (isLoading) return <Spinner />;
 * return <div>Bonjour {user?.name}</div>;
 */
export function useProfile() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        const token = cookieUtils.getToken();
        if (!token) {
            setUser(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await getProfileApi();
            setUser(response.data.user);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur de chargement du profil';
            setError(message);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return { user, isLoading, error, refetch: fetchProfile };
}

// ============================================================================
// Hook de mise à jour du profil
// ============================================================================

/**
 * Hook pour mettre à jour le profil utilisateur
 *
 * @returns Objet avec la fonction updateProfile et les états
 *
 * @example
 * const { updateProfile, isLoading, error } = useUpdateProfile();
 * await updateProfile({ name: 'Nouveau nom' });
 */
export function useUpdateProfile() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateProfile = useCallback(async (data: UpdateProfileData) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await updateProfileApi(data);
            return response.data.user;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur de mise à jour';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { updateProfile, isLoading, error };
}

// ============================================================================
// Hook de déconnexion
// ============================================================================

/**
 * Hook pour la déconnexion
 *
 * @returns Fonction de déconnexion
 *
 * @example
 * const logout = useLogout();
 * <button onClick={logout}>Se déconnecter</button>
 */
export function useLogout() {
    const router = useRouter();

    return useCallback(() => {
        cookieUtils.removeToken();
        router.push('/login');
        router.refresh();
    }, [router]);
}

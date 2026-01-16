/**
 * Utilitaires de gestion des cookies
 *
 * Ce module gère le stockage sécurisé du token JWT dans les cookies.
 * Utilise js-cookie pour une manipulation simplifiée des cookies côté client.
 *
 * Configuration de sécurité :
 * - expires: 7 jours (correspondant à l'expiration du JWT backend)
 * - secure: true en production (HTTPS uniquement)
 * - sameSite: strict (protection CSRF)
 */

import Cookies from 'js-cookie';

// ============================================================================
// Configuration
// ============================================================================

/** Nom de la clé du cookie pour le token JWT */
const TOKEN_KEY = 'token';

/** Options de sécurité pour les cookies */
const COOKIE_OPTIONS: Cookies.CookieAttributes = {
    /** Durée de vie du cookie (doit correspondre à l'expiration JWT) */
    expires: 7,
    /** Utiliser HTTPS uniquement en production */
    secure: process.env.NODE_ENV === 'production',
    /** Protection contre les attaques CSRF */
    sameSite: 'strict',
};

// ============================================================================
// Utilitaires exportés
// ============================================================================

/**
 * Utilitaires pour la gestion du token d'authentification
 *
 * @example
 * // Stocker un token après connexion
 * cookieUtils.setToken(response.data.token);
 *
 * // Vérifier si l'utilisateur est connecté
 * const isLoggedIn = !!cookieUtils.getToken();
 *
 * // Déconnecter l'utilisateur
 * cookieUtils.removeToken();
 */
export const cookieUtils = {
    /**
     * Stocke le token JWT dans un cookie sécurisé
     * @param token - Token JWT à stocker
     */
    setToken: (token: string): void => {
        Cookies.set(TOKEN_KEY, token, COOKIE_OPTIONS);
    },

    /**
     * Récupère le token JWT depuis les cookies
     * @returns Le token JWT ou undefined si non présent
     */
    getToken: (): string | undefined => {
        return Cookies.get(TOKEN_KEY);
    },

    /**
     * Supprime le token JWT des cookies (déconnexion)
     */
    removeToken: (): void => {
        Cookies.remove(TOKEN_KEY);
    },
};

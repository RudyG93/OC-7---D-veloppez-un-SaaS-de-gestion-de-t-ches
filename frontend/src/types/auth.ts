/**
 * Types pour l'authentification et la gestion des utilisateurs
 *
 * Ce fichier définit les interfaces TypeScript pour :
 * - Les credentials de connexion/inscription
 * - Les réponses API d'authentification
 * - Les données de mise à jour du profil
 */

import type { User } from './user';

// ============================================================================
// Types des credentials (données envoyées au serveur)
// ============================================================================

/**
 * Credentials pour la connexion
 */
export interface LoginCredentials {
    /** Adresse email de l'utilisateur */
    email: string;
    /** Mot de passe de l'utilisateur */
    password: string;
}

/**
 * Credentials pour l'inscription
 */
export interface RegisterCredentials {
    /** Adresse email de l'utilisateur */
    email: string;
    /** Mot de passe (min 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre) */
    password: string;
    /** Nom complet de l'utilisateur (optionnel) */
    name?: string;
}

/**
 * Données pour la mise à jour du profil
 * Tous les champs sont optionnels - seuls les champs fournis seront mis à jour
 */
export interface UpdateProfileData {
    /** Nouveau nom complet */
    name?: string;
    /** Nouvelle adresse email */
    email?: string;
    /** Nouveau mot de passe */
    password?: string;
}

// ============================================================================
// Types des réponses API
// ============================================================================

/**
 * Réponse de l'API lors de la connexion
 */
export interface LoginResponse {
    /** Indique si la requête a réussi */
    success: boolean;
    /** Message descriptif */
    message: string;
    /** Données de la réponse */
    data: {
        /** Token JWT pour l'authentification */
        token: string;
        /** Informations de l'utilisateur connecté */
        user: User;
    };
}

/**
 * Réponse de l'API lors de l'inscription
 */
export interface RegisterResponse {
    /** Indique si la requête a réussi */
    success: boolean;
    /** Message descriptif */
    message: string;
    /** Données de la réponse */
    data: {
        /** Token JWT pour l'authentification */
        token: string;
        /** Informations de l'utilisateur créé */
        user: User;
    };
}

/**
 * Réponse de l'API pour le profil utilisateur
 */
export interface ProfileResponse {
    /** Indique si la requête a réussi */
    success: boolean;
    /** Message descriptif */
    message: string;
    /** Données de la réponse */
    data: {
        /** Informations de l'utilisateur */
        user: User;
    };
}

/**
 * Types Utilisateur
 */

/**
 * Représente un utilisateur de l'application
 */
export interface User {
    /** Identifiant unique de l'utilisateur */
    id: string;
    /** Adresse email (unique) */
    email: string;
    /** Nom complet de l'utilisateur (peut être null si non renseigné) */
    name: string | null;
    /** Date de création du compte */
    createdAt: string;
    /** Date de dernière mise à jour */
    updatedAt?: string;
}

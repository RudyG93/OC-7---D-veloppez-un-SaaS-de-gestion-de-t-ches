/**
 * Types génériques pour les réponses API
 */

/**
 * Structure générique d'une réponse API
 */
export interface ApiResponse<T> {
    /** Indique si la requête a réussi */
    success: boolean;
    /** Message descriptif */
    message: string;
    /** Données de la réponse (si succès) */
    data?: T;
    /** Message d'erreur (si échec) */
    error?: string;
}

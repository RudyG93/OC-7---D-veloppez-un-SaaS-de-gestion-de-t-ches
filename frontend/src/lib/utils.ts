/**
 * Utilitaires généraux
 *
 * Ce module contient des fonctions utilitaires réutilisables
 * à travers l'application.
 */

// ============================================================================
// Fonctions d'affichage
// ============================================================================

/**
 * Génère les initiales d'un utilisateur à partir de son nom ou email
 *
 * @param name - Nom complet de l'utilisateur
 * @param email - Email de l'utilisateur (fallback si pas de nom)
 * @returns Les initiales (max 2 caractères en majuscules)
 *
 * @example
 * getInitials('John Doe') // → 'JD'
 * getInitials('', 'user@mail.com') // → 'US'
 * getInitials('Alice') // → 'A'
 */
export const getInitials = (name: string, email?: string): string => {
    if (name) {
        const names = name.split(' ');
        const initials = names.map((n) => n.charAt(0).toUpperCase()).join('');
        return initials.slice(0, 2);
    }
    if (email) {
        return email.substring(0, 2).toUpperCase();
    }
    return '';
};

// ============================================================================
// Fonctions de formatage de dates
// ============================================================================

/**
 * Formate une date en format lisible français (jour + mois)
 *
 * @param dateString - Date ISO string
 * @returns Date formatée (ex: "15 janvier")
 *
 * @example
 * formatDate('2025-01-15T10:00:00Z') // → '15 janvier'
 */
export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
    });
};

/**
 * Formate une date en format relatif (il y a X minutes, heures, jours)
 *
 * @param dateString - Date ISO string
 * @returns Date formatée en relatif
 *
 * @example
 * formatRelativeDate('2025-02-04T10:00:00Z') // → 'Il y a 5 min'
 */
export const formatRelativeDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;

    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
    });
};
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
    // Si le nom est absent ou déjà sous forme d'initiales (2 lettres), on prend l'email
    if (!name || name.length === 2) {
        if (email) {
            return email.substring(0, 2).toUpperCase();
        }
        return '';
    }
    // Sinon, on génère les initiales à partir du nom
    const names = name.split(' ');
    const initials = names.map((n) => n.charAt(0).toUpperCase()).join('');
    return initials.slice(0, 2);
};

/**
 * Retourne le nom d'affichage d'un utilisateur (nom ou début de l'email)
 *
 * @param name - Nom complet (peut être null/undefined)
 * @param email - Email de l'utilisateur (fallback)
 * @returns Le nom ou la partie locale de l'email
 *
 * @example
 * getDisplayName('John Doe', 'john@mail.com') // → 'John Doe'
 * getDisplayName(null, 'john@mail.com') // → 'john'
 * getDisplayName('', 'john@mail.com') // → 'john'
 */
export const getDisplayName = (name: string | null | undefined, email: string): string => {
    return name || email.split('@')[0];
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
 * Formate une date avec jour, mois et heure (ex: "9 janvier, 11:42")
 *
 * @param dateString - Date ISO string
 * @returns Date formatée avec heure
 *
 * @example
 * formatDateTime('2025-01-09T11:42:00Z') // → '9 janvier, 11:42'
 */
export const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    const dayMonth = date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
    });
    const time = date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
    });
    return `${dayMonth}, ${time}`;
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
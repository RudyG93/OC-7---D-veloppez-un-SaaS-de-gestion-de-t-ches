/**
 * Utilitaires de gestion des permissions par projet
 *
 * Ce module gère les permissions basées sur les rôles utilisateur dans les projets.
 *
 * Rôles :
 * - OWNER / ADMIN : Tous les droits (affichés comme "Propriétaire")
 * - CONTRIBUTOR : Peut créer des tâches et supprimer les siennes (affiché comme "Contributeur")
 *
 * Actions disponibles :
 * - canEditProject : Modifier les infos du projet (OWNER, ADMIN)
 * - canDeleteProject : Supprimer le projet (OWNER, ADMIN)
 * - canManageContributors : Ajouter/supprimer des contributeurs (OWNER, ADMIN)
 * - canCreateTask : Créer des tâches (tous)
 * - canEditTask : Modifier une tâche (OWNER, ADMIN)
 * - canDeleteTask : Supprimer une tâche (OWNER, ADMIN, ou créateur si CONTRIBUTOR)
 */

import type { ProjectRole } from '@/types';

// ============================================================================
// Types
// ============================================================================

/**
 * Structure des permissions pour un utilisateur sur un projet
 */
export interface ProjectPermissions {
    /** Peut modifier les informations du projet */
    canEditProject: boolean;
    /** Peut supprimer le projet */
    canDeleteProject: boolean;
    /** Peut ajouter/supprimer des contributeurs */
    canManageContributors: boolean;
    /** Peut créer des tâches */
    canCreateTask: boolean;
    /** Peut modifier toutes les tâches */
    canEditAnyTask: boolean;
    /** Peut supprimer toutes les tâches */
    canDeleteAnyTask: boolean;
}

// ============================================================================
// Fonctions de vérification des permissions
// ============================================================================

/**
 * Retourne les permissions d'un utilisateur sur un projet
 *
 * @param userRole - Rôle de l'utilisateur dans le projet (OWNER ou CONTRIBUTOR)
 * @returns Objet contenant toutes les permissions
 *
 * @example
 * const permissions = getProjectPermissions(project.userRole);
 *
 * if (permissions.canEditProject) {
 *   // Afficher le bouton modifier
 * }
 */
export function getProjectPermissions(userRole?: ProjectRole): ProjectPermissions {
    // Si pas de rôle, aucune permission (ne devrait pas arriver car l'accès est bloqué)
    if (!userRole) {
        return {
            canEditProject: false,
            canDeleteProject: false,
            canManageContributors: false,
            canCreateTask: false,
            canEditAnyTask: false,
            canDeleteAnyTask: false,
        };
    }

    // OWNER et ADMIN : tous les droits
    if (userRole === 'OWNER' || userRole === 'ADMIN') {
        return {
            canEditProject: true,
            canDeleteProject: true,
            canManageContributors: true,
            canCreateTask: true,
            canEditAnyTask: true,
            canDeleteAnyTask: true,
        };
    }

    // CONTRIBUTOR : peut créer des tâches et supprimer les siennes
    return {
        canEditProject: false,
        canDeleteProject: false,
        canManageContributors: false,
        canCreateTask: true,
        canEditAnyTask: false,
        canDeleteAnyTask: false,
    };
}

/**
 * Vérifie si un utilisateur peut supprimer une tâche spécifique
 *
 * Un contributeur peut supprimer ses propres tâches,
 * un owner peut supprimer toutes les tâches.
 *
 * @param userRole - Rôle de l'utilisateur dans le projet
 * @param userId - ID de l'utilisateur courant
 * @param taskCreatorId - ID du créateur de la tâche
 * @returns true si l'utilisateur peut supprimer la tâche
 *
 * @example
 * if (canDeleteTask(project.userRole, currentUser.id, task.creatorId)) {
 *   // Afficher le bouton supprimer
 * }
 */
export function canDeleteTask(
    userRole?: ProjectRole,
    userId?: string,
    taskCreatorId?: string
): boolean {
    if (!userRole) return false;

    // Owner et Admin peuvent supprimer toutes les tâches
    if (userRole === 'OWNER' || userRole === 'ADMIN') {
        return true;
    }

    // Contributeur peut supprimer ses propres tâches
    if (userRole === 'CONTRIBUTOR' && userId && taskCreatorId) {
        return userId === taskCreatorId;
    }

    return false;
}

/**
 * Vérifie si un utilisateur peut modifier une tâche spécifique
 *
 * Owner et Admin peuvent modifier les tâches.
 *
 * @param userRole - Rôle de l'utilisateur dans le projet
 * @returns true si l'utilisateur peut modifier la tâche
 */
export function canEditTask(userRole?: ProjectRole): boolean {
    return userRole === 'OWNER' || userRole === 'ADMIN';
}

/**
 * Retourne le libellé français d'un rôle
 *
 * OWNER et ADMIN affichent "Propriétaire" car ils ont les mêmes droits.
 * CONTRIBUTOR affiche "Contributeur".
 *
 * @param role - Rôle à traduire
 * @returns Libellé en français
 */
export function getRoleLabel(role: ProjectRole): string {
    if (role === 'OWNER' || role === 'ADMIN') {
        return 'Propriétaire';
    }
    return 'Contributeur';
}

/**
 * Constantes partagées pour les tâches
 *
 * Ce module contient les configurations et constantes
 * réutilisables pour les composants liés aux tâches.
 *
 * @module lib/taskConstants
 */

import type { TaskStatus } from '@/types';

// ============================================================================
// Configuration des statuts
// ============================================================================

/**
 * Configuration des statuts de tâche pour l'affichage
 * Utilisé dans les formulaires de création/édition de tâches
 */
export const STATUS_CONFIG = {
    TODO: {
        label: 'À faire',
        activeClass: 'bg-red-100 text-red-600',
        ring: 'focus:ring-red-500',
    },
    IN_PROGRESS: {
        label: 'En cours',
        activeClass: 'bg-yellow-100 text-yellow-700',
        ring: 'focus:ring-yellow-500',
    },
    DONE: {
        label: 'Terminée',
        activeClass: 'bg-green-100 text-green-600',
        ring: 'focus:ring-green-500',
    },
} as const;

/** Statuts affichables dans les formulaires (exclut CANCELLED) */
export type DisplayableStatus = keyof typeof STATUS_CONFIG;

/**
 * Configuration des colonnes Kanban
 */
export const KANBAN_COLUMNS: { status: TaskStatus; title: string }[] = [
    { status: 'TODO', title: 'À faire' },
    { status: 'IN_PROGRESS', title: 'En cours' },
    { status: 'DONE', title: 'Terminée' },
];

// ============================================================================
// Labels des statuts
// ============================================================================

/**
 * Retourne le label français d'un statut de tâche
 *
 * @param status - Statut de la tâche
 * @returns Label en français
 */
export const getStatusLabel = (status: TaskStatus): string => {
    const labels: Record<TaskStatus, string> = {
        TODO: 'À faire',
        IN_PROGRESS: 'En cours',
        DONE: 'Terminée',
        CANCELLED: 'Annulée',
    };
    return labels[status] || status;
};

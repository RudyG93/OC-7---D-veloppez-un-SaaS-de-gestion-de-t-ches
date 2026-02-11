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
 * Configuration des styles de tags de statut
 * Utilisé dans StatusTag et les cartes de tâches
 */
export const STATUS_TAG_CONFIG: Record<TaskStatus, { label: string; className: string }> = {
    TODO: {
        label: 'À faire',
        className: 'bg-[#FFE0E0] text-[#EF4444] border-[#FFE0E0]',
    },
    IN_PROGRESS: {
        label: 'En cours',
        className: 'bg-[#FFF0D7] text-[#E08D00] border-[#FFF0D7]',
    },
    DONE: {
        label: 'Terminée',
        className: 'bg-[#F1FFF7] text-[#27AE60] border-[#F1FFF7]',
    },
    CANCELLED: {
        label: 'Annulée',
        className: 'bg-gray-100 text-gray-600 border-gray-200',
    },
};

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

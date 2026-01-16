/**
 * API du tableau de bord
 *
 * Ce module fournit les fonctions d'appel API pour :
 * - Récupérer les tâches assignées à l'utilisateur
 * - Récupérer les projets avec leurs tâches
 * - Récupérer les statistiques globales du dashboard
 *
 * Toutes les fonctions nécessitent une authentification via JWT.
 */

import { API_BASE_URL } from '@/lib/api';
import { cookieUtils } from '@/lib/cookies';
import type {
    ApiResponse,
    TasksResponse,
    ProjectsResponse,
    StatsResponse,
} from '@/types';

// ============================================================================
// Configuration
// ============================================================================

/**
 * Génère les headers d'authentification pour les requêtes API
 * @returns Headers avec authentification Bearer JWT
 */
const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${cookieUtils.getToken()}`,
});

// ============================================================================
// Fonctions API
// ============================================================================

/**
 * Récupère les tâches assignées à l'utilisateur connecté
 *
 * Retourne toutes les tâches où l'utilisateur est assigné,
 * indépendamment du projet. Utile pour la vue "Mes tâches"
 * du tableau de bord.
 *
 * @returns Liste des tâches avec informations du projet parent
 * @throws Error si la requête échoue
 *
 * @example
 * const response = await getAssignedTasksApi();
 * const tasks = response.data.tasks;
 * // Afficher les tâches dans une liste ou un kanban
 */
export async function getAssignedTasksApi(): Promise<ApiResponse<TasksResponse>> {
    const response = await fetch(`${API_BASE_URL}/dashboard/assigned-tasks`, {
        headers: authHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération des tâches');
    }
    return data;
}

/**
 * Récupère les projets de l'utilisateur avec leurs tâches
 *
 * Retourne tous les projets où l'utilisateur est membre,
 * avec les tâches complètes pour calculer la progression.
 * Utilisé dans la liste des projets pour afficher
 * les statistiques de chaque projet.
 *
 * @returns Liste des projets avec tâches et informations de progression
 * @throws Error si la requête échoue
 *
 * @example
 * const response = await getProjectsWithTasksApi();
 * const projects = response.data.projects;
 * // Calculer la progression de chaque projet
 * projects.forEach(p => {
 *   const done = p.tasks.filter(t => t.status === 'DONE').length;
 *   const progress = (done / p.tasks.length) * 100;
 * });
 */
export async function getProjectsWithTasksApi(): Promise<ApiResponse<ProjectsResponse>> {
    const response = await fetch(`${API_BASE_URL}/dashboard/projects-with-tasks`, {
        headers: authHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération des projets');
    }
    return data;
}

/**
 * Récupère les statistiques globales du tableau de bord
 *
 * Retourne les métriques agrégées pour l'utilisateur :
 * - tasks.total : Nombre total de tâches assignées
 * - tasks.urgent : Nombre de tâches avec priorité URGENT
 * - tasks.overdue : Nombre de tâches en retard
 * - tasks.byStatus : Répartition par statut (TODO, IN_PROGRESS, DONE, CANCELLED)
 * - projects.total : Nombre total de projets
 *
 * @returns Statistiques du dashboard
 * @throws Error si la requête échoue
 *
 * @example
 * const response = await getDashboardStatsApi();
 * const stats = response.data.stats;
 * console.log(`${stats.tasks.total} tâches, ${stats.tasks.urgent} urgentes`);
 */
export async function getDashboardStatsApi(): Promise<ApiResponse<StatsResponse>> {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
        headers: authHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération des statistiques');
    }
    return data;
}

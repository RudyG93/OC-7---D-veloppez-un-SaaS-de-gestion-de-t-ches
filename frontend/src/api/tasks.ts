/**
 * API de gestion des tâches
 *
 * Ce module fournit les fonctions d'appel API pour :
 * - Récupérer les tâches d'un projet
 * - Récupérer une tâche spécifique
 * - Créer une nouvelle tâche
 * - Modifier une tâche existante (statut, assignés, etc.)
 * - Supprimer une tâche
 *
 * Les tâches sont toujours liées à un projet (projectId requis).
 * Toutes les fonctions nécessitent une authentification via JWT.
 */

import { API_BASE_URL } from '@/lib/api';
import { cookieUtils } from '@/lib/cookies';
import type {
    ApiResponse,
    TasksResponse,
    TaskResponse,
    CreateTaskRequest,
    UpdateTaskRequest,
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
// Fonctions de lecture (GET)
// ============================================================================

/**
 * Récupère toutes les tâches d'un projet
 *
 * Retourne les tâches avec :
 * - Informations complètes (titre, description, statut, priorité)
 * - Date d'échéance
 * - Liste des utilisateurs assignés
 * - Nombre de commentaires (_count.comments)
 *
 * @param projectId - Identifiant du projet parent
 * @returns Liste des tâches du projet
 * @throws Error si le projet n'existe pas ou accès refusé
 *
 * @example
 * const response = await getTasksApi('project-uuid');
 * const tasks = response.data.tasks;
 * // Filtrer par statut
 * const todoTasks = tasks.filter(t => t.status === 'TODO');
 */
export async function getTasksApi(projectId: string): Promise<ApiResponse<TasksResponse>> {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks`, {
        headers: authHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération des tâches');
    }
    return data;
}

/**
 * Récupère les détails d'une tâche spécifique
 *
 * Retourne la tâche avec ses informations complètes,
 * incluant les commentaires si disponibles.
 *
 * @param projectId - Identifiant du projet parent
 * @param taskId - Identifiant de la tâche
 * @returns Tâche avec ses détails complets
 * @throws Error si la tâche n'existe pas ou accès refusé
 *
 * @example
 * const response = await getTaskApi('project-uuid', 'task-uuid');
 * const task = response.data.task;
 */
export async function getTaskApi(
    projectId: string,
    taskId: string
): Promise<ApiResponse<TaskResponse>> {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks/${taskId}`, {
        headers: authHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération de la tâche');
    }
    return data;
}

// ============================================================================
// Fonctions de création/modification (POST/PUT)
// ============================================================================

/**
 * Crée une nouvelle tâche dans un projet
 *
 * L'utilisateur connecté devient le créateur de la tâche.
 * La tâche est créée avec le statut TODO par défaut.
 *
 * @param projectId - Identifiant du projet parent
 * @param task - Données de la tâche à créer
 * @param task.title - Titre de la tâche (requis)
 * @param task.description - Description détaillée (optionnel)
 * @param task.priority - Priorité : LOW, MEDIUM, HIGH, URGENT (défaut: MEDIUM)
 * @param task.dueDate - Date d'échéance au format ISO (optionnel)
 * @param task.assigneeIds - IDs des utilisateurs à assigner (optionnel)
 * @returns Tâche créée avec ses informations
 * @throws Error si la création échoue
 *
 * @example
 * const response = await createTaskApi('project-uuid', {
 *   title: 'Implémenter la fonctionnalité X',
 *   description: 'Description détaillée...',
 *   priority: 'HIGH',
 *   dueDate: '2024-12-31T23:59:59.000Z',
 *   assigneeIds: ['user-uuid-1', 'user-uuid-2']
 * });
 */
export async function createTaskApi(
    projectId: string,
    task: CreateTaskRequest
): Promise<ApiResponse<TaskResponse>> {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(task),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la création de la tâche');
    }
    return data;
}

/**
 * Met à jour une tâche existante
 *
 * Permet de modifier tous les champs de la tâche :
 * - Titre et description
 * - Statut (TODO → IN_PROGRESS → DONE)
 * - Priorité
 * - Date d'échéance
 * - Liste des assignés
 *
 * Seuls les champs fournis seront modifiés (mise à jour partielle).
 *
 * @param projectId - Identifiant du projet parent
 * @param taskId - Identifiant de la tâche à modifier
 * @param task - Données à mettre à jour
 * @returns Tâche mise à jour
 * @throws Error si la tâche n'existe pas ou droits insuffisants
 *
 * @example
 * // Changer le statut d'une tâche
 * await updateTaskApi('project-uuid', 'task-uuid', {
 *   status: 'IN_PROGRESS'
 * });
 *
 * // Assigner des utilisateurs
 * await updateTaskApi('project-uuid', 'task-uuid', {
 *   assigneeIds: ['user-1', 'user-2']
 * });
 */
export async function updateTaskApi(
    projectId: string,
    taskId: string,
    task: UpdateTaskRequest
): Promise<ApiResponse<TaskResponse>> {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(task),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la mise à jour de la tâche');
    }
    return data;
}

// ============================================================================
// Fonctions de suppression (DELETE)
// ============================================================================

/**
 * Supprime une tâche
 *
 * Action irréversible qui supprime également :
 * - Tous les commentaires de la tâche
 * - Toutes les assignations
 *
 * Permissions requises :
 * - OWNER/ADMIN du projet : peut supprimer n'importe quelle tâche
 * - CONTRIBUTOR : peut supprimer uniquement ses propres tâches
 *
 * @param projectId - Identifiant du projet parent
 * @param taskId - Identifiant de la tâche à supprimer
 * @returns Confirmation de suppression
 * @throws Error si la tâche n'existe pas ou droits insuffisants
 *
 * @example
 * await deleteTaskApi('project-uuid', 'task-uuid');
 * // Rafraîchir la liste des tâches
 */
export async function deleteTaskApi(
    projectId: string,
    taskId: string
): Promise<ApiResponse<null>> {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la suppression de la tâche');
    }
    return data;
}

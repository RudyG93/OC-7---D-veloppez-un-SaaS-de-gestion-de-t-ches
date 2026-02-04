/**
 * API de gestion des commentaires
 *
 * Ce module fournit les fonctions d'appel API pour :
 * - Récupérer les commentaires d'une tâche
 * - Créer un nouveau commentaire
 * - Modifier un commentaire existant
 * - Supprimer un commentaire
 *
 * Les commentaires sont liés à une tâche spécifique (taskId requis).
 * Toutes les fonctions nécessitent une authentification via JWT.
 */

import { API_BASE_URL, authHeaders } from '@/lib/api';
import type {
    ApiResponse,
    CommentsResponse,
    CommentResponse,
    CreateCommentRequest,
    UpdateCommentRequest,
} from '@/types';

// ============================================================================
// Fonctions de lecture (GET)
// ============================================================================

/**
 * Récupère tous les commentaires d'une tâche
 *
 * Retourne les commentaires avec :
 * - Contenu du commentaire
 * - Informations de l'auteur (nom, email)
 * - Dates de création et modification
 *
 * @param projectId - Identifiant du projet parent
 * @param taskId - Identifiant de la tâche
 * @returns Liste des commentaires de la tâche
 * @throws Error si la tâche n'existe pas ou accès refusé
 *
 * @example
 * const response = await getCommentsApi('project-uuid', 'task-uuid');
 * const comments = response.data.comments;
 */
export async function getCommentsApi(
    projectId: string,
    taskId: string
): Promise<ApiResponse<CommentsResponse>> {
    const response = await fetch(
        `${API_BASE_URL}/projects/${projectId}/tasks/${taskId}/comments`,
        {
            headers: authHeaders(),
        }
    );

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération des commentaires');
    }
    return data;
}

// ============================================================================
// Fonctions de création/modification (POST/PUT)
// ============================================================================

/**
 * Crée un nouveau commentaire sur une tâche
 *
 * L'utilisateur connecté devient automatiquement l'auteur du commentaire.
 * Permet la collaboration entre membres du projet sur une tâche.
 *
 * @param projectId - Identifiant du projet parent
 * @param taskId - Identifiant de la tâche
 * @param comment - Données du commentaire
 * @param comment.content - Contenu du commentaire (requis)
 * @returns Commentaire créé avec ses informations
 * @throws Error si la création échoue
 *
 * @example
 * const response = await createCommentApi('project-uuid', 'task-uuid', {
 *   content: 'Bonne avancée sur cette tâche !'
 * });
 */
export async function createCommentApi(
    projectId: string,
    taskId: string,
    comment: CreateCommentRequest
): Promise<ApiResponse<CommentResponse>> {
    const response = await fetch(
        `${API_BASE_URL}/projects/${projectId}/tasks/${taskId}/comments`,
        {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(comment),
        }
    );

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la création du commentaire');
    }
    return data;
}

/**
 * Met à jour un commentaire existant
 *
 * Seul l'auteur du commentaire peut le modifier.
 * La date de modification (updatedAt) est mise à jour automatiquement.
 *
 * @param projectId - Identifiant du projet parent
 * @param taskId - Identifiant de la tâche
 * @param commentId - Identifiant du commentaire à modifier
 * @param comment - Nouvelles données
 * @param comment.content - Nouveau contenu du commentaire
 * @returns Commentaire mis à jour
 * @throws Error si le commentaire n'existe pas ou si l'utilisateur n'est pas l'auteur
 *
 * @example
 * await updateCommentApi('project-uuid', 'task-uuid', 'comment-uuid', {
 *   content: 'Commentaire modifié'
 * });
 */
export async function updateCommentApi(
    projectId: string,
    taskId: string,
    commentId: string,
    comment: UpdateCommentRequest
): Promise<ApiResponse<CommentResponse>> {
    const response = await fetch(
        `${API_BASE_URL}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
        {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify(comment),
        }
    );

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la mise à jour du commentaire');
    }
    return data;
}

// ============================================================================
// Fonctions de suppression (DELETE)
// ============================================================================

/**
 * Supprime un commentaire
 *
 * Permissions requises :
 * - L'auteur du commentaire peut le supprimer
 * - Les OWNER/ADMIN du projet peuvent supprimer n'importe quel commentaire
 *
 * @param projectId - Identifiant du projet parent
 * @param taskId - Identifiant de la tâche
 * @param commentId - Identifiant du commentaire à supprimer
 * @returns Confirmation de suppression
 * @throws Error si le commentaire n'existe pas ou droits insuffisants
 *
 * @example
 * await deleteCommentApi('project-uuid', 'task-uuid', 'comment-uuid');
 */
export async function deleteCommentApi(
    projectId: string,
    taskId: string,
    commentId: string
): Promise<ApiResponse<null>> {
    const response = await fetch(
        `${API_BASE_URL}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
        {
            method: 'DELETE',
            headers: authHeaders(),
        }
    );

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la suppression du commentaire');
    }
    return data;
}

/**
 * Hooks pour la gestion des commentaires
 *
 * Ce module fournit des hooks React pour :
 * - useComments : Récupérer les commentaires d'une tâche
 * - useCreateComment : Créer un commentaire
 * - useUpdateComment : Modifier un commentaire
 * - useDeleteComment : Supprimer un commentaire
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    getCommentsApi,
    createCommentApi,
    updateCommentApi,
    deleteCommentApi,
} from '@/api/comments';
import type { Comment, CreateCommentRequest, UpdateCommentRequest } from '@/types';

// ============================================================================
// Hook liste des commentaires
// ============================================================================

/**
 * Hook pour récupérer les commentaires d'une tâche
 *
 * @param projectId - Identifiant du projet
 * @param taskId - Identifiant de la tâche
 * @returns Objet avec les commentaires et les états
 *
 * @example
 * const { comments, isLoading, error, refetch } = useComments('project-id', 'task-id');
 */
export function useComments(projectId: string, taskId: string) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchComments = useCallback(async () => {
        if (!projectId || !taskId) {
            setComments([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await getCommentsApi(projectId, taskId);
            setComments(response.data?.comments ?? []);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur de chargement';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, [projectId, taskId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    return { comments, isLoading, error, refetch: fetchComments };
}

// ============================================================================
// Hook création de commentaire
// ============================================================================

/**
 * Hook pour créer un nouveau commentaire
 *
 * @returns Objet avec la fonction createComment et les états
 *
 * @example
 * const { createComment, isLoading, error } = useCreateComment();
 * await createComment('project-id', 'task-id', { content: 'Mon commentaire' });
 */
export function useCreateComment() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createComment = useCallback(
        async (projectId: string, taskId: string, data: CreateCommentRequest) => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await createCommentApi(projectId, taskId, data);
                return response.data?.comment;
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Erreur de création';
                setError(message);
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    return { createComment, isLoading, error };
}

// ============================================================================
// Hook mise à jour de commentaire
// ============================================================================

/**
 * Hook pour mettre à jour un commentaire
 *
 * @returns Objet avec la fonction updateComment et les états
 *
 * @example
 * const { updateComment, isLoading, error } = useUpdateComment();
 * await updateComment('project-id', 'task-id', 'comment-id', { content: 'Modifié' });
 */
export function useUpdateComment() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateComment = useCallback(
        async (
            projectId: string,
            taskId: string,
            commentId: string,
            data: UpdateCommentRequest
        ) => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await updateCommentApi(projectId, taskId, commentId, data);
                return response.data?.comment;
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Erreur de mise à jour';
                setError(message);
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    return { updateComment, isLoading, error };
}

// ============================================================================
// Hook suppression de commentaire
// ============================================================================

/**
 * Hook pour supprimer un commentaire
 *
 * @returns Objet avec la fonction deleteComment et les états
 *
 * @example
 * const { deleteComment, isLoading, error } = useDeleteComment();
 * await deleteComment('project-id', 'task-id', 'comment-id');
 */
export function useDeleteComment() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteComment = useCallback(
        async (projectId: string, taskId: string, commentId: string) => {
            setIsLoading(true);
            setError(null);

            try {
                await deleteCommentApi(projectId, taskId, commentId);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Erreur de suppression';
                setError(message);
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    return { deleteComment, isLoading, error };
}

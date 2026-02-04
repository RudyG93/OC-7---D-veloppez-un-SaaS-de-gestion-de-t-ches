/**
 * Hooks pour la gestion des tâches
 *
 * Ce module fournit des hooks React pour :
 * - useTasks : Récupérer les tâches d'un projet
 * - useCreateTask : Créer une tâche
 * - useUpdateTask : Modifier une tâche
 * - useDeleteTask : Supprimer une tâche
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    getTasksApi,
    createTaskApi,
    updateTaskApi,
    deleteTaskApi,
} from '@/api/tasks';
import type { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types';

// ============================================================================
// Hook liste des tâches
// ============================================================================

/**
 * Hook pour récupérer toutes les tâches d'un projet
 *
 * @param projectId - Identifiant du projet
 * @returns Objet avec les tâches et les états
 *
 * @example
 * const { tasks, isLoading, error, refetch } = useTasks('project-id');
 */
export function useTasks(projectId: string) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = useCallback(async () => {
        if (!projectId) {
            setTasks([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await getTasksApi(projectId);
            setTasks(response.data?.tasks ?? []);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur de chargement';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    return { tasks, isLoading, error, refetch: fetchTasks };
}

// ============================================================================
// Hook création de tâche
// ============================================================================

/**
 * Hook pour créer une nouvelle tâche
 *
 * @returns Objet avec la fonction createTask et les états
 *
 * @example
 * const { createTask, isLoading, error } = useCreateTask();
 * const newTask = await createTask('project-id', { title: 'Ma tâche' });
 */
export function useCreateTask() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createTask = useCallback(async (projectId: string, data: CreateTaskRequest) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await createTaskApi(projectId, data);
            return response.data?.task;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur de création';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { createTask, isLoading, error };
}

// ============================================================================
// Hook mise à jour de tâche
// ============================================================================

/**
 * Hook pour mettre à jour une tâche
 *
 * @returns Objet avec la fonction updateTask et les états
 *
 * @example
 * const { updateTask, isLoading, error } = useUpdateTask();
 * await updateTask('project-id', 'task-id', { status: 'DONE' });
 */
export function useUpdateTask() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateTask = useCallback(
        async (projectId: string, taskId: string, data: UpdateTaskRequest) => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await updateTaskApi(projectId, taskId, data);
                return response.data?.task;
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

    return { updateTask, isLoading, error };
}

// ============================================================================
// Hook suppression de tâche
// ============================================================================

/**
 * Hook pour supprimer une tâche
 *
 * @returns Objet avec la fonction deleteTask et les états
 *
 * @example
 * const { deleteTask, isLoading, error } = useDeleteTask();
 * await deleteTask('project-id', 'task-id');
 */
export function useDeleteTask() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteTask = useCallback(async (projectId: string, taskId: string) => {
        setIsLoading(true);
        setError(null);

        try {
            await deleteTaskApi(projectId, taskId);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur de suppression';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { deleteTask, isLoading, error };
}

/**
 * Hook pour le tableau de bord
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAssignedTasksApi } from '@/api/dashboard';
import type { Task } from '@/types';

/**
 * Hook pour récupérer les tâches assignées à l'utilisateur
 */
export function useAssignedTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await getAssignedTasksApi();
            setTasks(response.data?.tasks ?? []);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur de chargement';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    return { tasks, isLoading, error, refetch: fetchTasks };
}

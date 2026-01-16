/**
 * Hooks pour le tableau de bord
 *
 * Ce module fournit des hooks React pour :
 * - useAssignedTasks : Récupérer les tâches assignées à l'utilisateur
 * - useProjectsWithTasks : Récupérer les projets avec leurs tâches
 * - useDashboardStats : Récupérer les statistiques du dashboard
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    getAssignedTasksApi,
    getProjectsWithTasksApi,
    getDashboardStatsApi,
} from '@/api/dashboard';
import type { Task, Project, DashboardStats } from '@/types';

// ============================================================================
// Hook tâches assignées
// ============================================================================

/**
 * Hook pour récupérer les tâches assignées à l'utilisateur
 *
 * @returns Objet avec les tâches et les états
 *
 * @example
 * const { tasks, isLoading, error, refetch } = useAssignedTasks();
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

// ============================================================================
// Hook projets avec tâches
// ============================================================================

/**
 * Hook pour récupérer les projets avec leurs tâches
 *
 * @returns Objet avec les projets et les états
 *
 * @example
 * const { projects, isLoading, error, refetch } = useProjectsWithTasks();
 */
export function useProjectsWithTasks() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await getProjectsWithTasksApi();
            setProjects(response.data?.projects ?? []);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur de chargement';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    return { projects, isLoading, error, refetch: fetchProjects };
}

// ============================================================================
// Hook statistiques
// ============================================================================

/**
 * Hook pour récupérer les statistiques du dashboard
 *
 * @returns Objet avec les statistiques et les états
 *
 * @example
 * const { stats, isLoading, error, refetch } = useDashboardStats();
 */
export function useDashboardStats() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await getDashboardStatsApi();
            setStats(response.data?.stats ?? null);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur de chargement';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { stats, isLoading, error, refetch: fetchStats };
}

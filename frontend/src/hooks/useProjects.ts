/**
 * Hooks pour la gestion des projets
 *
 * Ce module fournit des hooks React pour :
 * - useProjects : Récupérer la liste des projets
 * - useProject : Récupérer un projet spécifique
 * - useCreateProject : Créer un projet
 * - useUpdateProject : Modifier un projet
 * - useDeleteProject : Supprimer un projet
 * - useAddContributor : Ajouter un contributeur
 * - useRemoveContributor : Supprimer un contributeur
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    getProjectsApi,
    getProjectApi,
    createProjectApi,
    updateProjectApi,
    deleteProjectApi,
    addContributorApi,
    removeContributorApi,
} from '@/api/projects';
import type {
    Project,
    CreateProjectRequest,
    UpdateProjectRequest,
    AddContributorRequest,
} from '@/types';

// ============================================================================
// Hook liste des projets
// ============================================================================

/**
 * Hook pour récupérer tous les projets de l'utilisateur
 *
 * @returns Objet avec les projets et les états
 *
 * @example
 * const { projects, isLoading, error, refetch } = useProjects();
 */
export function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await getProjectsApi();
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
// Hook projet unique
// ============================================================================

/**
 * Hook pour récupérer un projet spécifique
 *
 * @param id - Identifiant du projet
 * @returns Objet avec le projet et les états
 *
 * @example
 * const { project, isLoading, error, refetch } = useProject('project-id');
 */
export function useProject(id: string) {
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProject = useCallback(async () => {
        if (!id) {
            setProject(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await getProjectApi(id);
            setProject(response.data?.project ?? null);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur de chargement';
            setError(message);
            setProject(null);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProject();
    }, [fetchProject]);

    return { project, isLoading, error, refetch: fetchProject };
}

// ============================================================================
// Hook création de projet
// ============================================================================

/**
 * Hook pour créer un nouveau projet
 *
 * @returns Objet avec la fonction createProject et les états
 *
 * @example
 * const { createProject, isLoading, error } = useCreateProject();
 * const newProject = await createProject({ name: 'Mon projet' });
 */
export function useCreateProject() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createProject = useCallback(async (data: CreateProjectRequest) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await createProjectApi(data);
            return response.data?.project;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur de création';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { createProject, isLoading, error };
}

// ============================================================================
// Hook mise à jour de projet
// ============================================================================

/**
 * Hook pour mettre à jour un projet
 *
 * @returns Objet avec la fonction updateProject et les états
 *
 * @example
 * const { updateProject, isLoading, error } = useUpdateProject();
 * await updateProject('project-id', { name: 'Nouveau nom' });
 */
export function useUpdateProject() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateProject = useCallback(async (id: string, data: UpdateProjectRequest) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await updateProjectApi(id, data);
            return response.data?.project;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur de mise à jour';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { updateProject, isLoading, error };
}

// ============================================================================
// Hook suppression de projet
// ============================================================================

/**
 * Hook pour supprimer un projet
 *
 * @returns Objet avec la fonction deleteProject et les états
 *
 * @example
 * const { deleteProject, isLoading, error } = useDeleteProject();
 * await deleteProject('project-id');
 */
export function useDeleteProject() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteProject = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);

        try {
            await deleteProjectApi(id);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur de suppression';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { deleteProject, isLoading, error };
}

// ============================================================================
// Hook ajout de contributeur
// ============================================================================

/**
 * Hook pour ajouter un contributeur à un projet
 *
 * @returns Objet avec la fonction addContributor et les états
 *
 * @example
 * const { addContributor, isLoading, error } = useAddContributor();
 * await addContributor('project-id', { email: 'user@example.com', role: 'CONTRIBUTOR' });
 */
export function useAddContributor() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addContributor = useCallback(async (projectId: string, data: AddContributorRequest) => {
        setIsLoading(true);
        setError(null);

        try {
            await addContributorApi(projectId, data);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Erreur d'ajout";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { addContributor, isLoading, error };
}

// ============================================================================
// Hook suppression de contributeur
// ============================================================================

/**
 * Hook pour supprimer un contributeur d'un projet
 *
 * @returns Objet avec la fonction removeContributor et les états
 *
 * @example
 * const { removeContributor, isLoading, error } = useRemoveContributor();
 * await removeContributor('project-id', 'user-id');
 */
export function useRemoveContributor() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const removeContributor = useCallback(async (projectId: string, userId: string) => {
        setIsLoading(true);
        setError(null);

        try {
            await removeContributorApi(projectId, userId);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur de suppression';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { removeContributor, isLoading, error };
}

/**
 * Types Tâche
 */

import type { User } from './user';
import type { Comment } from './comment';

/**
 * Statuts possibles d'une tâche
 */
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';

/**
 * Niveaux de priorité d'une tâche
 */
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

/**
 * Représente l'assignation d'un utilisateur à une tâche
 */
export interface TaskAssignee {
    /** Identifiant unique de l'assignation */
    id: string;
    /** ID de l'utilisateur assigné */
    userId: string;
    /** ID de la tâche */
    taskId: string;
    /** Informations de l'utilisateur assigné */
    user: User;
    /** Date d'assignation */
    assignedAt: string;
}

/**
 * Représente une tâche dans un projet
 */
export interface Task {
    /** Identifiant unique de la tâche */
    id: string;
    /** Titre de la tâche */
    title: string;
    /** Description détaillée (optionnelle) */
    description: string | null;
    /** Statut actuel de la tâche */
    status: TaskStatus;
    /** Niveau de priorité */
    priority: TaskPriority;
    /** Date d'échéance (optionnelle) */
    dueDate: string | null;
    /** ID du projet parent */
    projectId: string;
    /** ID du créateur de la tâche */
    creatorId: string;
    /** Informations du créateur */
    creator?: User;
    /** Informations minimales du projet parent */
    project?: {
        id: string;
        name: string;
    };
    /** Liste des utilisateurs assignés à la tâche */
    assignees: TaskAssignee[];
    /** Commentaires de la tâche */
    comments?: Comment[];
    /** Compteurs agrégés */
    _count?: {
        /** Nombre de commentaires */
        comments: number;
    };
    /** Date de création */
    createdAt: string;
    /** Date de dernière mise à jour */
    updatedAt: string;
}

/**
 * Données pour créer une nouvelle tâche
 */
export interface CreateTaskRequest {
    /** Titre de la tâche (requis) */
    title: string;
    /** Description de la tâche */
    description?: string;
    /** Niveau de priorité (défaut: MEDIUM) */
    priority?: TaskPriority;
    /** Date d'échéance (format ISO) */
    dueDate?: string;
    /** IDs des utilisateurs à assigner */
    assigneeIds?: string[];
}

/**
 * Données pour modifier une tâche existante
 */
export interface UpdateTaskRequest {
    /** Nouveau titre */
    title?: string;
    /** Nouvelle description */
    description?: string;
    /** Nouveau statut */
    status?: TaskStatus;
    /** Nouvelle priorité */
    priority?: TaskPriority;
    /** Nouvelle date d'échéance (null pour supprimer) */
    dueDate?: string | null;
    /** Nouvelle liste d'assignés */
    assigneeIds?: string[];
}

/** Réponse pour la liste des tâches */
export interface TasksResponse {
    tasks: Task[];
}

/** Réponse pour une tâche unique */
export interface TaskResponse {
    task: Task;
}

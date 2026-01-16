/**
 * Types Projet
 */

import type { User } from './user';
import type { Task } from './task';

/**
 * Rôles possibles d'un utilisateur dans un projet
 *
 * - OWNER : Créateur/propriétaire du projet, tous les droits
 * - ADMIN : Membre administrateur, peut éditer le projet et gérer les tâches
 * - CONTRIBUTOR : Peut créer des tâches et supprimer les siennes
 */
export type ProjectRole = 'OWNER' | 'ADMIN' | 'CONTRIBUTOR';

/**
 * Représente un membre d'un projet (hors propriétaire)
 */
export interface ProjectMember {
    /** Identifiant unique de l'adhésion */
    id: string;
    /** ID de l'utilisateur membre */
    userId: string;
    /** Rôle du membre dans le projet (toujours CONTRIBUTOR pour les membres ajoutés) */
    role: ProjectRole;
    /** Informations de l'utilisateur */
    user: User;
    /** Date d'ajout au projet */
    joinedAt: string;
}

/**
 * Représente un projet collaboratif
 */
export interface Project {
    /** Identifiant unique du projet */
    id: string;
    /** Nom du projet */
    name: string;
    /** Description du projet (optionnelle) */
    description: string | null;
    /** ID du propriétaire du projet */
    ownerId: string;
    /** Informations du propriétaire */
    owner: User;
    /** Liste des membres (hors propriétaire) */
    members: ProjectMember[];
    /** Tâches du projet (optionnel, selon la requête) */
    tasks?: Task[];
    /** Rôle de l'utilisateur courant dans ce projet */
    userRole?: ProjectRole;
    /** Compteurs agrégés */
    _count?: {
        /** Nombre total de tâches */
        tasks: number;
    };
    /** Date de création */
    createdAt: string;
    /** Date de dernière mise à jour */
    updatedAt: string;
}

/**
 * Données pour créer un nouveau projet
 */
export interface CreateProjectRequest {
    /** Nom du projet (requis) */
    name: string;
    /** Description du projet */
    description?: string;
    /** Liste des emails des contributeurs à ajouter */
    contributors?: string[];
}

/**
 * Données pour modifier un projet existant
 */
export interface UpdateProjectRequest {
    /** Nouveau nom */
    name?: string;
    /** Nouvelle description */
    description?: string;
}

/**
 * Données pour ajouter un contributeur à un projet
 */
export interface AddContributorRequest {
    /** Email du contributeur à ajouter */
    email: string;
    /** Rôle à attribuer (toujours CONTRIBUTOR) */
    role?: 'CONTRIBUTOR';
}

/** Réponse pour la liste des projets */
export interface ProjectsResponse {
    projects: Project[];
}

/** Réponse pour un projet unique */
export interface ProjectResponse {
    project: Project;
}

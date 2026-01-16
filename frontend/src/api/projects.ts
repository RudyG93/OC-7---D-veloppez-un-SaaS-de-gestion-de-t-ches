/**
 * API de gestion des projets
 *
 * Ce module fournit les fonctions d'appel API pour :
 * - Récupérer la liste des projets de l'utilisateur
 * - Récupérer un projet spécifique
 * - Créer un nouveau projet
 * - Modifier un projet existant
 * - Supprimer un projet
 * - Gérer les contributeurs (ajout/suppression)
 *
 * Toutes les fonctions nécessitent une authentification via JWT.
 * Les erreurs sont propagées avec des messages explicites.
 */

import { API_BASE_URL } from '@/lib/api';
import { cookieUtils } from '@/lib/cookies';
import type {
    ApiResponse,
    ProjectsResponse,
    ProjectResponse,
    CreateProjectRequest,
    UpdateProjectRequest,
    AddContributorRequest,
} from '@/types';

// ============================================================================
// Configuration
// ============================================================================

/**
 * Génère les headers d'authentification pour les requêtes API
 * Inclut le Content-Type JSON et le token Bearer JWT
 *
 * @returns Headers avec authentification
 */
const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${cookieUtils.getToken()}`,
});

// ============================================================================
// Fonctions de lecture (GET)
// ============================================================================

/**
 * Récupère tous les projets de l'utilisateur connecté
 *
 * Retourne les projets où l'utilisateur est :
 * - Propriétaire (OWNER)
 * - Administrateur (ADMIN)
 * - Contributeur (CONTRIBUTOR)
 *
 * @returns Liste des projets avec leurs informations de base
 * @throws Error si la requête échoue ou si l'utilisateur n'est pas authentifié
 *
 * @example
 * const response = await getProjectsApi();
 * const projects = response.data.projects;
 */
export async function getProjectsApi(): Promise<ApiResponse<ProjectsResponse>> {
    const response = await fetch(`${API_BASE_URL}/projects`, {
        headers: authHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération des projets');
    }
    return data;
}

/**
 * Récupère les détails d'un projet spécifique
 *
 * Retourne le projet avec :
 * - Informations du propriétaire
 * - Liste des membres et leurs rôles
 * - Rôle de l'utilisateur courant (userRole)
 * - Tâches du projet (optionnel selon l'endpoint backend)
 *
 * @param id - Identifiant unique du projet
 * @returns Projet avec ses détails complets
 * @throws Error si le projet n'existe pas ou si l'accès est refusé
 *
 * @example
 * const response = await getProjectApi('project-uuid');
 * const project = response.data.project;
 * console.log(project.userRole); // 'OWNER' | 'ADMIN' | 'CONTRIBUTOR'
 */
export async function getProjectApi(id: string): Promise<ApiResponse<ProjectResponse>> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        headers: authHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération du projet');
    }
    return data;
}

// ============================================================================
// Fonctions de création/modification (POST/PUT)
// ============================================================================

/**
 * Crée un nouveau projet
 *
 * L'utilisateur connecté devient automatiquement le propriétaire (OWNER)
 * du projet créé avec tous les droits.
 *
 * @param project - Données du projet à créer
 * @param project.name - Nom du projet (requis)
 * @param project.description - Description du projet (optionnel)
 * @param project.contributors - Emails des contributeurs à ajouter (optionnel)
 * @returns Projet créé avec ses informations
 * @throws Error si la création échoue (nom invalide, etc.)
 *
 * @example
 * const response = await createProjectApi({
 *   name: 'Mon nouveau projet',
 *   description: 'Description du projet',
 *   contributors: ['collaborateur@email.com']
 * });
 */
export async function createProjectApi(
    project: CreateProjectRequest
): Promise<ApiResponse<ProjectResponse>> {
    const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(project),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la création du projet');
    }
    return data;
}

/**
 * Met à jour un projet existant
 *
 * Seuls les champs fournis seront modifiés (mise à jour partielle).
 * Nécessite le rôle OWNER ou ADMIN sur le projet.
 *
 * @param id - Identifiant du projet à modifier
 * @param project - Données à mettre à jour
 * @param project.name - Nouveau nom (optionnel)
 * @param project.description - Nouvelle description (optionnel)
 * @returns Projet mis à jour
 * @throws Error si l'utilisateur n'a pas les droits ou si le projet n'existe pas
 *
 * @example
 * const response = await updateProjectApi('project-uuid', {
 *   name: 'Nouveau nom',
 *   description: 'Nouvelle description'
 * });
 */
export async function updateProjectApi(
    id: string,
    project: UpdateProjectRequest
): Promise<ApiResponse<ProjectResponse>> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(project),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la mise à jour du projet');
    }
    return data;
}

// ============================================================================
// Fonctions de suppression (DELETE)
// ============================================================================

/**
 * Supprime un projet
 *
 * Action irréversible qui supprime également :
 * - Toutes les tâches du projet
 * - Tous les commentaires des tâches
 * - Toutes les assignations de membres
 *
 * Nécessite le rôle OWNER sur le projet.
 *
 * @param id - Identifiant du projet à supprimer
 * @returns Confirmation de suppression
 * @throws Error si l'utilisateur n'est pas OWNER ou si le projet n'existe pas
 *
 * @example
 * await deleteProjectApi('project-uuid');
 * // Rediriger vers la liste des projets
 */
export async function deleteProjectApi(id: string): Promise<ApiResponse<null>> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la suppression du projet');
    }
    return data;
}

// ============================================================================
// Gestion des contributeurs
// ============================================================================

/**
 * Ajoute un contributeur au projet
 *
 * Le contributeur est identifié par son email. S'il n'existe pas dans
 * le système, une erreur sera retournée.
 *
 * Nécessite le rôle OWNER ou ADMIN sur le projet.
 *
 * @param projectId - Identifiant du projet
 * @param contributor - Données du contributeur
 * @param contributor.email - Email de l'utilisateur à ajouter
 * @param contributor.role - Rôle à attribuer ('ADMIN' | 'CONTRIBUTOR', défaut: 'CONTRIBUTOR')
 * @returns Confirmation d'ajout
 * @throws Error si l'email n'existe pas, si l'utilisateur est déjà membre, ou si les droits sont insuffisants
 *
 * @example
 * await addContributorApi('project-uuid', {
 *   email: 'nouveau@collaborateur.com',
 *   role: 'CONTRIBUTOR'
 * });
 */
export async function addContributorApi(
    projectId: string,
    contributor: AddContributorRequest
): Promise<ApiResponse<null>> {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/contributors`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(contributor),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'ajout du contributeur");
    }
    return data;
}

/**
 * Retire un contributeur du projet
 *
 * Supprime l'accès de l'utilisateur au projet.
 * Le propriétaire (OWNER) ne peut pas être retiré.
 *
 * Nécessite le rôle OWNER ou ADMIN sur le projet.
 *
 * @param projectId - Identifiant du projet
 * @param userId - Identifiant de l'utilisateur à retirer
 * @returns Confirmation de suppression
 * @throws Error si l'utilisateur n'est pas membre ou si les droits sont insuffisants
 *
 * @example
 * await removeContributorApi('project-uuid', 'user-uuid');
 * // Rafraîchir la liste des membres
 */
export async function removeContributorApi(
    projectId: string,
    userId: string
): Promise<ApiResponse<null>> {
    const response = await fetch(
        `${API_BASE_URL}/projects/${projectId}/contributors/${userId}`,
        {
            method: 'DELETE',
            headers: authHeaders(),
        }
    );

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la suppression du contributeur');
    }
    return data;
}

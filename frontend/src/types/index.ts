/**
 * Point d'entrée des types de l'application
 * Réexporte tous les types par domaine
 */

// Types utilisateur
export type { User } from './user';

// Types projet
export type {
    ProjectRole,
    ProjectMember,
    Project,
    CreateProjectRequest,
    UpdateProjectRequest,
    AddContributorRequest,
    ProjectsResponse,
    ProjectResponse,
} from './project';

// Types tâche
export type {
    TaskStatus,
    TaskPriority,
    TaskAssignee,
    Task,
    CreateTaskRequest,
    UpdateTaskRequest,
    TasksResponse,
    TaskResponse,
} from './task';

// Types commentaire
export type {
    Comment,
    CreateCommentRequest,
    UpdateCommentRequest,
    CommentsResponse,
    CommentResponse,
} from './comment';

// Types API génériques
export type { ApiResponse } from './api';

// Types authentification
export type {
    LoginCredentials,
    RegisterCredentials,
    UpdateProfileData,
    LoginResponse,
    RegisterResponse,
    ProfileResponse,
} from './auth';

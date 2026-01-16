/**
 * Types Commentaire
 */

import type { User } from './user';

/**
 * Représente un commentaire sur une tâche
 */
export interface Comment {
    /** Identifiant unique du commentaire */
    id: string;
    /** Contenu du commentaire */
    content: string;
    /** ID de la tâche associée */
    taskId: string;
    /** ID de l'auteur */
    authorId: string;
    /** Informations de l'auteur */
    author: User;
    /** Informations minimales de la tâche */
    task?: {
        id: string;
        title: string;
    };
    /** Date de création */
    createdAt: string;
    /** Date de dernière mise à jour */
    updatedAt: string;
}

/**
 * Données pour créer un commentaire
 */
export interface CreateCommentRequest {
    /** Contenu du commentaire (requis) */
    content: string;
}

/**
 * Données pour modifier un commentaire
 */
export interface UpdateCommentRequest {
    /** Nouveau contenu */
    content: string;
}

/** Réponse pour la liste des commentaires */
export interface CommentsResponse {
    comments: Comment[];
}

/** Réponse pour un commentaire unique */
export interface CommentResponse {
    comment: Comment;
}

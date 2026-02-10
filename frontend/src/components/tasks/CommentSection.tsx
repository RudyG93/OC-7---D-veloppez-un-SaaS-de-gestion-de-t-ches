'use client';

import { useState } from 'react';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { formatDateTime, getDisplayName } from '@/lib/utils';
import { useComments, useCreateComment } from '@/hooks/useComments';
import { useProfile } from '@/hooks/useAuth';

// ============================================================================
// Types
// ============================================================================

interface CommentSectionProps {
    /** ID du projet */
    projectId: string;
    /** ID de la tâche */
    taskId: string;
    /** Si la section est visible (pour charger les commentaires) */
    isVisible: boolean;
    /** Callback appelé après l'ajout d'un commentaire (pour mettre à jour le compteur) */
    onCommentAdded?: () => void;
}

// ============================================================================
// Composant principal
// ============================================================================

/**
 * Section de commentaires d'une tâche
 * Affiche la liste des commentaires et un formulaire pour en ajouter
 */
export function CommentSection({ projectId, taskId, isVisible, onCommentAdded }: CommentSectionProps) {
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { user } = useProfile();

    const { comments, isLoading, refetch } = useComments(
        isVisible ? projectId : '',
        isVisible ? taskId : ''
    );
    const { createComment, isLoading: isCreating } = useCreateComment();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setError(null);
        try {
            await createComment(projectId, taskId, { content: newComment.trim() });
            setNewComment('');
            refetch();
            onCommentAdded?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur lors de l'envoi");
        }
    };

    return (
        <div className="mt-4 space-y-4">
            {/* Liste des commentaires */}
            {isLoading ? (
                <div className="flex items-center justify-center py-4">
                    <Spinner size="sm" label="Chargement des commentaires" />
                </div>
            ) : comments.length === 0 ? (
                <p className="text-sm font-body text-sub italic py-2">
                    Aucun commentaire pour le moment
                </p>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 items-start">
                            <Avatar
                                name={comment.author.name}
                                email={comment.author.email}
                                size="sm"
                                className="shrink-0 mt-1"
                            />
                            <div className="flex-1 bg-background rounded-xl px-5 py-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-heading font-semibold text-heading mb-2">
                                        {getDisplayName(comment.author.name, comment.author.email)}
                                    </span>
                                    <span className="text-xs font-body text-sub">
                                        {formatDateTime(comment.createdAt)}
                                    </span>
                                </div>
                                <p className="text-sm font-body text-sub">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Formulaire de nouveau commentaire */}
            <form onSubmit={handleSubmit}>
                <div className="flex gap-3 items-start">
                    <Avatar
                        name={user?.name}
                        email={user?.email}
                        size="sm"
                        variant="light"
                        className="shrink-0 mt-1"
                    />
                    <div className="flex-1">
                        <label htmlFor={`comment-${taskId}`} className="sr-only">Nouveau commentaire</label>
                        <textarea
                            id={`comment-${taskId}`}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Ajouter un commentaire..."
                            rows={3}
                            className="w-full bg-background rounded-xl px-5 py-4 text-sm font-body text-heading placeholder:text-sub resize-none focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>
                </div>
                <div className="flex justify-end mt-3">
                    <Button
                        type="submit"
                        disabled={isCreating || !newComment.trim()}
                        variant="secondary"
                        size="proj"
                    >
                        {isCreating ? 'Envoi...' : 'Envoyer'}
                    </Button>
                </div>
            </form>

            {error && (
                <p className="text-sm text-red-500 font-body">{error}</p>
            )}
        </div>
    );
}

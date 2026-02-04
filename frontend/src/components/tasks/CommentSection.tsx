'use client';

import { useState } from 'react';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { formatRelativeDate } from '@/lib/utils';
import { useComments, useCreateComment } from '@/hooks/useComments';
import type { Comment } from '@/types';

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
// Composant interne : Liste des commentaires
// ============================================================================

function CommentList({ comments }: { comments: Comment[] }) {
    if (comments.length === 0) {
        return (
            <p className="text-sm text-gray-400 italic py-2">
                Aucun commentaire pour le moment
            </p>
        );
    }

    return (
        <div className="space-y-3 mb-4">
            {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                    <Avatar
                        name={comment.author.name}
                        email={comment.author.email}
                        size="md"
                        className="shrink-0"
                    />
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">
                                {comment.author.name || comment.author.email.split('@')[0]}
                            </span>
                            <span className="text-xs text-gray-400">
                                {formatRelativeDate(comment.createdAt)}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-0.5">
                            {comment.content}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
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

    // Charger les commentaires seulement quand la section est visible
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
            onCommentAdded?.(); // Notifier le parent pour mettre à jour le compteur
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur lors de l'envoi");
        }
    };

    return (
        <div className="mt-4 border-t border-gray-100 pt-4">
            {/* Liste des commentaires */}
            {isLoading ? (
                <div className="flex items-center justify-center py-4">
                    <Spinner size="sm" label="Chargement des commentaires" />
                </div>
            ) : (
                <CommentList comments={comments} />
            )}

            {/* Formulaire de nouveau commentaire */}
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ajouter un commentaire..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D3590B] focus:border-transparent"
                />
                <Button
                    type="submit"
                    disabled={isCreating || !newComment.trim()}
                    variant="orange"
                    size="md"
                >
                    {isCreating ? 'Envoi...' : 'Envoyer'}
                </Button>
            </form>

            {error && (
                <p className="text-sm text-red-500 mt-2">{error}</p>
            )}
        </div>
    );
}

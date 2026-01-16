'use client';

import { useState } from 'react';
import type { Task, TaskStatus, ProjectRole } from '@/types';
import StatusTag from '@/components/tasks/StatusTag';
import { canDeleteTask, canEditTask } from '@/lib/permissions';
import { getInitials } from '@/lib/utils';
import { useComments, useCreateComment } from '@/hooks/useComments';

interface TaskProjectProps {
  task: Task;
  projectId: string;
  isExpanded: boolean;
  onToggle: () => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onEdit: () => void;
  userRole?: ProjectRole;
  userId?: string;
}

export default function TaskProject({
  task,
  projectId,
  isExpanded,
  onToggle,
  onStatusChange,
  onDelete,
  onEdit,
  userRole,
  userId,
}: TaskProjectProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentError, setCommentError] = useState<string | null>(null);

  // Charger les commentaires seulement quand la section est étendue
  const { comments, isLoading: commentsLoading, refetch: refetchComments } = useComments(
    isExpanded ? projectId : '',
    isExpanded ? task.id : ''
  );
  const { createComment, isLoading: isCreating } = useCreateComment();

  // Vérifier les permissions pour cette tâche
  const canEdit = canEditTask(userRole);
  const canDelete = canDeleteTask(userRole, userId, task.creatorId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
    });
  };

  const formatCommentDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;

    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommentError(null);
    try {
      await createComment(projectId, task.id, { content: newComment.trim() });
      setNewComment('');
      refetchComments();
    } catch (err) {
      setCommentError(err instanceof Error ? err.message : "Erreur lors de l'envoi");
    }
  };

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          {/* Titre + Status */}
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-medium text-gray-900">{task.title}</h3>
            <StatusTag status={task.status} />
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-sm text-gray-500 mb-3">{task.description}</p>
          )}

          {/* Métadonnées */}
          <div className="flex items-center gap-6 text-sm text-gray-500">
            {task.dueDate && (
              <div className="flex items-center gap-2">
                <span>Échéance :</span>
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {formatDate(task.dueDate)}
                </span>
              </div>
            )}

            {task.assignees && task.assignees.length > 0 && (
              <div className="flex items-center gap-2">
                <span>Assigné à :</span>
                <div className="flex items-center gap-1">
                  {task.assignees.map((assignee) => (
                    <div
                      key={assignee.id}
                      className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-full"
                    >
                      <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-[10px] font-medium text-gray-700">
                        {getInitials(assignee.user.name || '', assignee.user.email)}
                      </div>
                      <span className="text-xs">
                        {assignee.user.name || assignee.user.email.split('@')[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Commentaires (expandable) */}
          <button
            onClick={onToggle}
            className="flex items-center gap-2 mt-3 text-sm text-gray-500 hover:text-gray-700"
          >
            <span>Commentaires ({task._count?.comments ?? 0})</span>
            <svg
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>

          {/* Section commentaires étendue */}
          {isExpanded && (
            <div className="mt-4 border-t border-gray-100 pt-4">
              {/* Liste des commentaires */}
              {commentsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <span className="loading loading-spinner loading-sm text-gray-400"></span>
                </div>
              ) : comments.length === 0 ? (
                <p className="text-sm text-gray-400 italic py-2">
                  Aucun commentaire pour le moment
                </p>
              ) : (
                <div className="space-y-3 mb-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-xs font-medium text-gray-700">
                        {getInitials(comment.author.name || '', comment.author.email)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">
                            {comment.author.name || comment.author.email.split('@')[0]}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatCommentDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-0.5">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Formulaire de nouveau commentaire */}
              <form onSubmit={handleSubmitComment} className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Ajouter un commentaire..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D3590B] focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={isCreating || !newComment.trim()}
                  className="px-4 py-2 bg-[#D3590B] text-white text-sm font-medium rounded-lg hover:bg-[#B84D0A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    'Envoyer'
                  )}
                </button>
              </form>

              {commentError && (
                <p className="text-sm text-red-500 mt-2">{commentError}</p>
              )}
            </div>
          )}
        </div>

        {/* Menu actions */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {showMenu && (
            <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-35 z-10">
              {canEdit && (
                <>
                  <button
                    onClick={() => {
                      onEdit();
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Modifier
                  </button>
                  <hr className="my-1 border-gray-200" />
                  {task.status !== 'TODO' && (
                    <button
                      onClick={() => {
                        onStatusChange(task, 'TODO');
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      → À faire
                    </button>
                  )}
                  {task.status !== 'IN_PROGRESS' && (
                    <button
                      onClick={() => {
                        onStatusChange(task, 'IN_PROGRESS');
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      → En cours
                    </button>
                  )}
                  {task.status !== 'DONE' && (
                    <button
                      onClick={() => {
                        onStatusChange(task, 'DONE');
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      → Terminée
                    </button>
                  )}
                </>
              )}
              {canDelete && (
                <>
                  {canEdit && <hr className="my-1 border-gray-200" />}
                  <button
                    onClick={() => {
                      onDelete(task.id);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Supprimer
                  </button>
                </>
              )}
              {!canEdit && !canDelete && (
                <p className="px-3 py-2 text-sm text-gray-500">
                  Aucune action disponible
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

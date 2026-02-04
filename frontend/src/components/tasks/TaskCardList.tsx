/**
 * Carte de tâche (vue liste)
 *
 * Affiche une tâche avec :
 * - Titre et description
 * - Métadonnées (projet, échéance, commentaires)
 * - Statut et bouton d'action
 *
 * @module components/tasks/TaskCardList
 */

'use client';

import type { Task } from '@/types';
import StatusTag from './StatusTag';
import Button from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

interface TaskCardProps {
    /** Tâche à afficher */
    task: Task;
    /** Callback au clic sur la carte */
    onClick?: () => void;
}

// ============================================================================
// Composant
// ============================================================================

export default function TaskCard({ task, onClick }: TaskCardProps) {
    const commentsCount = task._count?.comments ?? task.comments?.length ?? 0;

    return (
        <article
            tabIndex={0}
            role="listitem"
            aria-label={`Tâche: ${task.title}, statut: ${task.status === 'TODO' ? 'À faire' : task.status === 'IN_PROGRESS' ? 'En cours' : task.status === 'DONE' ? 'Terminée' : task.status}`}
            className="card-interactive p-6"
            onClick={() => onClick?.()}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick?.();
                }
            }}
        >
            <div className="flex items-start justify-between gap-4">
                {/* Contenu principal */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{task.title}</h3>
                    {task.description && (
                        <p className="text-sm text-gray-500 mb-4">
                            {task.description}
                        </p>
                    )}

                    {/* Métadonnées */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        {/* Projet */}
                        {task.project && (
                            <span className="flex items-center gap-2">
                                <svg
                                    className="w-4 h-4 text-gray-400"
                                    aria-hidden="true"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                                    />
                                </svg>
                                <span className="sr-only">Projet:</span>
                                {task.project.name}
                            </span>
                        )}

                        {/* Date d'échéance */}
                        {task.dueDate && (
                            <span className="flex items-center gap-2">
                                <svg
                                    className="w-4 h-4 text-gray-400"
                                    aria-hidden="true"
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
                                <span className="sr-only">Échéance:</span>
                                {formatDate(task.dueDate)}
                            </span>
                        )}

                        {/* Nombre de commentaires */}
                        <span className="flex items-center gap-2">
                            <svg
                                className="w-4 h-4 text-gray-400"
                                aria-hidden="true"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                            </svg>
                            <span className="sr-only">Commentaires:</span>
                            {commentsCount}
                        </span>
                    </div>
                </div>

                {/* Statut et bouton */}
                <div className="flex flex-col items-end gap-4">
                    <StatusTag status={task.status} />
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick?.();
                        }}
                        variant="primary"
                    >
                        Voir
                    </Button>
                </div>
            </div>
        </article>
    );
}

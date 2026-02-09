/**
 * Carte de tâche (vue Kanban)
 *
 * Affiche une tâche dans une colonne Kanban avec :
 * - Titre et statut
 * - Description tronquée
 * - Métadonnées (projet, échéance, commentaires)
 * - Bouton d'action
 *
 * @module components/tasks/TaskCardKanban
 */

'use client';

import Image from 'next/image';
import type { Task } from '@/types';
import StatusTag from './StatusTag';
import Button from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

interface TaskCardKanbanProps {
    /** Tâche à afficher */
    task: Task;
    /** Callback au clic sur la carte */
    onClick?: () => void;
}

// ============================================================================
// Composant
// ============================================================================

export default function TaskCardKanban({ task, onClick }: TaskCardKanbanProps) {
    const commentsCount = task._count?.comments ?? task.comments?.length ?? 0;

    return (
        <article
            role="listitem"
            tabIndex={0}
            aria-label={`Tâche: ${task.title}`}
            className="card-interactive p-7"
            onClick={() => onClick?.()}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick?.();
                }
            }}
        >
            {/* Titre et statut */}
            <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-heading font-bold text-heading line-clamp-2 truncate max-w-50">
                    {task.title}
                </h4>
                <StatusTag status={task.status} />
            </div>

            {task.description && (
                <p className="text-sm font-body text-sub line-clamp-2 mb-6">
                    {task.description}
                </p>
            )}

            {/* Métadonnées */}
            <div className="flex items-center gap-3 text-sm font-body text-sub mb-6">
                {task.project && (
                    <span className="flex items-center gap-1.5">
                        <Image src="/ico-project.png" alt="" width={16} height={16} aria-hidden="true" />
                        <span className="sr-only">Projet:</span>
                        <span className="truncate max-w-25">{task.project.name}</span> 
                    </span>
                )}
                |
                {task.dueDate && (
                    <span className="flex items-center gap-1.5">
                        <Image src="/ico-date.png" alt="" width={16} height={16} aria-hidden="true" />
                        <span className="sr-only">Échéance:</span>
                        {formatDate(task.dueDate)} 
                    </span>
                )}
                |
                <span className="flex items-center gap-1.5">
                    <Image src="/ico-comms.png" alt="" width={16} height={16} aria-hidden="true" />
                    <span className="sr-only">Commentaires:</span>
                    {commentsCount}
                </span>
            </div>

            {/* Bouton Voir */}
            <div>
                <Button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick?.();
                    }}
                    variant="primary"
                    size="auth"
                >
                    Voir
                </Button>
            </div>
        </article>
    );
}

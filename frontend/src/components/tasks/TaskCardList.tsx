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

import Image from 'next/image';
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
                    <h3 className="font-heading font-bold text-heading text-lg mb-1">{task.title}</h3>
                    {task.description && (
                        <p className="text-sm font-body text-sub mb-4">
                            {task.description}
                        </p>
                    )}

                    {/* Métadonnées */}
                    <div className="flex items-center gap-4 text-sm font-body text-sub">
                        {/* Projet */}
                        {task.project && (
                            <span className="flex items-center gap-1.5">
                                <Image src="/ico-project.png" alt="" width={16} height={16} aria-hidden="true" />
                                <span className="sr-only">Projet:</span>
                                {task.project.name}
                            </span>
                        )}

                        {/* Date d'échéance */}
                        {task.dueDate && (
                            <span className="flex items-center gap-1.5">
                                <Image src="/ico-date.png" alt="" width={16} height={16} aria-hidden="true" />
                                <span className="sr-only">Échéance:</span>
                                {formatDate(task.dueDate)}
                            </span>
                        )}

                        {/* Nombre de commentaires */}
                        <span className="flex items-center gap-1.5">
                            <Image src="/ico-comms.png" alt="" width={16} height={16} aria-hidden="true" />
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
                        size="proj"
                    >
                        Voir
                    </Button>
                </div>
            </div>
        </article>
    );
}

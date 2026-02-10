'use client';

import Image from 'next/image';
import type { Task, ProjectRole } from '@/types';
import StatusTag from '@/components/tasks/StatusTag';
import { CommentSection } from '@/components/tasks/CommentSection';
import { TaskActionMenu } from '@/components/tasks/TaskActionMenu';
import Avatar from '@/components/ui/Avatar';
import { canDeleteTask, canEditTask } from '@/lib/permissions';
import { formatDate, getDisplayName } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

interface TaskProjectProps {
    task: Task;
    projectId: string;
    isExpanded: boolean;
    onToggle: () => void;
    onDelete: (taskId: string) => void;
    onEdit: () => void;
    onCommentAdded?: () => void;
    userRole?: ProjectRole;
    userId?: string;
}

// ============================================================================
// Composant principal
// ============================================================================

export default function TaskProject({
    task,
    projectId,
    isExpanded,
    onToggle,
    onDelete,
    onEdit,
    onCommentAdded,
    userRole,
    userId,
}: TaskProjectProps) {
    const canEdit = canEditTask(userRole);
    const canDelete = canDeleteTask(userRole, userId, task.creatorId);

    return (
        <div className="rounded-xl border border-primary-grey bg-white p-5 mx-20 mt-8">
            {/* En-tête : contenu + menu actions */}
            <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                    {/* Titre + Status */}
                    <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-heading font-semibold text-heading">{task.title}</h3>
                        <StatusTag status={task.status} />
                    </div>

                    {/* Description */}
                    {task.description && (
                        <p className="text-sm font-body text-sub mb-8">{task.description}</p>
                    )}

                    {/* Échéance */}
                    {task.dueDate && (
                        <div className="flex items-center gap-2 text-sm font-body text-heading mb-8">
                            <span>Échéance :</span>
                            <Image src="/ico-date.png" alt="" width={16} height={16} aria-hidden="true" />
                            <span>{formatDate(task.dueDate)}</span>
                        </div>
                    )}

                    {/* Assignés */}
                    {task.assignees && task.assignees.length > 0 && (
                        <div className="flex items-center gap-2 text-sm font-body text-sub">
                            <span>Assigné à :</span>
                            <div className="flex items-center gap-1">
                                {task.assignees.map((assignee) => (
                                    <div
                                        key={assignee.id}
                                        className="flex items-center gap-1 px-2 py-0.5"
                                    >
                                        <Avatar
                                            name={assignee.user.name}
                                            email={assignee.user.email}
                                            size="xs"
                                            variant="grey"
                                        />
                                        <span className="text-xs font-body text-sub bg-primary-grey rounded-full px-4 py-0.5">
                                            {getDisplayName(assignee.user.name, assignee.user.email)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Menu actions */}
                <TaskActionMenu
                    canEdit={canEdit}
                    canDelete={canDelete}
                    onEdit={onEdit}
                    onDelete={() => onDelete(task.id)}
                />
            </div>

            {/* Séparateur + Commentaires (pleine largeur) */}
            <hr className="border-primary-grey mt-6 -mx-1" aria-hidden="true" />
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between gap-2 mt-3 text-sm font-heading font-medium text-heading hover:text-accent transition-colors"
            >
                <span>Commentaires ({task._count?.comments ?? 0})</span>
                <Image
                    src="/dropdown.png"
                    alt=""
                    width={16}
                    height={16}
                    aria-hidden="true"
                    className={`transition-transform ${isExpanded ? '' : 'rotate-180'}`}
                />
            </button>

            {/* Section commentaires étendue */}
            {isExpanded && (
                <CommentSection
                    projectId={projectId}
                    taskId={task.id}
                    isVisible={isExpanded}
                    onCommentAdded={onCommentAdded}
                />
            )}
        </div>
    );
}

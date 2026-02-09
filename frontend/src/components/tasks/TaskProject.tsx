'use client';

import Image from 'next/image';
import type { Task, TaskStatus, ProjectRole } from '@/types';
import StatusTag from '@/components/tasks/StatusTag';
import { CommentSection } from '@/components/tasks/CommentSection';
import { TaskActionMenu } from '@/components/tasks/TaskActionMenu';
import Avatar from '@/components/ui/Avatar';
import { canDeleteTask, canEditTask } from '@/lib/permissions';
import { formatDate } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

interface TaskProjectProps {
    task: Task;
    projectId: string;
    isExpanded: boolean;
    onToggle: () => void;
    onStatusChange: (task: Task, status: TaskStatus) => void;
    onDelete: (taskId: string) => void;
    onEdit: () => void;
    onCommentAdded?: () => void;
    userRole?: ProjectRole;
    userId?: string;
}

// ============================================================================
// Composant interne : Liste des assignés
// ============================================================================

function AssigneeList({ assignees }: { assignees: Task['assignees'] }) {
    if (!assignees || assignees.length === 0) return null;

    return (
        <div className="flex items-center gap-2 font-body text-sub">
            <span>Assigné à :</span>
            <div className="flex items-center gap-1">
                {assignees.map((assignee) => (
                    <div
                        key={assignee.id}
                        className="flex items-center gap-1 px-2 py-0.5 bg-primary-grey rounded-full"
                    >
                        <Avatar
                            name={assignee.user.name}
                            email={assignee.user.email}
                            size="xs"
                        />
                        <span className="text-xs font-body">
                            {assignee.user.name || assignee.user.email.split('@')[0]}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================================================
// Composant principal
// ============================================================================

export default function TaskProject({
    task,
    projectId,
    isExpanded,
    onToggle,
    onStatusChange,
    onDelete,
    onEdit,
    onCommentAdded,
    userRole,
    userId,
}: TaskProjectProps) {
    // Vérifier les permissions pour cette tâche
    const canEdit = canEditTask(userRole);
    const canDelete = canDeleteTask(userRole, userId, task.creatorId);

    return (
        <div className="p-4 hover:bg-background transition-colors">
            <div className="flex items-start gap-4">
                <div className="flex-1">
                    {/* Titre + Status */}
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-heading font-medium text-heading">{task.title}</h3>
                        <StatusTag status={task.status} />
                    </div>

                    {/* Description */}
                    {task.description && (
                        <p className="text-sm font-body text-sub mb-3">{task.description}</p>
                    )}

                    {/* Métadonnées */}
                    <div className="flex items-center gap-6 text-sm font-body text-sub">
                        {task.dueDate && (
                            <div className="flex items-center gap-2">
                                <span>Échéance :</span>
                                <span className="flex items-center gap-1">
                                    <Image src="/ico-date.png" alt="" width={16} height={16} aria-hidden="true" />
                                    {formatDate(task.dueDate)}
                                </span>
                            </div>
                        )}

                        <AssigneeList assignees={task.assignees} />
                    </div>

                    {/* Bouton commentaires (expandable) */}
                    <button
                        onClick={onToggle}
                        className="flex items-center gap-2 mt-3 text-sm font-body text-sub hover:text-heading transition-colors"
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
                        <CommentSection
                            projectId={projectId}
                            taskId={task.id}
                            isVisible={isExpanded}
                            onCommentAdded={onCommentAdded}
                        />
                    )}
                </div>

                {/* Menu actions */}
                <TaskActionMenu
                    currentStatus={task.status}
                    canEdit={canEdit}
                    canDelete={canDelete}
                    onEdit={onEdit}
                    onStatusChange={(status) => onStatusChange(task, status)}
                    onDelete={() => onDelete(task.id)}
                />
            </div>
        </div>
    );
}

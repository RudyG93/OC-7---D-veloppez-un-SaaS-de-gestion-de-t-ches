'use client';

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
        <div className="flex items-center gap-2">
            <span>Assigné à :</span>
            <div className="flex items-center gap-1">
                {assignees.map((assignee) => (
                    <div
                        key={assignee.id}
                        className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-full"
                    >
                        <Avatar
                            name={assignee.user.name}
                            email={assignee.user.email}
                            size="xs"
                        />
                        <span className="text-xs">
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

                        <AssigneeList assignees={task.assignees} />
                    </div>

                    {/* Bouton commentaires (expandable) */}
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

'use client';

import type { Task, TaskStatus } from '@/types';
import StatusTag from '../tasks/StatusTag';
import { formatDate } from '@/lib/utils';
import { KANBAN_COLUMNS } from '@/lib/taskConstants';

interface KanbanBoardProps {
    tasks: Task[];
    onTaskClick?: (task: Task) => void;
}

export default function KanbanBoard({ tasks, onTaskClick }: KanbanBoardProps) {
    const getTasksByStatus = (status: TaskStatus) =>
        tasks.filter((task) => task.status === status);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {KANBAN_COLUMNS.map((column) => {
                const columnTasks = getTasksByStatus(column.status);

                return (
                    <div key={column.status} className="bg-gray-50 rounded-xl p-4">
                        {/* En-tête de colonne */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">{column.title}</h3>
                            <span className="text-sm text-gray-500 bg-white px-2 py-0.5 rounded">
                                {columnTasks.length}
                            </span>
                        </div>

                        {/* Cartes de tâches */}
                        <div className="space-y-3" role="list" aria-label={`Tâches ${column.title}`}>
                            {columnTasks.length === 0 ? (
                                <div className="text-center py-8 text-gray-400 text-sm">
                                    Aucune tâche
                                </div>
                            ) : (
                                columnTasks.map((task) => (
                                    <article
                                        key={task.id}
                                        role="listitem"
                                        tabIndex={0}
                                        aria-label={`Tâche: ${task.title}`}
                                        className="card-interactive p-4"
                                        onClick={() => onTaskClick?.(task)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                onTaskClick?.(task);
                                            }
                                        }}
                                    >
                                        {/* Titre et statut */}
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h4 className="font-bold text-gray-900 line-clamp-2">
                                                {task.title}
                                            </h4>
                                            <StatusTag status={task.status} />
                                        </div>

                                        {task.description && (
                                            <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                                                {task.description}
                                            </p>
                                        )}

                                        {/* Métadonnées */}
                                        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                                            {/* Projet */}
                                            {task.project && (
                                                <span className="flex items-center gap-1.5">
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
                                                    <span className="truncate max-w-25">{task.project.name}</span>
                                                </span>
                                            )}

                                            {/* Date */}
                                            {task.dueDate && (
                                                <span className="flex items-center gap-1.5">
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

                                            {/* Commentaires */}
                                            <span className="flex items-center gap-1.5">
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
                                                {task._count?.comments ?? task.comments?.length ?? 0}
                                            </span>
                                        </div>

                                        {/* Bouton Voir */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onTaskClick?.(task);
                                            }}
                                            className="w-full px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                                        >
                                            Voir
                                        </button>
                                    </article>
                                ))
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

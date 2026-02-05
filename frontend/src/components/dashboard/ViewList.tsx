'use client';

import type { Task } from '@/types';
import TaskCard from '../tasks/TaskCardList';

interface TaskListProps {
    tasks: Task[];
    title?: string;
    subtitle?: string;
    onTaskClick?: (task: Task) => void;
    emptyMessage?: string;
    showSearch?: boolean;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
}

export default function TaskList({
    tasks,
    title,
    subtitle,
    onTaskClick,
    emptyMessage = 'Aucune tâche',
    showSearch = false,
    searchValue = '',
    onSearchChange,
}: TaskListProps) {
    return (
        <div className="bg-gray-50 rounded-xl p-6">
            {/* En-tête */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    {title && (
                        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                    )}
                    {subtitle && (
                        <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
                    )}
                </div>

                {/* Recherche */}
                {showSearch && (
                    <div className="relative">
                        <label htmlFor="task-search" className="sr-only">
                            Rechercher une tâche
                        </label>
                        <input
                            id="task-search"
                            type="text"
                            placeholder="Rechercher une tâche"
                            value={searchValue}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            className="w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                            aria-hidden="true"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                )}
            </div>

            {/* Liste des tâches */}
            {tasks.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <svg
                        className="w-12 h-12 mx-auto mb-4 text-gray-300"
                        aria-hidden="true"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                    </svg>
                    <p>{emptyMessage}</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onClick={() => onTaskClick?.(task)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

'use client';

import type { Task } from '@/types';
import TaskCard from '../tasks/TaskCardList';
import SearchInput from '@/components/ui/SearchInput';

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
        <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-10 shadow-sm border border-primary-grey mt-6 sm:mt-10">
            {/* En-tête */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 sm:mb-10">
                <div>
                    {title && (
                        <h2 className="text-lg font-heading font-semibold text-heading">{title}</h2>
                    )}
                    {subtitle && (
                        <p className="text-sm font-body text-sub mt-0.5">{subtitle}</p>
                    )}
                </div>

                {/* Recherche */}
                {showSearch && (
                    <SearchInput
                        inputId="dashboard-task-search"
                        label="Rechercher une tâche"
                        placeholder="Rechercher une tâche"
                        value={searchValue}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        className="w-full sm:w-80 h-12 sm:h-14 px-4"
                    />
                )}
            </div>

            {/* Liste des tâches */}
            {tasks.length === 0 ? (
                <div className="text-center py-12 font-body text-sub">
                    <svg
                        className="w-12 h-12 mx-auto mb-4 text-primary-grey"
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
                <div role="list" className="space-y-3">
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

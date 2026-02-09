'use client';

import { useMemo } from 'react';
import type { Task } from '@/types';
import TaskCardKanban from '../tasks/TaskCardKanban';
import { KANBAN_COLUMNS } from '@/lib/taskConstants';

interface KanbanBoardProps {
    tasks: Task[];
    onTaskClick?: (task: Task) => void;
}

export default function KanbanBoard({ tasks, onTaskClick }: KanbanBoardProps) {
    /** Regroupement des tâches par statut, mémorisé */
    const tasksByStatus = useMemo(() => {
        const map: Record<string, Task[]> = {};
        for (const column of KANBAN_COLUMNS) {
            map[column.status] = tasks.filter((task) => task.status === column.status);
        }
        return map;
    }, [tasks]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {KANBAN_COLUMNS.map((column) => {
                const columnTasks = tasksByStatus[column.status] ?? [];

                return (
                    <div key={column.status} className="bg-white rounded-xl p-4 shadow-sm border border-primary-grey">
                        {/* En-tête de colonne */}
                        <div className="flex items-center gap-2 mb-8">
                            <h3 className="font-heading font-semibold text-heading">{column.title}</h3>
                            <span className="text-sm font-body text-sub bg-primary-grey px-4 py-0.5 rounded-2xl">
                                {columnTasks.length}
                            </span>
                        </div>

                        {/* Cartes de tâches */}
                        <div className="space-y-3" role="list" aria-label={`Tâches ${column.title}`}>
                            {columnTasks.length === 0 ? (
                                <div className="text-center py-8 text-sub text-sm font-body">
                                    Aucune tâche
                                </div>
                            ) : (
                                columnTasks.map((task) => (
                                    <TaskCardKanban
                                        key={task.id}
                                        task={task}
                                        onClick={() => onTaskClick?.(task)}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

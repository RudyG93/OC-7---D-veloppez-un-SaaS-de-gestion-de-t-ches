'use client';

import type { TaskPriority } from '@/types';

interface PriorityTagProps {
    priority: TaskPriority;
    size?: 'sm' | 'md';
}

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
    LOW: {
        label: 'Basse',
        className: 'bg-gray-100 text-gray-600',
    },
    MEDIUM: {
        label: 'Moyenne',
        className: 'bg-blue-100 text-blue-700',
    },
    HIGH: {
        label: 'Haute',
        className: 'bg-orange-100 text-orange-700',
    },
    URGENT: {
        label: 'Urgente',
        className: 'bg-red-100 text-red-700',
    },
};

export default function PriorityTag({ priority, size = 'sm' }: PriorityTagProps) {
    const config = priorityConfig[priority];

    return (
        <span
            className={`inline-flex items-center rounded font-medium ${
                size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
            } ${config.className}`}
        >
            {config.label}
        </span>
    );
}

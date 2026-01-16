'use client';

import type { TaskStatus } from '@/types';

interface StatusTagProps {
    status: TaskStatus;
    size?: 'sm' | 'md';
}

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
    TODO: {
        label: 'À faire',
        className: 'bg-red-100 text-red-600 border-red-200',
    },
    IN_PROGRESS: {
        label: 'En cours',
        className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    },
    DONE: {
        label: 'Terminée',
        className: 'bg-green-100 text-green-600 border-green-200',
    },
    CANCELLED: {
        label: 'Annulée',
        className: 'bg-gray-100 text-gray-600 border-gray-200',
    },
};

export default function StatusTag({ status, size = 'sm' }: StatusTagProps) {
    const config = statusConfig[status];

    return (
        <span
            className={`inline-flex items-center border rounded-full font-medium ${
                size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
            } ${config.className}`}
        >
            {config.label}
        </span>
    );
}

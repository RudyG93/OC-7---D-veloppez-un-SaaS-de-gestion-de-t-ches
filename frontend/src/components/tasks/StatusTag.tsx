'use client';

import type { TaskStatus } from '@/types';

interface StatusTagProps {
    status: TaskStatus;
    size?: 'sm' | 'md';
}

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
    TODO: {
        label: 'À faire',
        className: 'bg-[#FFE0E0] text-[#EF4444] border-[#FFE0E0]',
    },
    IN_PROGRESS: {
        label: 'En cours',
        className: 'bg-[#FFF0D7] text-[#E08D00] border-[#FFF0D7]',
    },
    DONE: {
        label: 'Terminée',
        className: 'bg-[#F1FFF7] text-[#27AE60] border-[#F1FFF7]',
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

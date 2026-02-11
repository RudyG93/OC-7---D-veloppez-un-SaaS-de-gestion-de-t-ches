'use client';

import type { TaskStatus } from '@/types';
import { STATUS_TAG_CONFIG } from '@/lib/taskConstants';

interface StatusTagProps {
    status: TaskStatus;
    size?: 'sm' | 'md';
}

export default function StatusTag({ status, size = 'sm' }: StatusTagProps) {
    const config = STATUS_TAG_CONFIG[status];

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

'use client';

import { useState } from 'react';
import type { TaskStatus } from '@/types';

// ============================================================================
// Types
// ============================================================================

interface TaskActionMenuProps {
    /** Statut actuel de la tâche */
    currentStatus: TaskStatus;
    /** Si l'utilisateur peut éditer */
    canEdit: boolean;
    /** Si l'utilisateur peut supprimer */
    canDelete: boolean;
    /** Callback de modification */
    onEdit: () => void;
    /** Callback de changement de statut */
    onStatusChange: (status: TaskStatus) => void;
    /** Callback de suppression */
    onDelete: () => void;
}

// ============================================================================
// Composant
// ============================================================================

/**
 * Menu d'actions pour une tâche (modifier, changer statut, supprimer)
 */
export function TaskActionMenu({
    currentStatus,
    canEdit,
    canDelete,
    onEdit,
    onStatusChange,
    onDelete,
}: TaskActionMenuProps) {
    const [showMenu, setShowMenu] = useState(false);

    const handleEdit = () => {
        onEdit();
        setShowMenu(false);
    };

    const handleStatusChange = (status: TaskStatus) => {
        onStatusChange(status);
        setShowMenu(false);
    };

    const handleDelete = () => {
        onDelete();
        setShowMenu(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                aria-label="Actions de la tâche"
            >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
            </button>

            {showMenu && (
                <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-35 z-10">
                    {canEdit && (
                        <>
                            <button
                                onClick={handleEdit}
                                className="dropdown-item"
                            >
                                Modifier
                            </button>
                            <hr className="my-1 border-gray-200" />
                            {currentStatus !== 'TODO' && (
                                <button
                                    onClick={() => handleStatusChange('TODO')}
                                    className="dropdown-item"
                                >
                                    → À faire
                                </button>
                            )}
                            {currentStatus !== 'IN_PROGRESS' && (
                                <button
                                    onClick={() => handleStatusChange('IN_PROGRESS')}
                                    className="dropdown-item"
                                >
                                    → En cours
                                </button>
                            )}
                            {currentStatus !== 'DONE' && (
                                <button
                                    onClick={() => handleStatusChange('DONE')}
                                    className="dropdown-item"
                                >
                                    → Terminée
                                </button>
                            )}
                        </>
                    )}
                    {canDelete && (
                        <>
                            {canEdit && <hr className="my-1 border-gray-200" />}
                            <button
                                onClick={handleDelete}
                                className="dropdown-item-danger"
                            >
                                Supprimer
                            </button>
                        </>
                    )}
                    {!canEdit && !canDelete && (
                        <p className="px-3 py-2 text-sm text-gray-500">
                            Aucune action disponible
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

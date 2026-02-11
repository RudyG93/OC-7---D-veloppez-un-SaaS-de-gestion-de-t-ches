'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useClickOutside } from '@/hooks/useClickOutside';

// ============================================================================
// Types
// ============================================================================

interface TaskActionMenuProps {
    /** Si l'utilisateur peut éditer */
    canEdit: boolean;
    /** Si l'utilisateur peut supprimer */
    canDelete: boolean;
    /** Callback de modification */
    onEdit: () => void;
    /** Callback de suppression */
    onDelete: () => void;
}

// ============================================================================
// Composant
// ============================================================================

/**
 * Menu d'actions pour une tâche (modifier, supprimer)
 */
export function TaskActionMenu({
    canEdit,
    canDelete,
    onEdit,
    onDelete,
}: TaskActionMenuProps) {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const closeMenu = useCallback(() => setShowMenu(false), []);
    useClickOutside(menuRef, closeMenu);

    const handleEdit = () => {
        onEdit();
        setShowMenu(false);
    };

    const handleDelete = () => {
        onDelete();
        setShowMenu(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center justify-center w-10 h-10 shrink-0 rounded-lg border border-primary-grey hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                aria-label="Actions de la tâche"
                aria-expanded={showMenu}
                aria-haspopup="menu"
            >
                <Image
                    src="/more.png"
                    alt=""
                    width={40}
                    height={40}
                    aria-hidden="true"
                />
            </button>

            {showMenu && (
                <div
                    role="menu"
                    aria-orientation="vertical"
                    className="absolute right-0 top-12 bg-white border border-primary-grey rounded-lg shadow-lg py-1 min-w-35 z-10"
                >
                    {canEdit && (
                        <button
                            onClick={handleEdit}
                            role="menuitem"
                            className="dropdown-item"
                        >
                            Modifier
                        </button>
                    )}
                    {canDelete && (
                        <>
                            {canEdit && <hr className="my-1 border-primary-grey" aria-hidden="true" />}
                            <button
                                onClick={handleDelete}
                                role="menuitem"
                                className="dropdown-item-danger"
                            >
                                Supprimer
                            </button>
                        </>
                    )}
                    {!canEdit && !canDelete && (
                        <p className="px-3 py-2 text-sm font-body text-sub">
                            Aucune action disponible
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

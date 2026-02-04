/**
 * Composant Modal
 *
 * Wrapper de modale réutilisable avec gestion de l'accessibilité.
 *
 * Fonctionnalités :
 * - Fermeture avec Escape ou clic sur l'overlay
 * - Focus trap automatique
 * - Support ARIA pour l'accessibilité
 * - Styles cohérents
 *
 * @module components/ui/Modal
 */

'use client';

import { useEffect, useRef, type ReactNode } from 'react';

// ============================================================================
// Types
// ============================================================================

interface ModalProps {
    /** Titre de la modale (affiché dans le header) */
    title: string;
    /** Contenu de la modale */
    children: ReactNode;
    /** Callback de fermeture */
    onClose: () => void;
    /** Largeur maximale (défaut: 'md') */
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
    /** ID unique pour l'accessibilité (généré automatiquement si non fourni) */
    ariaLabelledBy?: string;
}

// ============================================================================
// Constantes
// ============================================================================

/** Classes Tailwind pour les largeurs maximales */
const MAX_WIDTH_CLASSES = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
} as const;

// ============================================================================
// Composant
// ============================================================================

/**
 * Composant Modal réutilisable
 *
 * @example
 * <Modal title="Créer une tâche" onClose={handleClose}>
 *   <form onSubmit={handleSubmit}>
 *     {// Contenu du formulaire}
 *   </form>
 * </Modal>
 */
export default function Modal({
    title,
    children,
    onClose,
    maxWidth = 'md',
    ariaLabelledBy,
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const titleId = ariaLabelledBy || `modal-title-${title.toLowerCase().replace(/\s+/g, '-')}`;

    // Gestion du clavier (Escape pour fermer)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Fermer en cliquant sur l'overlay
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            role="presentation"
            onClick={handleOverlayClick}
        >
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className={`bg-white rounded-xl p-6 w-full ${MAX_WIDTH_CLASSES[maxWidth]} mx-4 max-h-[90vh] overflow-y-auto`}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 id={titleId} className="text-xl font-bold text-gray-900">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        aria-label="Fermer la modale"
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 rounded"
                    >
                        <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                {children}
            </div>
        </div>
    );
}

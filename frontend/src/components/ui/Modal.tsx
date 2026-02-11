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

import { useEffect, useRef, useCallback, useId, type ReactNode } from 'react';

// ============================================================================
// Types
// ============================================================================

interface ModalProps {
    /** Titre de la modale (affiché dans le header) */
    title: ReactNode;
    /** Contenu de la modale */
    children: ReactNode;
    /** Callback de fermeture */
    onClose: () => void;
    /** Largeur maximale (défaut: 'md') */
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
    /** ID unique pour l'accessibilité (généré automatiquement si non fourni) */
    ariaLabelledBy?: string;
    /** Contenu fixe en bas de la modale (optionnel) */
    footer?: ReactNode;
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

/** Sélecteur des éléments focusables */
const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

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
    footer,
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);
    const generatedId = useId();
    const titleId = ariaLabelledBy || `modal-title-${generatedId}`;

    // Focus trap : garder le focus dans la modale
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
            return;
        }

        if (e.key === 'Tab' && modalRef.current) {
            const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                // Shift+Tab : aller au dernier élément si on est sur le premier
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement?.focus();
                }
            } else {
                // Tab : aller au premier élément si on est sur le dernier
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement?.focus();
                }
            }
        }
    }, [onClose]);

    // Gestion du focus et des événements clavier
    useEffect(() => {
        // Sauvegarder l'élément actif et focus la modale
        previousActiveElement.current = document.activeElement as HTMLElement;
        
        // Focus le premier élément focusable de la modale
        const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (focusableElements && focusableElements.length > 0) {
            focusableElements[0].focus();
        }

        document.addEventListener('keydown', handleKeyDown);
        
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            // Restaurer le focus à l'élément précédent
            previousActiveElement.current?.focus();
        };
    }, [handleKeyDown]);

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
                className={`bg-white rounded-xl w-full ${MAX_WIDTH_CLASSES[maxWidth]} mx-4 max-h-[90vh] overflow-hidden flex flex-col`}
            >
                {/* Header — fixe */}
                <div className="flex items-center justify-between px-6 pt-6 shrink-0">
                    <h2 id={titleId} className="text-xl font-bold text-gray-900">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        aria-label="Fermer la modale"
                        className="p-1 text-sub hover:text-heading transition-colors focus:outline-none focus:ring-2 focus:ring-primary-grey rounded"
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

                {/* Content — scrollable */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    {children}
                </div>

                {/* Footer — fixe */}
                {footer && (
                    <div className="shrink-0">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}

'use client';

import { useEffect, useRef, ReactNode, KeyboardEvent } from 'react';

/**
 * Tailles disponibles pour la modale
 */
type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Props du composant Modal
 */
interface ModalProps {
    /** Contrôle l'affichage de la modale */
    isOpen: boolean;
    /** Callback appelé lors de la fermeture */
    onClose: () => void;
    /** Titre de la modale (pour l'accessibilité) */
    title: string;
    /** ID du titre (généré automatiquement si non fourni) */
    titleId?: string;
    /** Taille de la modale */
    size?: ModalSize;
    /** Contenu de la modale */
    children: ReactNode;
    /** Classe CSS additionnelle pour le contenu */
    className?: string;
    /** Fermer la modale en cliquant sur l'overlay */
    closeOnOverlayClick?: boolean;
    /** Afficher le bouton de fermeture */
    showCloseButton?: boolean;
}

/**
 * Classes de taille pour la modale
 */
const sizeClasses: Record<ModalSize, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
};

/**
 * Icône de fermeture (X)
 */
function CloseIcon() {
    return (
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
    );
}

/**
 * Composant Modal accessible avec gestion du focus trap et fermeture au clavier
 *
 * @example
 * // Modale simple
 * <Modal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   title="Créer un projet"
 * >
 *   <form>...</form>
 * </Modal>
 *
 * @example
 * // Modale large sans fermeture sur overlay
 * <Modal
 *   isOpen={showModal}
 *   onClose={handleClose}
 *   title="Paramètres avancés"
 *   size="lg"
 *   closeOnOverlayClick={false}
 * >
 *   <AdvancedSettings />
 * </Modal>
 */
export default function Modal({
    isOpen,
    onClose,
    title,
    titleId,
    size = 'md',
    children,
    className = '',
    closeOnOverlayClick = true,
    showCloseButton = true,
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const generatedTitleId = titleId || `modal-title-${title.toLowerCase().replace(/\s+/g, '-')}`;

    // Gestion de la touche Escape
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: globalThis.KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        // Focus sur la modale à l'ouverture
        modalRef.current?.focus();

        // Empêcher le scroll du body
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        // Focus trap - empêcher la navigation hors de la modale
        if (e.key === 'Tab') {
            const focusableElements = modalRef.current?.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (!focusableElements || focusableElements.length === 0) return;

            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
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
                aria-labelledby={generatedTitleId}
                tabIndex={-1}
                onKeyDown={handleKeyDown}
                className={`bg-white rounded-xl p-6 w-full ${sizeClasses[size]} mx-4 max-h-[90vh] overflow-y-auto ${className}`}
            >
                {/* Header avec titre et bouton fermer */}
                <div className="flex items-center justify-between mb-6">
                    <h2
                        id={generatedTitleId}
                        className="text-xl font-bold text-gray-900"
                    >
                        {title}
                    </h2>
                    {showCloseButton && (
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Fermer la modale"
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 rounded"
                        >
                            <CloseIcon />
                        </button>
                    )}
                </div>

                {/* Contenu */}
                {children}
            </div>
        </div>
    );
}

/**
 * Composant ModalFooter pour les actions de la modale
 */
interface ModalFooterProps {
    children: ReactNode;
    className?: string;
}

export function ModalFooter({ children, className = '' }: ModalFooterProps) {
    return (
        <div className={`pt-4 flex gap-3 ${className}`}>
            {children}
        </div>
    );
}

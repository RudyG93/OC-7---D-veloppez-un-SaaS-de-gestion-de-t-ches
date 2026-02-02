'use client';

import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Variantes de style pour le bouton icône
 */
type IconButtonVariant = 'default' | 'danger' | 'ghost';

/**
 * Tailles disponibles pour le bouton icône
 */
type IconButtonSize = 'sm' | 'md' | 'lg';

/**
 * Props du composant IconButton
 */
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Label d'accessibilité (requis) */
    label: string;
    /** Variante de style */
    variant?: IconButtonVariant;
    /** Taille du bouton */
    size?: IconButtonSize;
    /** Icône à afficher */
    icon: ReactNode;
    /** Classe CSS additionnelle */
    className?: string;
}

/**
 * Classes de style par variante
 */
const variantStyles: Record<IconButtonVariant, string> = {
    default: 'text-gray-400 hover:text-gray-600 focus:ring-gray-300',
    danger: 'text-gray-400 hover:text-red-500 focus:ring-red-300 focus:text-red-500',
    ghost: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:ring-gray-300',
};

/**
 * Classes de style par taille
 */
const sizeStyles: Record<IconButtonSize, string> = {
    sm: 'p-0.5',
    md: 'p-1',
    lg: 'p-2',
};

/**
 * Composant IconButton pour les boutons avec uniquement une icône
 *
 * @example
 * // Bouton de fermeture
 * <IconButton
 *   label="Fermer"
 *   icon={<CloseIcon />}
 *   onClick={onClose}
 * />
 *
 * @example
 * // Bouton de suppression
 * <IconButton
 *   label="Supprimer"
 *   variant="danger"
 *   icon={<TrashIcon />}
 *   onClick={onDelete}
 * />
 */
const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    (
        {
            label,
            variant = 'default',
            size = 'md',
            icon,
            className = '',
            ...props
        },
        ref
    ) => {
        const baseStyles = [
            'inline-flex items-center justify-center',
            'transition-colors rounded',
            'focus:outline-none focus:ring-2',
            variantStyles[variant],
            sizeStyles[size],
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <button
                ref={ref}
                type="button"
                aria-label={label}
                className={baseStyles}
                {...props}
            >
                <span aria-hidden="true">{icon}</span>
            </button>
        );
    }
);

IconButton.displayName = 'IconButton';

export default IconButton;

/**
 * Icônes communes réutilisables
 */

export function CloseIcon({ className = 'w-5 h-5' }: { className?: string }) {
    return (
        <svg
            className={className}
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

export function PlusIcon({ className = 'w-4 h-4' }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
            />
        </svg>
    );
}

export function TrashIcon({ className = 'w-4 h-4' }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
        </svg>
    );
}

export function EditIcon({ className = 'w-4 h-4' }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
        </svg>
    );
}

export function ChevronDownIcon({ className = 'w-4 h-4' }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
            />
        </svg>
    );
}

export function AIIcon({ className = 'w-4 h-4' }: { className?: string }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
        </svg>
    );
}

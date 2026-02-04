'use client';

import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Variantes de style pour le bouton
 */
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'orange';

/**
 * Tailles disponibles pour le bouton
 */
type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Props du composant Button
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Variante de style du bouton */
    variant?: ButtonVariant;
    /** Taille du bouton */
    size?: ButtonSize;
    /** Affiche un état de chargement */
    isLoading?: boolean;
    /** Texte affiché pendant le chargement */
    loadingText?: string;
    /** Icône à gauche du texte */
    leftIcon?: ReactNode;
    /** Icône à droite du texte */
    rightIcon?: ReactNode;
    /** Prend toute la largeur disponible */
    fullWidth?: boolean;
    /** Bouton arrondi (pill) */
    rounded?: boolean;
    /** Contenu du bouton */
    children: ReactNode;
}

/**
 * Classes de style par variante
 */
const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300',
    outline: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300',
    orange: 'bg-[#D3590B] text-white hover:bg-[#B84D0A] focus:ring-[#D3590B]',
};

/**
 * Classes de style par taille
 */
const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-sm',
};

/**
 * Composant Button réutilisable avec différentes variantes et tailles
 *
 * @example
 * // Bouton principal
 * <Button variant="primary">Créer un projet</Button>
 *
 * @example
 * // Bouton avec icône et chargement
 * <Button
 *   variant="primary"
 *   isLoading={isSubmitting}
 *   loadingText="Création..."
 *   leftIcon={<PlusIcon />}
 * >
 *   Créer
 * </Button>
 *
 * @example
 * // Bouton orange (CTA)
 * <Button variant="orange">
 *   Action
 * </Button>
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            isLoading = false,
            loadingText,
            leftIcon,
            rightIcon,
            fullWidth = false,
            rounded = false,
            disabled,
            className = '',
            children,
            ...props
        },
        ref
    ) => {
        const isDisabled = disabled || isLoading;

        const baseStyles = [
            'inline-flex items-center justify-center gap-2',
            'font-medium transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            variantStyles[variant],
            sizeStyles[size],
            rounded ? 'rounded-full' : 'rounded-lg',
            fullWidth ? 'w-full' : '',
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <button
                ref={ref}
                disabled={isDisabled}
                className={baseStyles}
                {...props}
            >
                {isLoading ? (
                    <>
                        <div
                            role="status"
                            aria-label={loadingText || 'Chargement en cours'}
                            className="spinner spinner-sm"
                            style={{
                                borderTopColor: variant === 'primary' || variant === 'danger' || variant === 'orange'
                                    ? 'white'
                                    : 'currentColor',
                                borderColor: variant === 'primary' || variant === 'danger' || variant === 'orange'
                                    ? 'rgba(255,255,255,0.3)'
                                    : 'rgba(0,0,0,0.1)',
                            }}
                        />
                        {loadingText && <span>{loadingText}</span>}
                    </>
                ) : (
                    <>
                        {leftIcon && <span aria-hidden="true">{leftIcon}</span>}
                        {children}
                        {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
                    </>
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;

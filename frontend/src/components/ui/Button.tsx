'use client';

import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Variantes de style pour le bouton
 */
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'orange';

/**
 * Tailles disponibles pour le bouton
 */
type ButtonSize = 'sm' | 'md' | 'lg' | 'auth' | 'proj';

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
    primary: 'bg-heading text-white hover:bg-heading/90 focus:ring-heading',
    secondary: 'bg-primary-grey text-sub hover:bg-gray-300 focus:ring-primary-grey',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-sub hover:bg-gray-100 focus:ring-primary-grey',
    outline: 'bg-white border border-primary-grey text-sub hover:bg-gray-50 focus:ring-primary-grey',
    orange: 'bg-primary text-white hover:bg-accent focus:ring-primary',
};

/**
 * Classes de style par taille
 */
const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-sm',
    auth: 'h-12 px-15 text-sm',
    proj: 'h-12 px-8 text-sm',
};

/**
 * Composant Button réutilisable avec différentes variantes et tailles
 *
 * @example
 * // Bouton principal
 * <Button variant="primary">Créer un projet</Button>
 *
 * @example
 * // Bouton avec icône PNG et chargement
 * <Button
 *   variant="primary"
 *   isLoading={isSubmitting}
 *   loadingText="Création..."
 *   leftIcon={<Image src="/ico-plus.png" alt="" width={16} height={16} style={{ height: 'auto' }} />}
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
        const isDarkBg = variant === 'primary' || variant === 'danger' || variant === 'orange';

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
                            className={`spinner spinner-sm ${isDarkBg ? 'spinner-invert' : ''}`}
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

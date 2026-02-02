'use client';

/**
 * Tailles disponibles pour le spinner
 */
type SpinnerSize = 'sm' | 'md' | 'lg';

/**
 * Props du composant Spinner
 */
interface SpinnerProps {
    /** Taille du spinner */
    size?: SpinnerSize;
    /** Label d'accessibilité pour les lecteurs d'écran */
    label?: string;
    /** Couleur du spinner (hérite de la couleur du texte par défaut) */
    color?: 'current' | 'white' | 'gray';
    /** Classe CSS additionnelle */
    className?: string;
}

/**
 * Classes de taille pour le spinner
 */
const sizeClasses: Record<SpinnerSize, string> = {
    sm: 'spinner-sm',
    md: 'spinner-md',
    lg: 'spinner-lg',
};

/**
 * Styles de couleur pour le spinner
 */
const colorStyles: Record<string, { borderTopColor: string; borderColor: string }> = {
    current: {
        borderTopColor: 'currentColor',
        borderColor: 'rgba(0,0,0,0.1)',
    },
    white: {
        borderTopColor: 'white',
        borderColor: 'rgba(255,255,255,0.3)',
    },
    gray: {
        borderTopColor: '#6B7280',
        borderColor: 'rgba(107,114,128,0.2)',
    },
};

/**
 * Composant Spinner accessible pour les états de chargement
 *
 * @example
 * // Spinner simple
 * <Spinner label="Chargement des projets" />
 *
 * @example
 * // Spinner large
 * <Spinner size="lg" label="Chargement en cours" />
 *
 * @example
 * // Spinner blanc (pour boutons sombres)
 * <Spinner size="sm" color="white" label="Envoi en cours" />
 */
export default function Spinner({
    size = 'md',
    label = 'Chargement en cours',
    color = 'gray',
    className = '',
}: SpinnerProps) {
    const colorStyle = colorStyles[color] || colorStyles.gray;

    return (
        <div
            role="status"
            aria-label={label}
            className={`spinner ${sizeClasses[size]} ${className}`}
            style={colorStyle}
        >
            <span className="sr-only">{label}</span>
        </div>
    );
}

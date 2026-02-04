'use client';

/**
 * Icônes réutilisables pour l'interface
 * 
 * Ces composants encapsulent des icônes SVG avec des props standardisées.
 */

/** Icône Plus (+) pour les boutons de création */
export function PlusIcon({ className = 'w-4 h-4' }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
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

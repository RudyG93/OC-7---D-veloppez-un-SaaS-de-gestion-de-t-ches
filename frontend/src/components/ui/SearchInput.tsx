/**
 * Champ de recherche réutilisable
 *
 * Affiche un input avec icône loupe à droite.
 * Le texte ne chevauche jamais l'icône grâce au padding-right.
 *
 * @module components/ui/SearchInput
 */

'use client';

import { InputHTMLAttributes } from 'react';

// ============================================================================
// Types
// ============================================================================

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    /** Identifiant unique (pour le label sr-only) */
    inputId?: string;
    /** Label accessible (masqué visuellement) */
    label?: string;
}

// ============================================================================
// Composant
// ============================================================================

export default function SearchInput({
    inputId = 'search-input',
    label = 'Rechercher',
    placeholder = 'Rechercher',
    className = '',
    ...props
}: SearchInputProps) {
    return (
        <div className="relative">
            <label htmlFor={inputId} className="sr-only">
                {label}
            </label>
            <input
                id={inputId}
                type="text"
                placeholder={placeholder}
                className={`form-input-search pr-10 ${className}`}
                {...props}
            />
            <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sub pointer-events-none"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>
        </div>
    );
}

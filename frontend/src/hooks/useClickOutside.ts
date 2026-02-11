/**
 * Hook pour détecter les clics en dehors d'un élément
 *
 * Utile pour fermer les dropdowns, menus et popups
 * lorsque l'utilisateur clique ailleurs.
 *
 * @module hooks/useClickOutside
 */

'use client';

import { useEffect, useRef, type RefObject } from 'react';

/**
 * Détecte les clics en dehors d'un élément et exécute un callback
 *
 * @param ref - Référence vers l'élément à surveiller
 * @param callback - Fonction appelée lors d'un clic extérieur
 *
 * @example
 * const menuRef = useRef<HTMLDivElement>(null);
 * useClickOutside(menuRef, () => setIsOpen(false));
 */
export function useClickOutside(
    ref: RefObject<HTMLElement | null>,
    callback: () => void
) {
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callbackRef.current();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [ref]);
}

/**
 * Hook de debounce pour retarder une valeur
 *
 * Utile pour les champs de recherche afin d'éviter
 * des appels API à chaque frappe.
 *
 * @module hooks/useDebounce
 */

'use client';

import { useState, useEffect } from 'react';

/**
 * Retarde la mise à jour d'une valeur
 *
 * @param value - Valeur à débouncer
 * @param delay - Délai en millisecondes (défaut: 300ms)
 * @returns La valeur débouncée
 *
 * @example
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 300);
 *
 * useEffect(() => {
 *   if (debouncedSearch) fetchResults(debouncedSearch);
 * }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

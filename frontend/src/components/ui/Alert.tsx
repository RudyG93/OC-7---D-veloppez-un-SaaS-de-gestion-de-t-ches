'use client';

import { useEffect } from 'react';

/**
 * Props du composant Alert
 */
interface AlertProps {
    /** Type d'alerte qui détermine le style visuel */
    type: 'success' | 'error' | 'warning' | 'info';
    /** Message à afficher */
    message: string;
    /** Callback appelé lors de la fermeture */
    onClose?: () => void;
    /** Durée en ms avant auto-fermeture (0 = pas d'auto-fermeture) */
    autoDismiss?: number;
    /** Classe CSS additionnelle */
    className?: string;
}

/**
 * Composant Alert unifié pour afficher les messages de feedback
 *
 * @example
 * // Alerte d'erreur simple
 * <Alert type="error" message="Une erreur est survenue" />
 *
 * @example
 * // Alerte de succès avec auto-fermeture après 5 secondes
 * <Alert
 *   type="success"
 *   message="Opération réussie"
 *   autoDismiss={5000}
 *   onClose={() => setShowAlert(false)}
 * />
 */
export default function Alert({
    type,
    message,
    onClose,
    autoDismiss = 0,
    className = '',
}: AlertProps) {
    // Auto-dismiss après le délai spécifié
    useEffect(() => {
        if (autoDismiss > 0 && onClose) {
            const timer = setTimeout(() => {
                onClose();
            }, autoDismiss);

            return () => clearTimeout(timer);
        }
    }, [autoDismiss, onClose]);

    // Classes de style selon le type
    const styleClasses = {
        success: 'bg-green-50 border-green-200 text-green-700',
        error: 'bg-red-50 border-red-200 text-red-700',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
        info: 'bg-blue-50 border-blue-200 text-blue-700',
    }[type];

    // Icônes selon le type
    const icons = {
        success: (
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        ),
        error: (
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
        warning: (
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
        info: (
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    };

    return (
        <div
            role="alert"
            className={`flex items-center gap-3 p-4 border rounded-lg text-sm ${styleClasses} ${className}`}
        >
            {icons[type]}
            <span className="flex-1">{message}</span>
            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    className="p-1 hover:opacity-70 transition-opacity"
                    aria-label="Fermer l'alerte"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}

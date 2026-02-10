'use client';

import { forwardRef, InputHTMLAttributes, useId } from 'react';

/**
 * Tailles disponibles pour l'input
 */
type InputSize = 'sm' | 'md' | 'lg' | 'auth';

/**
 * Props du composant Input
 */
interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    /** Taille de l'input */
    inputSize?: InputSize;
    /** Label du champ */
    label?: string;
    /** Message d'erreur */
    error?: string;
    /** Indique si le champ est requis */
    isRequired?: boolean;
    /** Description ou aide pour le champ */
    helperText?: string;
}

/**
 * Classes de style par taille
 */
const sizeStyles: Record<InputSize, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-3 text-sm',
    auth: 'h-12 px-4 text-base',
};

/**
 * Composant Input réutilisable avec support d'accessibilité
 * 
 * @example
 * // Input simple
 * <Input placeholder="Email" type="email" />
 * 
 * @example
 * // Input avec label et erreur
 * <Input 
 *   label="Email" 
 *   type="email" 
 *   error="Email invalide" 
 *   isRequired 
 * />
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            inputSize = 'md',
            label,
            error,
            isRequired = false,
            helperText,
            className = '',
            id,
            ...props
        },
        ref
    ) => {
        // Utiliser useId pour générer un ID stable
        const generatedId = useId();
        const inputId = id || generatedId;
        const errorId = `${inputId}-error`;
        const helperId = `${inputId}-helper`;

        const baseStyles = 'w-full border rounded-lg bg-white font-body text-heading placeholder:text-sub transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent';
        
        const borderStyle = error ? 'border-red-500' : 'border-primary-grey';

        const inputClasses = `${baseStyles} ${sizeStyles[inputSize]} ${borderStyle} ${className}`.trim();

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-heading font-medium text-heading mb-1"
                    >
                        {label}
                        {isRequired && (
                            <>
                                <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
                                <span className="sr-only">(requis)</span>
                            </>
                        )}
                    </label>
                )}

                <input
                    ref={ref}
                    id={inputId}
                    aria-invalid={!!error}
                    aria-describedby={
                        [error ? errorId : null, helperText ? helperId : null]
                            .filter(Boolean)
                            .join(' ') || undefined
                    }
                    aria-required={isRequired}
                    className={inputClasses}
                    {...props}
                />

                {helperText && !error && (
                    <p id={helperId} className="mt-1 text-xs font-body text-sub">
                        {helperText}
                    </p>
                )}

                {error && (
                    <p id={errorId} role="alert" className="mt-1 text-sm text-red-500">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;

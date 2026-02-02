"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

/**
 * Props communes pour les champs de formulaire
 */
interface BaseFieldProps {
  /** Label du champ */
  label: string;
  /** ID du champ (généré automatiquement si non fourni) */
  id?: string;
  /** Message d'erreur à afficher */
  error?: string;
  /** Texte d'aide affiché sous le champ */
  helpText?: string;
  /** Le champ est requis */
  required?: boolean;
  /** Classe CSS additionnelle pour le conteneur */
  className?: string;
  /** Variante de style */
  variant?: "default" | "auth";
}

/**
 * Props pour le champ Input
 */
interface InputFieldProps
  extends
    BaseFieldProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className"> {
  /** Type de champ (text, email, password, etc.) */
  type?: string;
}

/**
 * Props pour le champ Textarea
 */
interface TextareaFieldProps
  extends
    BaseFieldProps,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "className"> {
  /** Nombre de lignes */
  rows?: number;
}

/**
 * Génère un ID unique pour les champs de formulaire
 */
const generateId = (label: string) => label.toLowerCase().replace(/\s+/g, "-");

/**
 * Classes de base pour les inputs
 */
const inputBaseClasses =
  "w-full border rounded-lg focus:outline-none focus:ring-2 transition-colors";

/**
 * Classes de variante pour les inputs
 */
const variantClasses = {
  default: {
    container: "",
    label: "block text-sm font-medium text-gray-700 mb-1",
    input:
      "px-3 py-2 text-sm border-gray-200 focus:ring-gray-300 focus:border-gray-300",
    inputError: "border-red-500 focus:ring-red-500 focus:border-red-500",
  },
  auth: {
    container: "",
    label: "block text-sm font-medium text-gray-900 mb-2",
    input:
      "px-4 py-3 border-gray-300 focus:ring-2 focus:ring-[#E65C00] focus:border-transparent",
    inputError: "border-red-500",
  },
};

/**
 * Composant FormField pour les champs input avec label et gestion des erreurs
 *
 * @example
 * // Champ simple
 * <FormField
 *   label="Email"
 *   type="email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   required
 * />
 *
 * @example
 * // Champ avec erreur
 * <FormField
 *   label="Mot de passe"
 *   type="password"
 *   error={errors.password}
 *   value={password}
 *   onChange={(e) => setPassword(e.target.value)}
 * />
 *
 * @example
 * // Variante auth (pour login/register)
 * <FormField
 *   label="Email"
 *   type="email"
 *   variant="auth"
 *   required
 * />
 */
export const FormField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      id,
      error,
      helpText,
      required = false,
      className = "",
      variant = "default",
      type = "text",
      ...props
    },
    ref,
  ) => {
    const fieldId = id || generateId(label);
    const errorId = `${fieldId}-error`;
    const helpId = `${fieldId}-help`;
    const styles = variantClasses[variant];

    return (
      <div className={`${styles.container} ${className}`}>
        <label htmlFor={fieldId} className={styles.label}>
          {label}
          {required && (
            <>
              <span className="text-red-500 ml-0.5" aria-hidden="true">
                *
              </span>
              <span className="sr-only">(requis)</span>
            </>
          )}
        </label>
        <input
          ref={ref}
          id={fieldId}
          type={type}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helpText ? helpId : undefined}
          className={`${inputBaseClasses} ${styles.input} ${error ? styles.inputError : ""}`}
          required={required}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className="mt-1 text-sm text-red-500">
            {error}
          </p>
        )}
        {helpText && !error && (
          <p id={helpId} className="mt-1 text-sm text-gray-500">
            {helpText}
          </p>
        )}
      </div>
    );
  },
);

FormField.displayName = "FormField";

/**
 * Composant FormTextarea pour les champs textarea avec label et gestion des erreurs
 *
 * @example
 * <FormTextarea
 *   label="Description"
 *   value={description}
 *   onChange={(e) => setDescription(e.target.value)}
 *   rows={4}
 * />
 */
export const FormTextarea = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  (
    {
      label,
      id,
      error,
      helpText,
      required = false,
      className = "",
      variant = "default",
      rows = 3,
      ...props
    },
    ref,
  ) => {
    const fieldId = id || generateId(label);
    const errorId = `${fieldId}-error`;
    const helpId = `${fieldId}-help`;
    const styles = variantClasses[variant];

    return (
      <div className={`${styles.container} ${className}`}>
        <label htmlFor={fieldId} className={styles.label}>
          {label}
          {required && (
            <>
              <span className="text-red-500 ml-0.5" aria-hidden="true">
                *
              </span>
              <span className="sr-only">(requis)</span>
            </>
          )}
        </label>
        <textarea
          ref={ref}
          id={fieldId}
          rows={rows}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helpText ? helpId : undefined}
          className={`${inputBaseClasses} ${styles.input} resize-none ${error ? styles.inputError : ""}`}
          required={required}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className="mt-1 text-sm text-red-500">
            {error}
          </p>
        )}
        {helpText && !error && (
          <p id={helpId} className="mt-1 text-sm text-gray-500">
            {helpText}
          </p>
        )}
      </div>
    );
  },
);

FormTextarea.displayName = "FormTextarea";

export default FormField;

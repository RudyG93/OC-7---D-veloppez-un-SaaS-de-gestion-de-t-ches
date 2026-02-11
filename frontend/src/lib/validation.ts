/**
 * Utilitaires de validation des formulaires
 *
 * Ce module fournit des fonctions de validation pour :
 * - Les formulaires de connexion
 * - Les formulaires d'inscription
 *
 * Les règles de validation sont :
 * - Email : format valide (x@x.x)
 * - Mot de passe : minimum 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre
 * - Nom : minimum 2 caractères (si fourni)
 */

// ============================================================================
// Types
// ============================================================================

/**
 * Structure d'une erreur de validation
 */
export interface ValidationError {
    /** Nom du champ en erreur */
    field: string;
    /** Message d'erreur à afficher */
    message: string;
}

// ============================================================================
// Expressions régulières
// ============================================================================

/** Regex pour valider le format d'email */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Regex pour valider la complexité du mot de passe
 * - Minimum 8 caractères
 * - Au moins une lettre minuscule
 * - Au moins une lettre majuscule
 * - Au moins un chiffre
 * - Caractères spéciaux autorisés : @$!%*?&
 */
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

// ============================================================================
// Fonctions de validation unitaires
// ============================================================================

/**
 * Vérifie si une chaîne est un email valide
 * @param email - Chaîne à valider
 * @returns true si l'email est valide
 */
const isValidEmail = (email: string): boolean => {
    return EMAIL_REGEX.test(email);
};

/**
 * Vérifie si un mot de passe respecte les critères de sécurité
 * @param password - Mot de passe à valider
 * @returns true si le mot de passe est valide
 */
const isValidPassword = (password: string): boolean => {
    return PASSWORD_REGEX.test(password);
};

// ============================================================================
// Fonctions de validation des formulaires
// ============================================================================

/**
 * Valide les champs du formulaire de connexion
 *
 * @param email - Email saisi par l'utilisateur
 * @param password - Mot de passe saisi
 * @returns Liste des erreurs de validation (vide si tout est valide)
 *
 * @example
 * const errors = validateLoginForm('user@example.com', 'password');
 * if (errors.length > 0) {
 *   // Afficher les erreurs
 * }
 */
export const validateLoginForm = (
    email: string,
    password: string
): ValidationError[] => {
    const errors: ValidationError[] = [];

    // Validation de l'email
    if (!email.trim()) {
        errors.push({ field: 'email', message: "L'email est requis" });
    } else if (!isValidEmail(email)) {
        errors.push({ field: 'email', message: "Format d'email invalide" });
    }

    // Validation du mot de passe (juste requis pour la connexion)
    if (!password) {
        errors.push({ field: 'password', message: 'Le mot de passe est requis' });
    }

    return errors;
};

/**
 * Valide les champs du formulaire d'inscription
 *
 * @param email - Email saisi par l'utilisateur
 * @param password - Mot de passe saisi
 * @param confirmPassword - Confirmation du mot de passe
 * @param name - Nom de l'utilisateur (optionnel)
 * @returns Liste des erreurs de validation (vide si tout est valide)
 *
 * @example
 * const errors = validateRegisterForm(
 *   'user@example.com',
 *   'Password123',
 *   'Password123',
 *   'John Doe'
 * );
 */
export const validateRegisterForm = (
    email: string,
    password: string,
    confirmPassword: string,
    name?: string
): ValidationError[] => {
    const errors: ValidationError[] = [];

    // Validation de l'email
    if (!email.trim()) {
        errors.push({ field: 'email', message: "L'email est requis" });
    } else if (!isValidEmail(email)) {
        errors.push({ field: 'email', message: "Format d'email invalide" });
    }

    // Validation du mot de passe (avec critères de complexité)
    if (!password) {
        errors.push({ field: 'password', message: 'Le mot de passe est requis' });
    } else if (!isValidPassword(password)) {
        errors.push({
            field: 'password',
            message:
                'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre',
        });
    }

    // Validation de la confirmation
    if (password !== confirmPassword) {
        errors.push({
            field: 'confirmPassword',
            message: 'Les mots de passe ne correspondent pas',
        });
    }

    // Validation du nom (si fourni)
    if (typeof name === 'string' && name.trim().length > 0 && name.trim().length < 2) {
        errors.push({
            field: 'name',
            message: 'Le nom doit contenir au moins 2 caractères',
        });
    }

    return errors;
};

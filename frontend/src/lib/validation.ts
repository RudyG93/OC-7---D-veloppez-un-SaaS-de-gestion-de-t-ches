export interface ValidationError {
    field: string;
    message: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

export const isValidEmail = (email: string): boolean => {
    return EMAIL_REGEX.test(email);
};

export const isValidPassword = (password: string): boolean => {
    return PASSWORD_REGEX.test(password);
};

export const validateLoginForm = (
    email: string,
    password: string
): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!email.trim()) {
        errors.push({ field: 'email', message: "L'email est requis" });
    } else if (!isValidEmail(email)) {
        errors.push({ field: 'email', message: "Format d'email invalide" });
    }

    if (!password) {
        errors.push({ field: 'password', message: 'Le mot de passe est requis' });
    }

    return errors;
};

export const validateRegisterForm = (
    email: string,
    password: string,
    confirmPassword: string,
    name?: string
): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!email.trim()) {
        errors.push({ field: 'email', message: "L'email est requis" });
    } else if (!isValidEmail(email)) {
        errors.push({ field: 'email', message: "Format d'email invalide" });
    }

    if (!password) {
        errors.push({ field: 'password', message: 'Le mot de passe est requis' });
    } else if (!isValidPassword(password)) {
        errors.push({
            field: 'password',
            message:
                'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre',
        });
    }

    if (password !== confirmPassword) {
        errors.push({
            field: 'confirmPassword',
            message: 'Les mots de passe ne correspondent pas',
        });
    }

    if (name && name.trim().length > 0 && name.trim().length < 2) {
        errors.push({
            field: 'name',
            message: 'Le nom doit contenir au moins 2 caractères',
        });
    }

    return errors;
};

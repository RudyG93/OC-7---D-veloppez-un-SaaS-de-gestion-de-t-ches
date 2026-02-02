'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRegister } from '@/hooks/useAuth';
import { validateRegisterForm, ValidationError } from '@/lib/validation';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';

export default function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<ValidationError[]>([]);

    const { register, isLoading, error: apiError } = useRegister();

    const getFieldError = (field: string) =>
        errors.find((e) => e.field === field)?.message;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);

        // Pour l'inscription simple (sans confirmation), on passe le même mot de passe
        const validationErrors = validateRegisterForm(email, password, password);
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await register({ email, password });
        } catch {
            // L'erreur est gérée par le hook
        }
    };

    return (
        <div className="w-full">
            {/* Titre */}
            <h1 className="text-4xl font-bold text-[#E65C00] mb-10">Inscription</h1>

            {/* Message d'erreur API */}
            {apiError && (
                <div className="mb-6">
                    <Alert
                        type="error"
                        message={apiError}
                    />
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                    <label
                        htmlFor="register-email"
                        className="block text-sm font-medium text-gray-900 mb-2"
                    >
                        Email
                    </label>
                    <input
                        id="register-email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-invalid={!!getFieldError('email')}
                        aria-describedby={getFieldError('email') ? 'register-email-error' : undefined}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E65C00] focus:border-transparent ${
                            getFieldError('email')
                                ? 'border-red-500'
                                : 'border-gray-300'
                        }`}
                        required
                    />
                    {getFieldError('email') && (
                        <p id="register-email-error" role="alert" className="mt-1 text-sm text-red-500">
                            {getFieldError('email')}
                        </p>
                    )}
                </div>

                {/* Mot de passe */}
                <div>
                    <label
                        htmlFor="register-password"
                        className="block text-sm font-medium text-gray-900 mb-2"
                    >
                        Mot de passe
                    </label>
                    <input
                        id="register-password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        aria-invalid={!!getFieldError('password')}
                        aria-describedby={getFieldError('password') ? 'register-password-error' : undefined}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E65C00] focus:border-transparent ${
                            getFieldError('password')
                                ? 'border-red-500'
                                : 'border-gray-300'
                        }`}
                        required
                    />
                    {getFieldError('password') && (
                        <p id="register-password-error" role="alert" className="mt-1 text-sm text-red-500">
                            {getFieldError('password')}
                        </p>
                    )}
                </div>

                {/* Bouton d'inscription */}
                <Button
                    type="submit"
                    disabled={isLoading}
                    isLoading={isLoading}
                    loadingText=""
                    variant="primary"
                    fullWidth
                    rounded
                    size="lg"
                >
                    S&apos;inscrire
                </Button>
            </form>

            {/* Lien vers connexion */}
            <div className="mt-16 text-sm">
                <span className="text-gray-600">Déjà inscrit ? </span>
                <Link
                    href="/login"
                    className="text-[#E65C00] hover:underline font-medium"
                >
                    Se connecter
                </Link>
            </div>
        </div>
    );
}

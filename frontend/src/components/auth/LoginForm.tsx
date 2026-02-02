'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLogin } from '@/hooks/useAuth';
import { validateLoginForm, ValidationError } from '@/lib/validation';
import Alert from '@/components/ui/Alert';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<ValidationError[]>([]);

    const { login, isLoading, error: apiError } = useLogin();

    const getFieldError = (field: string) =>
        errors.find((e) => e.field === field)?.message;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);

        const validationErrors = validateLoginForm(email, password);
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await login({ email, password });
        } catch {
            // L'erreur est gérée par le hook
        }
    };

    return (
        <div className="w-full">
            {/* Titre */}
            <h1 className="text-4xl font-bold text-[#E65C00] mb-10">Connexion</h1>

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
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-900 mb-2"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E65C00] focus:border-transparent ${
                            getFieldError('email')
                                ? 'border-red-500'
                                : 'border-gray-300'
                        }`}
                        required
                    />
                    {getFieldError('email') && (
                        <p className="mt-1 text-sm text-red-500">
                            {getFieldError('email')}
                        </p>
                    )}
                </div>

                {/* Mot de passe */}
                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-900 mb-2"
                    >
                        Mot de passe
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E65C00] focus:border-transparent ${
                            getFieldError('password')
                                ? 'border-red-500'
                                : 'border-gray-300'
                        }`}
                        required
                    />
                    {getFieldError('password') && (
                        <p className="mt-1 text-sm text-red-500">
                            {getFieldError('password')}
                        </p>
                    )}
                </div>

                {/* Bouton de connexion */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gray-900 text-white py-3 px-4 rounded-full font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isLoading ? (
                        <div className="spinner spinner-sm" style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }}></div>
                    ) : (
                        'Se connecter'
                    )}
                </button>

                {/* Mot de passe oublié */}
                <div className="text-center">
                    <Link
                        href="#"
                        className="text-[#E65C00] hover:underline text-sm"
                    >
                        Mot de passe oublié?
                    </Link>
                </div>
            </form>

            {/* Lien vers inscription */}
            <div className="mt-16 text-sm">
                <span className="text-gray-600">Pas encore de compte ? </span>
                <Link
                    href="/register"
                    className="text-[#E65C00] hover:underline font-medium"
                >
                    Créer un compte
                </Link>
            </div>
        </div>
    );
}

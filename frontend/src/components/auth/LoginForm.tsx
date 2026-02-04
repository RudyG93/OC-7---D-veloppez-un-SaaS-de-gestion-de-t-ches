'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLogin } from '@/hooks/useAuth';
import { validateLoginForm, ValidationError } from '@/lib/validation';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

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
                <Input
                    label="Email"
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={getFieldError('email')}
                    required
                    inputSize="lg"
                />

                <Input
                    label="Mot de passe"
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={getFieldError('password')}
                    required
                    inputSize="lg"
                />

                {/* Bouton de connexion */}
                <Button
                    type="submit"
                    disabled={isLoading}
                    variant="primary"
                    fullWidth
                    rounded
                    size="lg"
                >
                    {isLoading ? 'Connexion...' : 'Se connecter'}
                </Button>

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

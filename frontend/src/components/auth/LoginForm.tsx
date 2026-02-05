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
            <h1 className="text-3xl font-heading font-bold text-accent mb-10 text-center">Connexion</h1>

            {/* Message d'erreur API */}
            {apiError && (
                <div className="mb-4">
                    <Alert
                        type="error"
                        message={apiError}
                    />
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                    label="Email"
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={getFieldError('email')}
                    required
                    inputSize="auth"
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
                    inputSize="auth"
                />

                {/* Bouton de connexion */}
                <div className="pt-2 flex justify-center">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        variant="primary"
                        size="auth"
                    >
                        {isLoading ? 'Connexion...' : 'Se connecter'}
                    </Button>
                </div>

                {/* Mot de passe oublié */}
                <div className="text-center">
                    <Link
                        href="#"
                        className="text-accent underline text-sm"
                    >
                        Mot de passe oublié?
                    </Link>
                </div>
            </form>
        </div>
    );
}

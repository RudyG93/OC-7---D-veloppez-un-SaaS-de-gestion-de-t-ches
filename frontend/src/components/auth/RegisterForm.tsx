'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRegister } from '@/hooks/useAuth';
import { validateRegisterForm, ValidationError } from '@/lib/validation';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

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
                <Input
                    label="Email"
                    id="register-email"
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
                    id="register-password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={getFieldError('password')}
                    required
                    inputSize="lg"
                />

                {/* Bouton d'inscription */}
                <Button
                    type="submit"
                    disabled={isLoading}
                    variant="primary"
                    fullWidth
                    rounded
                    size="lg"
                >
                    {isLoading ? 'Inscription...' : "S'inscrire"}
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

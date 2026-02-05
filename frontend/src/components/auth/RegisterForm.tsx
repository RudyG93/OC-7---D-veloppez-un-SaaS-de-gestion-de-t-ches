'use client';

import { useState } from 'react';
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
            <h1 className="text-3xl font-heading font-bold text-accent mb-8 text-center">Inscription</h1>

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
                    id="register-email"
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
                    id="register-password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={getFieldError('password')}
                    required
                    inputSize="auth"
                />

                {/* Bouton d'inscription */}
                <div className="pt-2 flex justify-center">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        variant="primary"
                        size="auth"
                    >
                        {isLoading ? 'Inscription...' : "S'inscrire"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

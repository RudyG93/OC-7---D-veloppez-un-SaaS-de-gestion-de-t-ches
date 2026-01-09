'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRegisterMutation } from '@/hooks/useAuth';
import { validateRegisterForm, ValidationError } from '@/lib/validation';
import FormInput from '@/components/ui/FormInput';
import LoadingButton from '@/components/ui/LoadingButton';
import Alert from '@/components/ui/Alert';

export default function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<ValidationError[]>([]);

    const registerMutation = useRegisterMutation();

    const getFieldError = (field: string) =>
        errors.find((e) => e.field === field)?.message;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);

        const validationErrors = validateRegisterForm(
            email,
            password,
            confirmPassword,
            name
        );
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        registerMutation.mutate({
            email,
            password,
            name: name.trim() || undefined,
        });
    };

    return (
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title text-2xl font-bold justify-center mb-4">
                    Créer un compte
                </h2>

                {registerMutation.isError && (
                    <Alert
                        type="error"
                        message={
                            registerMutation.error?.message || 'Une erreur est survenue'
                        }
                    />
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <FormInput
                        label="Nom"
                        name="name"
                        type="text"
                        placeholder="Jean Dupont"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={getFieldError('name')}
                    />

                    <FormInput
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="vous@exemple.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={getFieldError('email')}
                        required
                    />

                    <FormInput
                        label="Mot de passe"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={getFieldError('password')}
                        required
                    />

                    <p className="text-xs text-base-content/60 -mt-2">
                        Minimum 8 caractères, une majuscule, une minuscule et un chiffre
                    </p>

                    <FormInput
                        label="Confirmer le mot de passe"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={getFieldError('confirmPassword')}
                        required
                    />

                    <LoadingButton
                        type="submit"
                        isLoading={registerMutation.isPending}
                    >
                        Créer mon compte
                    </LoadingButton>
                </form>

                <div className="divider">OU</div>

                <p className="text-center text-sm">
                    Déjà un compte ?{' '}
                    <Link href="/login" className="link link-primary font-medium">
                        Se connecter
                    </Link>
                </p>
            </div>
        </div>
    );
}

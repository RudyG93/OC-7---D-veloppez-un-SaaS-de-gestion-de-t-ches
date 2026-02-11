/**
 * Page de profil utilisateur
 * 
 * Permet à l'utilisateur de consulter et modifier ses informations
 * personnelles : nom, prénom, email et mot de passe.
 */
'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import { useProfile, useUpdateProfile } from '@/hooks/useAuth';
import { getDisplayName } from '@/lib/utils';

/** Structure des données du formulaire */
interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

/** Parse le nom complet en prénom et nom */
function parseUserName(fullName?: string | null): { firstName: string; lastName: string } {
    // Si le nom est absent ou correspond à deux lettres (initiales auto), on ne remplit pas le prénom
    if (!fullName || fullName.length === 2) {
        return { firstName: '', lastName: '' };
    }
    const nameParts = fullName.split(' ');
    return {
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
    };
}

export default function ProfilePage() {
    const { user, isLoading, error, refetch: refetchProfile } = useProfile();
    const { updateProfile, isLoading: isUpdating, error: updateError } = useUpdateProfile();

    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });
    const [successMessage, setSuccessMessage] = useState('');

    // Synchroniser le formulaire quand les données utilisateur changent
    const [prevUserId, setPrevUserId] = useState(user?.id);
    if (user?.id && user.id !== prevUserId) {
        setPrevUserId(user.id);
        const { firstName, lastName } = parseUserName(user.name);
        setFormData({
            firstName,
            lastName,
            email: user.email || '',
            password: '',
        });
    }

    /**
     * Gère les changements dans les champs du formulaire
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setSuccessMessage('');
    };

    /**
     * Soumet les modifications du profil
     * Ne soumet que les champs modifiés
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage('');

        // Construire l'objet des modifications
        const updateData: { name?: string; email?: string; password?: string } = {};

        const fullName = `${formData.firstName} ${formData.lastName}`.trim();
        if (fullName && fullName !== user?.name) {
            updateData.name = fullName;
        }
        if (formData.email && formData.email !== user?.email) {
            updateData.email = formData.email;
        }
        if (formData.password) {
            updateData.password = formData.password;
        }

        // Vérifier s'il y a des modifications
        if (Object.keys(updateData).length === 0) {
            setSuccessMessage('Aucune modification détectée');
            return;
        }

        try {
            await updateProfile(updateData);
            await refetchProfile();
            setSuccessMessage('Profil mis à jour avec succès');
            setFormData(prev => ({ ...prev, password: '' }));
        } catch {
            // L'erreur est gérée par le hook
        }
    };

    // État de chargement
    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <Spinner size="lg" label="Chargement du profil" />
                </main>
                <Footer />
            </div>
        );
    }

    // État d'erreur ou utilisateur non trouvé
    if (error || !user) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">Impossible de charger le profil</p>
                        <a href="/login" className="text-primary hover:underline">
                            Retour à la connexion
                        </a>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main id="main-content" className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
                <div className="bg-white border border-primary-grey rounded-xl p-6 sm:p-8 lg:p-12">
                    {/* En-tête */}
                    <div className="mb-8 sm:mb-12">
                        <h1 className="text-xl sm:text-2xl font-heading font-semibold text-heading">Mon compte</h1>
                                                {!(user.name && user.name.length === 2) && (formData.firstName || formData.lastName) ? (
                                                    <p className="mt-1 font-body text-sub">{getDisplayName(user.name, user.email)}</p>
                                                ) : null}
                    </div>

                    {/* Messages de feedback */}
                    {updateError && (
                        <Alert type="error" message={updateError} className="mb-6" />
                    )}
                    {successMessage && (
                        <Alert
                            type="success"
                            message={successMessage}
                            autoDismiss={5000}
                            onClose={() => setSuccessMessage('')}
                            className="mb-6"
                        />
                    )}

                    {/* Formulaire de modification */}
                    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-10">
                        <Input
                            label="Nom"
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Votre nom"
                            inputSize="lg"
                        />
                        <Input
                            label="Prénom"
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="Votre prénom"
                            inputSize="lg"
                        />
                        <Input
                            label="Email"
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="votre@email.com"
                            inputSize="lg"
                        />
                        <Input
                            label="Mot de passe"
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="*************"
                            inputSize="lg"
                        />

                        <div className="pt-4">
                            <Button
                                type="submit"
                                variant="primary"
                                size="proj"
                                disabled={isUpdating}
                            >
                                {isUpdating ? 'Mise à jour...' : 'Modifier les informations'}
                            </Button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}

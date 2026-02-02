'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Alert from '@/components/ui/Alert';
import { useProfile, useUpdateProfile } from '@/hooks/useAuth';

export default function ProfilePage() {
    const { user, isLoading, error, refetch: refetchProfile } = useProfile();
    const { updateProfile, isLoading: isUpdating, error: updateError } = useUpdateProfile();

    // Calculer les valeurs initiales basées sur user
    const getInitialFormData = () => {
        if (user) {
            const nameParts = user.name?.split(' ') || ['', ''];
            return {
                firstName: nameParts[0] || '',
                lastName: nameParts.slice(1).join(' ') || '',
                email: user.email || '',
                password: '',
            };
        }
        return {
            lastName: '',
            firstName: '',
            email: '',
            password: '',
        };
    };

    const [formData, setFormData] = useState(getInitialFormData);
    const [successMessage, setSuccessMessage] = useState('');

    // Mettre à jour le formulaire quand user change (après le chargement initial)
    const [prevUserId, setPrevUserId] = useState(user?.id);
    if (user?.id !== prevUserId) {
        setPrevUserId(user?.id);
        const nameParts = user?.name?.split(' ') || ['', ''];
        setFormData({
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email: user?.email || '',
            password: '',
        });
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        setSuccessMessage('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage('');

        const updateData: { name?: string; email?: string; password?: string } = {};

        // Combiner prénom et nom
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

        // Ne rien faire si aucune modification
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

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-white">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="spinner spinner-lg"></div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen flex flex-col bg-white">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">Impossible de charger le profil</p>
                        <a href="/login" className="text-[#D3590B] hover:underline">
                            Retour à la connexion
                        </a>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Carte du profil */}
                <div className="bg-white border border-gray-200 rounded-xl p-8">
                    {/* En-tête */}
                    <div className="mb-8">
                        <h1 className="text-xl font-bold text-gray-900">Mon compte</h1>
                        <p className="text-gray-500">{user.name || user.email}</p>
                    </div>

                    {/* Messages */}
                    {updateError && (
                        <Alert
                            type="error"
                            message={updateError}
                            className="mb-6"
                        />
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

                    {/* Formulaire */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Nom */}
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                Nom
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-[#D3590B] focus:border-[#D3590B] transition-colors"
                                placeholder="Votre nom"
                            />
                        </div>

                        {/* Prénom */}
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                Prénom
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-[#D3590B] focus:border-[#D3590B] transition-colors"
                                placeholder="Votre prénom"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-[#D3590B] focus:border-[#D3590B] transition-colors"
                                placeholder="votre@email.com"
                            />
                        </div>

                        {/* Mot de passe */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-[#D3590B] focus:border-[#D3590B] transition-colors"
                                placeholder="Nouveau mot de passe (laisser vide pour ne pas modifier)"
                            />
                        </div>

                        {/* Bouton */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isUpdating ? (
                                    <span className="flex items-center gap-2">
                                        <div className="spinner spinner-sm" style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }}></div>
                                        Mise à jour...
                                    </span>
                                ) : (
                                    'Modifier les informations'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}

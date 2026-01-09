'use client';

import Header from "@/components/layout/Header";
import { useProfile } from "@/hooks/useAuth";

export default function ProfilePage() {
    const { data: user, isLoading, isError } = useProfile();

    if (isLoading) {
        return (
            <>
                <Header />
                <main className="max-w-4xl mx-auto py-8 px-4">
                    <div className="flex justify-center items-center min-h-[50vh]">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                </main>
            </>
        );
    }

    if (isError || !user) {
        return (
            <>
                <Header />
                <main className="max-w-4xl mx-auto py-8 px-4">
                    <div className="alert alert-error">
                        <span>Impossible de charger le profil</span>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="max-w-4xl mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title mb-4">Informations personnelles</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-base-content/60">
                                    Nom
                                </label>
                                <p className="text-lg font-medium">
                                    {user.name || 'Non défini'}
                                </p>
                            </div>

                            <div className="divider my-2"></div>

                            <div>
                                <label className="text-sm text-base-content/60">
                                    Email
                                </label>
                                <p className="text-lg font-medium">{user.email}</p>
                            </div>

                            <div className="divider my-2"></div>

                            <div>
                                <label className="text-sm text-base-content/60">
                                    Membre depuis
                                </label>
                                <p className="text-lg font-medium">
                                    {user.createdAt
                                        ? new Date(user.createdAt).toLocaleDateString(
                                              'fr-FR',
                                              {
                                                  year: 'numeric',
                                                  month: 'long',
                                                  day: 'numeric',
                                              }
                                          )
                                        : '-'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

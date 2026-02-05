/**
 * AuthLayout - Layout partagé pour les pages d'authentification
 * 
 * Ce composant fournit une mise en page cohérente pour les pages
 * de connexion et d'inscription avec :
 * - Logo en haut
 * - Formulaire au centre
 * - Lien de navigation en bas
 * - Une image décorative à droite (desktop uniquement)
 */
import Image from 'next/image';
import { ReactNode } from 'react';

interface AuthLayoutProps {
    /** Contenu du formulaire (LoginForm ou RegisterForm) */
    children: ReactNode;
    /** Chemin de l'image de fond (ex: "/login.jpg") */
    imageSrc: string;
    /** Texte alternatif pour l'image */
    imageAlt?: string;
    /** Lien de navigation en bas de page */
    bottomLink?: ReactNode;
}

export default function AuthLayout({ 
    children, 
    imageSrc, 
    imageAlt = "Image décorative",
    bottomLink
}: AuthLayoutProps) {
    return (
        <main id="main-content" className="min-h-screen flex">
            {/* Section formulaire (1/3 sur desktop) */}
            <div className="w-full lg:w-1/3 flex flex-col min-h-screen px-6 py-12 bg-background">
                {/* Logo en haut */}
                <div className="flex justify-center pt-4">
                    <Image
                        src="/logo-orange.png"
                        alt="Abricot"
                        width={200}
                        height={67}
                        priority
                    />
                </div>

                {/* Formulaire au centre */}
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-xs">
                        {children}
                    </div>
                </div>

                {/* Lien en bas */}
                {bottomLink && (
                    <div className="text-sm text-center pb-8">
                        {bottomLink}
                    </div>
                )}
            </div>

            {/* Section image (2/3 sur desktop) */}
            <div className="hidden lg:block lg:w-2/3 relative">
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    className="object-cover"
                    priority
                />
            </div>
        </main>
    );
}

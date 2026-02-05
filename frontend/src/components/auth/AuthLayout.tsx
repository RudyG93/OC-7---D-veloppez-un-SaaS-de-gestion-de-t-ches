/**
 * AuthLayout - Layout partagé pour les pages d'authentification
 * 
 * Ce composant fournit une mise en page cohérente pour les pages
 * de connexion et d'inscription avec :
 * - Une section formulaire à gauche (mobile: pleine largeur)
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
}

export default function AuthLayout({ 
    children, 
    imageSrc, 
    imageAlt = "Image décorative" 
}: AuthLayoutProps) {
    return (
        <main id="main-content" className="min-h-screen flex">
            {/* Section formulaire */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 xl:px-24 bg-white">
                <div className="max-w-md mx-auto w-full">
                    {/* Logo */}
                    <div className="mb-16">
                        <Image
                            src="/logo-orange.png"
                            alt="Abricot"
                            width={200}
                            height={50}
                            priority
                        />
                    </div>

                    {/* Formulaire */}
                    {children}
                </div>
            </div>

            {/* Section image (desktop uniquement) */}
            <div className="hidden lg:block lg:w-1/2 relative">
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

/**
 * Page 404 — Page non trouvée
 *
 * Affichée automatiquement par Next.js lorsqu'une route n'existe pas.
 * Propose un lien de retour vers le tableau de bord.
 */
import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* En-tête simplifié */}
            <header className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-16">
                        <Link href="/dashboard" className="shrink-0">
                            <Image
                                src="/logo-orange.png"
                                alt="Abricot — Retour à l'accueil"
                                width={120}
                                height={32}
                                priority
                            />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Contenu principal */}
            <main id="main-content" className="flex-1 flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <p className="text-6xl font-heading font-bold text-primary mb-4" aria-hidden="true">
                        404
                    </p>
                    <h1 className="text-2xl font-heading font-semibold text-heading mb-2">
                        Page introuvable
                    </h1>
                    <p className="font-body text-sub mb-8">
                        La page que vous recherchez n&apos;existe pas ou a été déplacée.
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 bg-heading text-white font-heading font-medium text-sm px-8 py-3 rounded-full hover:bg-heading/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        Retour au tableau de bord
                    </Link>
                </div>
            </main>

            {/* Pied de page */}
            <footer className="bg-white border-t border-gray-100 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                        <Image
                            src="/logo-black.png"
                            alt="Abricot"
                            width={80}
                            height={24}
                        />
                        <span className="text-sm font-body">
                            Abricot {new Date().getFullYear()}
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

/**
 * Pied de page de l'application
 *
 * Affiche le logo et le copyright de l'application.
 *
 * @module components/layout/Footer
 */

import Image from 'next/image';

// ============================================================================
// Composant
// ============================================================================

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-100 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                    {/* Logo */}
                    <Image
                        src="/logo-black.png"
                        alt="Abricot"
                        width={80}
                        height={24}
                        style={{ width: 'auto', height: 'auto' }}
                    />

                    {/* Copyright */}
                    <span className="text-sm font-body">
                        Abricot {currentYear}
                    </span>
                </div>
            </div>
        </footer>
    );
}

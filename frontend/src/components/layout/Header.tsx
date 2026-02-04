/**
 * En-tête de l'application
 *
 * Composant de navigation principale affichant :
 * - Logo avec lien vers le dashboard
 * - Navigation (Dashboard, Projets)
 * - Menu utilisateur avec dropdown (profil, déconnexion)
 *
 * @module components/layout/Header
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useProfile, useLogout } from '@/hooks/useAuth';
import { getInitials } from '@/lib/utils';

// ============================================================================
// Composant
// ============================================================================

export default function Header() {
    const pathname = usePathname();
    const { user } = useProfile();
    const logout = useLogout();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Fermer le menu au clic extérieur
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    /** Initiales de l'utilisateur pour l'avatar */
    const userInitials = getInitials(user?.name || '', user?.email);

    /** Vérifie si un chemin est actif */
    const isActive = (path: string) => pathname === path;

    return (
        <header className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/dashboard" className="shrink-0 cursor-pointer">
                        <Image
                            src="/logo-orange.png"
                            alt="Abricot"
                            width={120}
                            height={32}
                            priority
                        />
                    </Link>

                    {/* Navigation centrale */}
                    <nav className="flex items-center space-x-1">
                        <Link
                            href="/dashboard"
                            className={`flex items-center gap-2 px-5 py-3 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                                isActive('/dashboard')
                                    ? 'bg-gray-900 text-white'
                                    : 'text-[#D3590B] hover:bg-orange-50'
                            }`}
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                />
                            </svg>
                            Tableau de bord
                        </Link>

                        <Link
                            href="/projects"
                            className={`flex items-center gap-2 px-5 py-3 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                                pathname.startsWith('/projects')
                                    ? 'bg-gray-900 text-white'
                                    : 'text-[#D3590B] hover:bg-orange-50'
                            }`}
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                                />
                            </svg>
                            Projets
                        </Link>
                    </nav>

                    {/* Menu utilisateur */}
                    <div className="flex items-center">
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                aria-expanded={isMenuOpen}
                                aria-haspopup="true"
                                aria-label="Menu utilisateur"
                                className="w-10 h-10 rounded-full bg-[#D3590B] flex items-center justify-center text-sm font-semibold text-white hover:bg-[#B84D0A] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D3590B]"
                            >
                                {userInitials}
                            </button>

                            {/* Dropdown menu */}
                            {isMenuOpen && (
                                <div
                                    role="menu"
                                    aria-orientation="vertical"
                                    className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-100 z-50"
                                >
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="font-medium text-gray-900">
                                            {user?.name || 'Utilisateur'}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {user?.email}
                                        </p>
                                    </div>
                                    <div className="py-1">
                                        <Link
                                            href="/profile"
                                            role="menuitem"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer focus:outline-none focus:bg-gray-100"
                                        >
                                            Mon profil
                                        </Link>
                                        <button
                                            role="menuitem"
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                logout();
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer focus:outline-none focus:bg-red-100"
                                        >
                                            Déconnexion
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

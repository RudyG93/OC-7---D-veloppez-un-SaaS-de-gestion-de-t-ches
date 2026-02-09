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
import Avatar from '@/components/ui/Avatar';

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
                            className={`flex items-center justify-center gap-3 w-48 py-4 rounded-md text-sm font-body transition-colors cursor-pointer ${
                                isActive('/dashboard')
                                    ? 'bg-gray-900 text-white'
                                    : 'text-primary hover:bg-primary-light'
                            }`}
                        >
                            <Image
                                src={isActive('/dashboard') ? '/btn-act-dashboard.png' : '/btn-dashboard.png'}
                                alt=""
                                width={16}
                                height={16}
                                aria-hidden="true"
                            />
                            Tableau de bord
                        </Link>

                        <Link
                            href="/projects"
                            className={`flex items-center justify-center gap-3 w-48 py-4 rounded-md text-sm font-body transition-colors cursor-pointer ${
                                pathname.startsWith('/projects')
                                    ? 'bg-gray-900 text-white'
                                    : 'text-primary hover:bg-primary-light'
                            }`}
                        >
                            <Image
                                src={pathname.startsWith('/projects') ? '/btn-act-project.png' : '/btn-project.png'}
                                alt=""
                                width={20}
                                height={20}
                                aria-hidden="true"
                            />
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
                                className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-full"
                            >
                                <Avatar
                                    name={user?.name}
                                    email={user?.email}
                                    size="xl"
                                    variant="light"
                                />
                            </button>

                            {/* Dropdown menu */}
                            {isMenuOpen && (
                                <div
                                    role="menu"
                                    aria-orientation="vertical"
                                    className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-100 z-50"
                                >
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="font-medium">
                                            {user?.name || 'Utilisateur'}
                                        </p>
                                        <p className="text-xs text-sub">
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

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

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useProfile, useLogout } from '@/hooks/useAuth';
import { useClickOutside } from '@/hooks/useClickOutside';
import Avatar from '@/components/ui/Avatar';

// ============================================================================
// Configuration de la navigation
// ============================================================================

/** Éléments de navigation partagés entre desktop et mobile */
const NAV_ITEMS = [
    {
        href: '/dashboard',
        label: 'Tableau de bord',
        icon: { default: '/btn-dashboard.png', active: '/btn-act-dashboard.png' },
        iconSize: 16,
        isActive: (pathname: string) => pathname === '/dashboard',
    },
    {
        href: '/projects',
        label: 'Projets',
        icon: { default: '/btn-project.png', active: '/btn-act-project.png' },
        iconSize: 20,
        isActive: (pathname: string) => pathname.startsWith('/projects'),
    },
] as const;

// ============================================================================
// Composant
// ============================================================================

export default function Header() {
    const pathname = usePathname();
    const { user } = useProfile();
    const logout = useLogout();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [prevPathname, setPrevPathname] = useState(pathname);

    // Fermer le menu mobile lors d'un changement de route
    if (prevPathname !== pathname) {
        setPrevPathname(pathname);
        if (isMobileNavOpen) setIsMobileNavOpen(false);
    }

    // Fermer le dropdown utilisateur au clic extérieur
    const closeMenu = useCallback(() => setIsMenuOpen(false), []);
    useClickOutside(menuRef, closeMenu);

    return (
        <header className="bg-white border-b border-gray-100 mb-4 sm:mb-6 lg:mb-10">
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

                    {/* Navigation centrale — masquée sur mobile */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {NAV_ITEMS.map((item) => {
                            const active = item.isActive(pathname);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    aria-current={active ? 'page' : undefined}
                                    className={`flex items-center justify-center gap-3 w-48 py-4 rounded-md text-sm font-body transition-colors cursor-pointer ${
                                        active
                                            ? 'bg-gray-900 text-white'
                                            : 'text-primary hover:bg-primary-light'
                                    }`}
                                >
                                    <Image
                                        src={active ? item.icon.active : item.icon.default}
                                        alt=""
                                        width={item.iconSize}
                                        height={item.iconSize}
                                        aria-hidden="true"
                                    />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bouton burger + menu utilisateur */}
                    <div className="flex items-center gap-3">
                        {/* Bouton burger — visible uniquement sur mobile */}
                        <button
                            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                            aria-expanded={isMobileNavOpen}
                            aria-label="Menu de navigation"
                            className="md:hidden p-2 rounded-md text-sub hover:bg-gray-50 cursor-pointer"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                {isMobileNavOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>

                        {/* Menu utilisateur */}
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
                                    variant={pathname === '/profile' ? 'orange' : 'light'}
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

            {/* Navigation mobile — panneau déroulant */}
            {isMobileNavOpen && (
                <nav className="md:hidden border-t border-gray-100 bg-white">
                    <div className="px-4 py-3 space-y-1">
                        {NAV_ITEMS.map((item) => {
                            const active = item.isActive(pathname);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    aria-current={active ? 'page' : undefined}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-body transition-colors cursor-pointer ${
                                        active
                                            ? 'bg-gray-900 text-white'
                                            : 'text-primary hover:bg-primary-light'
                                    }`}
                                >
                                    <Image
                                        src={active ? item.icon.active : item.icon.default}
                                        alt=""
                                        width={item.iconSize}
                                        height={item.iconSize}
                                        aria-hidden="true"
                                    />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            )}
        </header>
    );
}

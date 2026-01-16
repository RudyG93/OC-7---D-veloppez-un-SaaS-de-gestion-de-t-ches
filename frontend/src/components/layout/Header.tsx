'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useProfile, useLogout } from '@/hooks/useAuth';

export default function Header() {
    const pathname = usePathname();
    const { user } = useProfile();
    const logout = useLogout();

    // Obtenir les initiales de l'utilisateur
    const getInitials = () => {
        if (user?.name) {
            const names = user.name.split(' ');
            if (names.length >= 2) {
                return `${names[0][0]}${names[1][0]}`.toUpperCase();
            }
            return user.name.substring(0, 2).toUpperCase();
        }
        if (user?.email) {
            return user.email.substring(0, 2).toUpperCase();
        }
        return 'U';
    };

    const isActive = (path: string) => pathname === path;

    return (
        <header className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/dashboard" className="shrink-0">
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
                            className={`flex items-center gap-2 px-5 py-3 rounded-md text-sm font-medium transition-colors ${
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
                            className={`flex items-center gap-2 px-5 py-3 rounded-md text-sm font-medium transition-colors ${
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
                        <div className="dropdown dropdown-end">
                            <button
                                tabIndex={0}
                                className="w-10 h-10 rounded-full bg-[#D3590B] flex items-center justify-center text-sm font-semibold text-white hover:bg-[#B84D0A] transition-colors"
                            >
                                {getInitials()}
                            </button>
                            <ul
                                tabIndex={0}
                                className="dropdown-content z-1 menu p-2 shadow-lg bg-white rounded-lg w-52 mt-2 border border-gray-100"
                            >
                                <li className="px-4 py-2 border-b border-gray-100">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-900">
                                            {user?.name || 'Utilisateur'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {user?.email}
                                        </span>
                                    </div>
                                </li>
                                <li>
                                    <Link
                                        href="/profile"
                                        className="text-gray-700 hover:bg-gray-50"
                                    >
                                        Mon profil
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={logout}
                                        className="text-red-600 hover:bg-red-50"
                                    >
                                        Déconnexion
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

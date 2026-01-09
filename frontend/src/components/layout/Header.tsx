'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
    const router = useRouter();

    const handleLogout = () => {
        router.push('/login');
        router.refresh();
    };

    return (
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900">Abricot.co</h1>
            </div>
            <div>
                <nav className="bg-gray-100 p-4">
                    <ul className="flex space-x-4 items-center">
                        <li>
                            <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
                                Mon Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link href="/profile" className="text-gray-700 hover:text-gray-900">
                                Mon Profil
                            </Link>
                        </li>
                        <li className="ml-auto">
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                            >
                                Déconnexion
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
import Link from "next/link";

export default function Header() {
    return (
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900">Abricot.co</h1>
            </div>
            <div>
                <nav className="bg-gray-100 p-4">
                    <ul className="flex space-x-4">
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
                    </ul>
                </nav>
            </div>
        </header>
    );
}
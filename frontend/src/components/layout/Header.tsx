'use client';

import Link from "next/link";
import { useProfile, useLogout } from "@/hooks/useAuth";

export default function Header() {
    const { data: user, isLoading } = useProfile();
    const logout = useLogout();

    return (
        <header className="navbar bg-base-100 shadow-lg px-4">
            <div className="flex-1">
                <Link
                    href="/dashboard"
                    className="btn btn-ghost text-xl font-bold text-primary"
                >
                    TaskFlow
                </Link>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1 items-center gap-2">
                    <li>
                        <Link href="/dashboard" className="btn btn-ghost btn-sm">
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link href="/profile" className="btn btn-ghost btn-sm">
                            Mon Profil
                        </Link>
                    </li>
                    {!isLoading && user && (
                        <li>
                            <span className="badge badge-primary badge-outline">
                                {user.name || user.email}
                            </span>
                        </li>
                    )}
                    <li>
                        <button
                            onClick={logout}
                            className="btn btn-error btn-outline btn-sm"
                        >
                            Déconnexion
                        </button>
                    </li>
                </ul>
            </div>
        </header>
    );
}

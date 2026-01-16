'use client';

import Image from 'next/image';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-100 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Image
                        src="/logo-black.png"
                        alt="Abricot"
                        width={80}
                        height={24}
                        className="opacity-60"
                    />

                    {/* Copyright */}
                    <span className="text-sm text-gray-500">
                        Abricot {currentYear}
                    </span>
                </div>
            </div>
        </footer>
    );
}

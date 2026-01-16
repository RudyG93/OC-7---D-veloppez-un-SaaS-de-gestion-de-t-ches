/**
 * Middleware Next.js pour la protection des routes
 *
 * Ce middleware s'exécute avant chaque requête et gère :
 * - La protection des routes authentifiées (dashboard, profile, projects)
 * - La redirection des utilisateurs connectés loin des pages d'auth
 *
 * Routes protégées (nécessitent un token) :
 * - /dashboard/*
 * - /profile/*
 * - /projects/*
 *
 * Routes publiques (redirigent si connecté) :
 * - /login
 * - /register
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware de gestion de l'authentification
 *
 * @param request - Requête Next.js entrante
 * @returns Réponse Next.js (redirection ou continuation)
 */
export function proxy(request: NextRequest) {
    // Récupérer le token depuis les cookies
    const token = request.cookies.get('token')?.value;

    // Définir les routes qui nécessitent une authentification
    const isProtectedRoute =
        request.nextUrl.pathname.startsWith('/dashboard') ||
        request.nextUrl.pathname.startsWith('/profile') ||
        request.nextUrl.pathname.startsWith('/projects');

    // Définir les routes d'authentification (login/register)
    const isAuthRoute =
        request.nextUrl.pathname === '/login' ||
        request.nextUrl.pathname === '/register';

    // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
    // → Rediriger vers la page de connexion
    if (!token && isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Si l'utilisateur est connecté et essaie d'accéder aux pages d'auth
    // → Rediriger vers le dashboard
    if (token && isAuthRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Continuer la requête normalement
    return NextResponse.next();
}

/**
 * Configuration du middleware
 * Définit sur quelles routes le middleware s'exécute
 *
 * Exclut :
 * - /api/* (routes API)
 * - /_next/static/* (fichiers statiques Next.js)
 * - /_next/image/* (optimisation d'images Next.js)
 * - /favicon.ico (favicon)
 */
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

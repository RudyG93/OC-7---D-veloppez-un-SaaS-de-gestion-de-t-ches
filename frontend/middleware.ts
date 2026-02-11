/**
 * Middleware Next.js — Protection des routes authentifiées
 *
 * Vérifie la présence du token JWT dans les cookies pour les routes protégées.
 * Redirige vers /login si l'utilisateur n'est pas authentifié.
 * Redirige vers /dashboard si un utilisateur authentifié accède à /login ou /register.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Routes nécessitant une authentification */
const PROTECTED_ROUTES = ['/dashboard', '/projects', '/profile'];

/** Routes réservées aux visiteurs non connectés */
const AUTH_ROUTES = ['/login', '/register'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('token')?.value;

    // Vérifier si la route est protégée
    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
    const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));

    // Rediriger vers /login si pas de token sur une route protégée
    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // Rediriger vers /dashboard si déjà connecté et sur login/register
    if (isAuthRoute && token) {
        const dashboardUrl = new URL('/dashboard', request.url);
        return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
}

/** Configuration : appliquer le middleware sur les routes spécifiques */
export const config = {
    matcher: ['/dashboard/:path*', '/projects/:path*', '/profile/:path*', '/login', '/register'],
};

/**
 * Page de connexion
 * 
 * Permet aux utilisateurs existants de se connecter à leur compte.
 * Redirige vers le dashboard après une connexion réussie.
 */
import { Metadata } from "next";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
    title: "Connexion - Abricot",
    description: "Connectez-vous à votre compte Abricot",
};

export default function LoginPage() {
    return (
        <AuthLayout 
            imageSrc="/login.jpg" 
            imageAlt="Bureau avec fournitures"
            bottomLink={
                <>
                    <span>Pas encore de compte ? </span>
                    <Link
                        href="/register"
                        className="text-accent underline"
                    >
                        Créer un compte
                    </Link>
                </>
            }
        >
            <LoginForm />
        </AuthLayout>
    );
}

/**
 * Page d'inscription
 * 
 * Permet aux nouveaux utilisateurs de créer un compte.
 * Redirige vers le dashboard après une inscription réussie.
 */
import { Metadata } from "next";
import AuthLayout from "@/components/auth/AuthLayout";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
    title: "Inscription - Abricot",
    description: "Créez votre compte Abricot",
};

export default function RegisterPage() {
    return (
        <AuthLayout imageSrc="/register.jpg" imageAlt="Bureau avec fournitures">
            <RegisterForm />
        </AuthLayout>
    );
}

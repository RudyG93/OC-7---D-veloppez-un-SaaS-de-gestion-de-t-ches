import { Metadata } from "next";
import Image from "next/image";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
    title: "Inscription - Abricot",
    description: "Créez votre compte Abricot",
};

export default function RegisterPage() {
    return (
        <main className="min-h-screen flex">
            {/* Partie gauche - Formulaire */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 xl:px-24 bg-white">
                <div className="max-w-md mx-auto w-full">
                    {/* Logo */}
                    <div className="mb-16">
                        <Image
                            src="/logo-orange.png"
                            alt="Abricot"
                            width={200}
                            height={50}
                            priority
                        />
                    </div>

                    {/* Formulaire */}
                    <RegisterForm />
                </div>
            </div>

            {/* Partie droite - Image */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <Image
                    src="/register.jpg"
                    alt="Bureau avec fournitures"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
        </main>
    );
}

import { Metadata } from "next";
import RegisterForm from "@/features/RegisterForm";

export const metadata: Metadata = {
    title: "Inscription - TaskFlow",
    description: "Créez votre compte TaskFlow",
};

export default function RegisterPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-base-200 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-primary">TaskFlow</h1>
                    <p className="text-base-content/60 mt-2">
                        Créez votre compte gratuitement
                    </p>
                </div>
                <RegisterForm />
            </div>
        </main>
    );
}

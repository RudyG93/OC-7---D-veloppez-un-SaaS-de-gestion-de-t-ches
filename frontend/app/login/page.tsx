import { Metadata } from "next";
import LoginForm from "@/features/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Page de connexion",
};

export default function LoginPage() {
  return (
    <>
      <div>
        <h1>Login</h1>
        <p>Bienvenue sur votre page de connexion.</p>
      </div>
      <LoginForm />
    </>
  );
}

import { Metadata } from "next";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Mon Profil",
  description: "Page de profil utilisateur",
};

export default function ProfilePage() {
  return (
    <>
      <Header />
      <div>
        <h1>Mon Profil</h1>
        <p>Bienvenue sur votre page de profil.</p>
      </div>
    </>
  );
}

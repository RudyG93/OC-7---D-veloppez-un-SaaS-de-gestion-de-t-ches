import { Metadata } from "next";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Mon Dashboard",
  description: "Page de dashboard utilisateur",
};

export default function DashboardPage() {
  return (
    <>
      <Header />
      <div>
        <h1>Mon Dashboard</h1>
        <p>Bienvenue sur votre dashboard.</p>
      </div>
    </>
  );
}

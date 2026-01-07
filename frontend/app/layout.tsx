import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import TanStackProvider from "@/providers/TanStackProvider";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Abricot.co",
    template: "%s - Abricot.co",
  },
  description: "SaaS de Gestion de Projet Collaboratif ",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${manrope.variable} antialiased`}>
        <TanStackProvider>{children}</TanStackProvider>
      </body>
    </html>
  );
}

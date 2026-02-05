/**
 * Page de liste des projets
 * 
 * Affiche tous les projets auxquels l'utilisateur a accès.
 * Permet de créer un nouveau projet via une modale.
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Alert from "@/components/ui/Alert";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";
import { PlusIcon } from "@/components/ui/Icons";
import { useProjects } from "@/hooks/useProjects";
import { useProfile } from "@/hooks/useAuth";
import ProjectCard from "@/components/projects/ProjectCard";
import CreateProjectModal from "@/components/modals/CreateProject";

export default function ProjectsPage() {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { projects, isLoading, error } = useProjects();
  const { user } = useProfile();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main id="main-content" className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mes projets</h1>
            <p className="text-gray-500 mt-1">
              Gérez vos projets et collaborez avec votre équipe
            </p>
          </div>

          <Button
            onClick={() => setShowCreateModal(true)}
            variant="primary"
            leftIcon={<PlusIcon />}
          >
            Créer un projet
          </Button>
        </div>

        {/* Message d'erreur */}
        {error && <Alert type="error" message={error} className="mb-6" />}

        {/* Liste des projets */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" label="Chargement des projets" />
          </div>
        ) : (projects ?? []).length === 0 ? (
          <div className="text-center py-20">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Aucun projet
            </h3>
            <p className="text-gray-500 mb-4">
              Commencez par créer votre premier projet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(projects ?? []).map((project) => (
              <ProjectCard key={project.id} project={project} user={user!} />
            ))}
          </div>
        )}
      </main>

      <Footer />

      {/* Modale de création */}
      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={(projectId) => {
            router.push(`/projects/${projectId}`);
          }}
        />
      )}
    </div>
  );
}

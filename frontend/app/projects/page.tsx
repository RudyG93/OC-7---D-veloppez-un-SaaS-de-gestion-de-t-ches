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
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main
        id="main-content"
        className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <h1 className="text-xl sm:text-2xl font-heading font-semibold text-heading">
              Mes projets
            </h1>
            <p className="font-body mt-3 mb-2 sm:mb-6">
              Gérez vos projets
            </p>
          </div>

          <Button
            onClick={() => setShowCreateModal(true)}
            variant="primary"
            size="proj"
            className="w-full sm:w-auto shrink-0"
          >
            + Créer un projet
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
            <h3 className="text-lg font-heading font-medium text-heading mb-1">
              Aucun projet
            </h3>
            <p className="text-sub font-body mb-4">
              Commencez par créer votre premier projet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user && (projects ?? []).map((project) => (
              <ProjectCard key={project.id} project={project} user={user} />
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

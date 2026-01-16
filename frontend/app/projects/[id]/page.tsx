"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Alert from "@/components/ui/Alert";
import { useProject, useDeleteProject } from "@/hooks/useProjects";
import { useTasks, useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import { useProfile } from "@/hooks/useAuth";
import TaskProject from "@/components/tasks/TaskProject";
import type { Task, TaskStatus } from "@/types";
import CreateTaskModal from "@/components/modals/CreateTask";
import EditTaskModal from "@/components/modals/EditTask";
import EditProjectModal from "@/components/modals/EditProject";
import { getProjectPermissions } from "@/lib/permissions";
import { ProjectMembers } from "@/components/projects/ProjectMembers";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [view, setView] = useState<"list" | "calendar">("list");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    project,
    isLoading: projectLoading,
    error: projectError,
  } = useProject(projectId);
  const {
    tasks,
    isLoading: tasksLoading,
    error: tasksError,
    refetch: refetchTasks,
  } = useTasks(projectId);
  const { deleteProject, isLoading: isDeleting } = useDeleteProject();
  const { updateTask } = useUpdateTask();
  const { deleteTask } = useDeleteTask();
  const { user } = useProfile();

  // Erreur combinée
  const loadError = projectError || tasksError;

  const isLoading = projectLoading || tasksLoading;

  // Permissions basées sur le rôle utilisateur
  const permissions = getProjectPermissions(project?.userRole);

  // Filtrer les tâches
  const filteredTasks = (tasks ?? []).filter((task) => {
    if (statusFilter !== "ALL" && task.status !== statusFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !task.title.toLowerCase().includes(query) &&
        !task.description?.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    return true;
  });

  const handleDeleteProject = async () => {
    setActionError(null);
    try {
      await deleteProject(projectId);
      router.push("/projects");
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Erreur lors de la suppression du projet"
      );
    }
  };

  const handleStatusChange = async (task: Task, newStatus: TaskStatus) => {
    setActionError(null);
    try {
      await updateTask(projectId, task.id, { status: newStatus });
      setSuccessMessage("Statut de la tâche mis à jour");
      refetchTasks();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Erreur lors de la mise à jour du statut"
      );
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setActionError(null);
    try {
      await deleteTask(projectId, taskId);
      setSuccessMessage("Tâche supprimée avec succès");
      refetchTasks();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Erreur lors de la suppression de la tâche"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-[#D3590B]"></span>
        </main>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Projet introuvable
          </h1>
          <p className="text-gray-500 mb-4">
            Ce projet n&apos;existe pas ou a été supprimé.
          </p>
          <Link href="/projects" className="text-[#D3590B] hover:underline">
            Retour aux projets
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Messages d'erreur et de succès */}
        {loadError && (
          <Alert type="error" message={loadError} className="mb-6" />
        )}

        {actionError && (
          <Alert
            type="error"
            message={actionError}
            onClose={() => setActionError(null)}
            className="mb-6"
          />
        )}

        {successMessage && (
          <Alert
            type="success"
            message={successMessage}
            autoDismiss={3000}
            onClose={() => setSuccessMessage(null)}
            className="mb-6"
          />
        )}

        {/* Bouton retour + En-tête */}
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/projects"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <div className="flex items-center gap-3 flex-1">
            <h1 className="text-xl font-bold text-gray-900">{project.name}</h1>
            {permissions.canEditProject && (
              <button
                onClick={() => setShowEditProjectModal(true)}
                className="text-sm text-gray-500 hover:text-[#D3590B] transition-colors"
              >
                Modifier
              </button>
            )}
            {permissions.canDeleteProject && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-sm text-red-500 hover:text-red-700 transition-colors"
              >
                Supprimer
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {permissions.canCreateTask && (
              <button
                onClick={() => setShowTaskModal(true)}
                className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Créer une tâche
              </button>
            )}
            <button className="px-4 py-2 bg-[#D3590B] text-white text-sm font-medium rounded-lg hover:bg-[#B84D0A] transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
              </svg>
              IA
            </button>
          </div>
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-gray-600 mb-6 ml-12">{project.description}</p>
        )}

        {user && <ProjectMembers project={project} user={user} />}

        {/* Section Tâches */}
        <div className="bg-white border border-gray-200 rounded-xl">
          {/* En-tête avec filtres */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">Tâches</h2>
                <p className="text-sm text-gray-500">Par ordre de priorité</p>
              </div>
              <div className="flex items-center gap-3">
                {/* Vue Liste/Calendrier */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setView("list")}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                      view === "list"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      />
                    </svg>
                    Liste
                  </button>
                  <button
                    onClick={() => setView("calendar")}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                      view === "calendar"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Calendrier
                  </button>
                </div>

                {/* Filtre par statut */}
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as TaskStatus | "ALL")
                  }
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D3590B] focus:border-transparent"
                >
                  <option value="ALL">Statut</option>
                  <option value="TODO">À faire</option>
                  <option value="IN_PROGRESS">En cours</option>
                  <option value="DONE">Terminée</option>
                </select>

                {/* Recherche */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher une tâche"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D3590B] focus:border-transparent w-48"
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des tâches */}
          <div className="divide-y divide-gray-100">
            {filteredTasks.length === 0 ? (
              <div className="p-12 text-center">
                <svg
                  className="w-12 h-12 mx-auto mb-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p className="text-gray-500">Aucune tâche</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <TaskProject
                  key={task.id}
                  task={task}
                  isExpanded={expandedTaskId === task.id}
                  onToggle={() =>
                    setExpandedTaskId(
                      expandedTaskId === task.id ? null : task.id
                    )
                  }
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteTask}
                  onEdit={() => setSelectedTask(task)}
                  userRole={project?.userRole}
                  userId={user?.id}
                />
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Modales */}
      {showTaskModal && (
        <CreateTaskModal
          projectId={projectId}
          onClose={() => setShowTaskModal(false)}
        />
      )}

      {selectedTask && (
        <EditTaskModal
          task={selectedTask}
          projectId={projectId}
          onClose={() => setSelectedTask(null)}
        />
      )}

      {showEditProjectModal && (
        <EditProjectModal
          project={project}
          onClose={() => setShowEditProjectModal(false)}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Supprimer le projet
            </h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est
              irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteProject}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                {isDeleting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

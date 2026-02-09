/**
 * Page de détail d'un projet
 * 
 * Affiche les informations d'un projet et sa liste de tâches.
 * Permet la gestion des tâches (création, édition, suppression)
 * et du projet lui-même selon les permissions de l'utilisateur.
 */
"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Image from "next/image";
import Footer from "@/components/layout/Footer";
import Alert from "@/components/ui/Alert";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";
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
import SearchInput from "@/components/ui/SearchInput";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  // États de l'interface
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  
  // États des messages
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Récupération des données
  const { project, isLoading: projectLoading, error: projectError, refetch: refetchProject } = useProject(projectId);
  const { tasks, isLoading: tasksLoading, error: tasksError, refetch: refetchTasks } = useTasks(projectId);
  const { deleteProject, isLoading: isDeleting } = useDeleteProject();
  const { updateTask } = useUpdateTask();
  const { deleteTask } = useDeleteTask();
  const { user } = useProfile();

  // États dérivés
  const isLoading = projectLoading || tasksLoading;
  const loadError = projectError || tasksError;
  const permissions = getProjectPermissions(project?.userRole);

  /**
   * Filtre et trie les tâches par date d'échéance
   * Les tâches sans date apparaissent en dernier
   */
  const filteredTasks = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return (tasks ?? [])
      .filter((task) => statusFilter === "ALL" || task.status === statusFilter)
      .filter((task) => {
        if (!query) return true;
        return (
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
  }, [tasks, statusFilter, searchQuery]);

  /** Supprime le projet et redirige vers la liste */
  const handleDeleteProject = async () => {
    setActionError(null);
    try {
      await deleteProject(projectId);
      router.push("/projects");
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Erreur lors de la suppression du projet");
    }
  };

  /** Met à jour le statut d'une tâche */
  const handleStatusChange = async (task: Task, newStatus: TaskStatus) => {
    setActionError(null);
    try {
      await updateTask(projectId, task.id, { status: newStatus });
      setSuccessMessage("Statut de la tâche mis à jour");
      refetchTasks();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Erreur lors de la mise à jour du statut");
    }
  };

  /** Supprime une tâche */
  const handleDeleteTask = async (taskId: string) => {
    setActionError(null);
    try {
      await deleteTask(projectId, taskId);
      setSuccessMessage("Tâche supprimée avec succès");
      refetchTasks();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Erreur lors de la suppression de la tâche");
    }
  };

  // État de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Spinner size="lg" label="Chargement du projet" />
        </main>
        <Footer />
      </div>
    );
  }

  // Projet non trouvé
  if (!project) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-heading font-bold text-heading mb-2">Projet introuvable</h1>
          <p className="text-sub font-body mb-4">Ce projet n&apos;existe pas ou a été supprimé.</p>
          <Link href="/projects" className="text-primary font-body hover:underline">
            Retour aux projets
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main id="main-content" className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Messages de feedback */}
        {loadError && <Alert type="error" message={loadError} className="mb-6" />}
        {actionError && (
          <Alert type="error" message={actionError} onClose={() => setActionError(null)} className="mb-6" />
        )}
        {successMessage && (
          <Alert type="success" message={successMessage} autoDismiss={3000} onClose={() => setSuccessMessage(null)} className="mb-6" />
        )}

        {/* En-tête du projet */}
        <div className="flex items-start gap-4 mb-8">
          {/* Bouton retour */}
          <Link href="/projects" className="group shrink-0 p-2 hover:bg-background rounded-full transition-colors">
            <Image src="/back.png" alt="Retour à la liste des projets" width={50} height={50} className="group-focus-visible:hidden" />
            <Image src="/back-focus.png" alt="" width={50} height={50} className="hidden group-focus-visible:block" aria-hidden="true" />
          </Link>

          {/* Titre, actions et description */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-heading font-semibold text-heading">{project.name}</h1>
              {permissions.canEditProject && (
                <Link href="" className="text-sm text-primary underline font-body" onClick={() => setShowEditProjectModal(true)}>
                  Modifier
                </Link>
              )}
              {permissions.canDeleteProject && (
                <Link href="" className="text-sm text-red-500 font-body" onClick={() => setShowDeleteConfirm(true)}>
                  Supprimer
                </Link>
              )}
            </div>

            {/* Description du projet */}
            {project.description && (
              <p className="text-base font-body text-sub mt-2">{project.description}</p>
            )}
          </div>

          {/* Bouton création tâche */}
          {permissions.canCreateTask && (
            <Button onClick={() => setShowTaskModal(true)} variant="primary" size="proj" className="shrink-0">
              Créer une tâche
            </Button>
          )}
        </div>

        {/* Membres du projet */}
        {user && <ProjectMembers project={project} user={user} />}

        {/* Section des tâches */}
        <div className="bg-white border border-primary-grey rounded-xl">
          {/* En-tête avec filtre */}
          <div className="p-6 border-b border-primary-grey">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading font-semibold text-heading">Tâches</h2>
                <p className="text-sm font-body text-sub">Par date d&apos;échéance</p>
              </div>

              <div className="flex items-center gap-3">
                {/* Filtre par statut */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as TaskStatus | "ALL")}
                  className="form-input-search h-10"
                >
                  <option value="ALL">Statut</option>
                  <option value="TODO">À faire</option>
                  <option value="IN_PROGRESS">En cours</option>
                  <option value="DONE">Terminée</option>
                </select>

                {/* Recherche */}
                <SearchInput
                  inputId="project-task-search"
                  label="Rechercher une tâche"
                  placeholder="Rechercher une tâche"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 h-10"
                />
              </div>
            </div>
          </div>

          {/* Liste des tâches */}
          <div className="divide-y divide-primary-grey">
            {filteredTasks.length === 0 ? (
              <div className="p-12 text-center">
                <svg className="w-12 h-12 mx-auto mb-4 text-primary-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="font-body text-sub">Aucune tâche</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <TaskProject
                  key={task.id}
                  task={task}
                  projectId={projectId}
                  isExpanded={expandedTaskId === task.id}
                  onToggle={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteTask}
                  onEdit={() => setSelectedTask(task)}
                  onCommentAdded={refetchTasks}
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
        <CreateTaskModal projectId={projectId} onClose={() => setShowTaskModal(false)} onSuccess={refetchTasks} />
      )}
      {selectedTask && (
        <EditTaskModal task={selectedTask} projectId={projectId} onClose={() => setSelectedTask(null)} onSuccess={refetchTasks} />
      )}
      {showEditProjectModal && (
        <EditProjectModal project={project} onClose={() => setShowEditProjectModal(false)} onSuccess={refetchProject} />
      )}

      {/* Modale de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-heading font-bold text-heading mb-2">Supprimer le projet</h3>
            <p className="font-body text-sub mb-6">
              Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <Button onClick={() => setShowDeleteConfirm(false)} variant="outline" className="flex-1">
                Annuler
              </Button>
              <Button onClick={handleDeleteProject} disabled={isDeleting} variant="danger" className="flex-1">
                {isDeleting ? "Suppression..." : "Supprimer"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

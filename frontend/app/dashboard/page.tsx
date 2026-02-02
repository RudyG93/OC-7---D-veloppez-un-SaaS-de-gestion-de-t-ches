'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Alert from '@/components/ui/Alert';
import TaskList from '@/components/dashboard/ViewList';
import KanbanBoard from '@/components/dashboard/ViewKanban';
import { useProfile } from '@/hooks/useAuth';
import { useAssignedTasks, useProjectsWithTasks } from '@/hooks/useDashboard';
import { Task } from '@/types';
import CreateProjectModal from '@/components/modals/CreateProject';

type ViewType = 'list' | 'kanban' | 'projects';

export default function DashboardPage() {
    const router = useRouter();
    const [view, setView] = useState<ViewType>('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);

    const { user } = useProfile();
    const { tasks: assignedTasks, isLoading: tasksLoading, error: tasksError } = useAssignedTasks();
    const { isLoading: projectsLoading, error: projectsError } =
        useProjectsWithTasks();

    // Erreur combinée
    const error = tasksError || projectsError;

    // Trier les tâches par priorité (urgentes d'abord) puis par date
    const sortedTasks = useMemo(() => {
        const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
        return [...(assignedTasks ?? [])].sort((a, b) => {
            // D'abord par priorité
            const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
            if (priorityDiff !== 0) return priorityDiff;

            // Ensuite par date d'échéance
            if (a.dueDate && b.dueDate) {
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            }
            if (a.dueDate) return -1;
            if (b.dueDate) return 1;
            return 0;
        });
    }, [assignedTasks]);

    // Filtrer les tâches selon la recherche
    const filteredTasks = useMemo(() => {
        if (!searchQuery) return sortedTasks;
        const query = searchQuery.toLowerCase();
        return sortedTasks.filter(
            (task) =>
                task.title.toLowerCase().includes(query) ||
                task.description?.toLowerCase().includes(query) ||
                task.project?.name.toLowerCase().includes(query)
        );
    }, [sortedTasks, searchQuery]);

    const handleTaskClick = (task: Task) => {
        // Navigation vers la page du projet (la tâche sera visible dans le détail du projet)
        router.push(`/projects/${task.projectId}`);
    };

    const isLoading = tasksLoading || projectsLoading;

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* En-tête du dashboard */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
                        <p className="text-gray-500 mt-1">
                            Bonjour {user?.name || 'Utilisateur'}, voici un aperçu de vos
                            projets et tâches
                        </p>
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
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
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Créer un projet
                    </button>
                </div>

                {/* Message d'erreur */}
                {error && (
                    <Alert
                        type="error"
                        message={error}
                        className="mb-6"
                    />
                )}

                {/* Tabs de vue */}
                <div className="flex items-center gap-2 mb-6">
                    <button
                        onClick={() => setView('list')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            view === 'list'
                                ? 'bg-orange-100 text-[#E65C00]'
                                : 'text-gray-600 hover:bg-gray-100'
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
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                        Liste
                    </button>

                    <button
                        onClick={() => setView('kanban')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            view === 'kanban'
                                ? 'bg-orange-100 text-[#E65C00]'
                                : 'text-gray-600 hover:bg-gray-100'
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
                        Kanban
                    </button>
                </div>

                {/* Contenu selon la vue */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="spinner spinner-lg"></div>
                    </div>
                ) : (
                    <>
                        {view === 'list' && (
                            <TaskList
                                tasks={filteredTasks}
                                title="Mes tâches assignées"
                                subtitle="Par ordre de priorité"
                                onTaskClick={handleTaskClick}
                                emptyMessage="Aucune tâche assignée"
                                showSearch
                                searchValue={searchQuery}
                                onSearchChange={setSearchQuery}
                            />
                        )}

                        {view === 'kanban' && (
                            <div>
                                <div className="mb-4">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Mes tâches
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Vue Kanban par statut
                                    </p>
                                </div>

                                <KanbanBoard tasks={sortedTasks} onTaskClick={handleTaskClick} />
                            </div>
                        )}
                    </>
                )}
            </main>

            <Footer />

            {/* Modale de création de projet */}
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

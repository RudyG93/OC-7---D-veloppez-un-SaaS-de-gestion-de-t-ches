/**
 * Page du tableau de bord
 * 
 * Affiche les tâches assignées à l'utilisateur connecté.
 * Propose deux vues : liste et kanban.
 * Permet de filtrer les tâches par recherche textuelle.
 */
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Alert from '@/components/ui/Alert';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import { PlusIcon } from '@/components/ui/Icons';
import TaskList from '@/components/dashboard/ViewList';
import KanbanBoard from '@/components/dashboard/ViewKanban';
import { useProfile } from '@/hooks/useAuth';
import { useAssignedTasks } from '@/hooks/useDashboard';
import { Task } from '@/types';
import CreateProjectModal from '@/components/modals/CreateProject';

/** Types de vue disponibles */
type ViewType = 'list' | 'kanban';

export default function DashboardPage() {
    const router = useRouter();
    const [view, setView] = useState<ViewType>('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);

    const { user } = useProfile();
    const { tasks: assignedTasks, isLoading, error } = useAssignedTasks();

    /**
     * Trie les tâches par date d'échéance
     * Les tâches avec date apparaissent en premier
     */
    const sortedTasks = useMemo(() => {
        return [...(assignedTasks ?? [])].sort((a, b) => {
            if (a.dueDate && b.dueDate) {
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            }
            if (a.dueDate) return -1;
            if (b.dueDate) return 1;
            return 0;
        });
    }, [assignedTasks]);

    /**
     * Filtre les tâches selon la recherche textuelle
     * Recherche dans le titre, la description et le nom du projet
     */
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

    /** Redirige vers la page du projet lors du clic sur une tâche */
    const handleTaskClick = (task: Task) => {
        router.push(`/projects/${task.projectId}`);
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main id="main-content" className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* En-tête du dashboard */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
                        <p className="text-gray-500 mt-1">
                            Bonjour {user?.name || 'Utilisateur'}, voici un aperçu de vos
                            projets et tâches
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
                {error && (
                    <Alert
                        type="error"
                        message={error}
                        className="mb-6"
                    />
                )}

                {/* Tabs de vue */}
                <div className="flex items-center gap-2 mb-6">
                    <Button
                        onClick={() => setView('list')}
                        variant="ghost"
                        rounded
                        className={view === 'list' ? 'bg-primary-light text-accent hover:bg-primary-light' : ''}
                        leftIcon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        }
                    >
                        Liste
                    </Button>

                    <Button
                        onClick={() => setView('kanban')}
                        variant="ghost"
                        rounded
                        className={view === 'kanban' ? 'bg-primary-light text-accent hover:bg-primary-light' : ''}
                        leftIcon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        }
                    >
                        Kanban
                    </Button>
                </div>

                {/* Contenu selon la vue */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Spinner size="lg" label="Chargement des tâches" />
                    </div>
                ) : (
                    <>
                        {view === 'list' && (
                            <TaskList
                                tasks={filteredTasks}
                                title="Mes tâches assignées"
                                subtitle="Par date d'échéance"
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

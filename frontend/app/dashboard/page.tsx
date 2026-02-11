/**
 * Page du tableau de bord
 * 
 * Affiche les tâches assignées à l'utilisateur connecté.
 * Propose deux vues : liste et kanban.
 * Permet de filtrer les tâches par recherche textuelle.
 */
'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Alert from '@/components/ui/Alert';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
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
    const handleTaskClick = useCallback((task: Task) => {
        router.push(`/projects/${task.projectId}`);
    }, [router]);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main id="main-content" className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* En-tête du dashboard */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-heading font-semibold">Tableau de bord</h1>
                        <p className="font-body mt-3 mb-2 sm:mb-6">
                            Bonjour {user?.name || 'Utilisateur'}, voici un aperçu de vos
                            projets et tâches
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
                {error && (
                    <Alert
                        type="error"
                        message={error}
                        className="mb-6"
                    />
                )}

                {/* Tabs de vue */}
                <div className="flex items-center gap-2 mx-0 sm:mx-6">
                    <button
                        onClick={() => setView('list')}
                        aria-pressed={view === 'list'}
                        className={`rounded-lg cursor-pointer`}
                    >
                        <Image
                            src={view === 'list' ? '/btn-focus-list.png' : '/btn-list.png'}
                            alt="Vue liste"
                            width={94}
                            height={45}
                        />
                    </button>

                    <button
                        onClick={() => setView('kanban')}
                        aria-pressed={view === 'kanban'}
                        className={`rounded-lg cursor-pointer`}
                    >
                        <Image
                            src={view === 'kanban' ? '/btn-focus-kanban.png' : '/btn-kanban.png'}
                            alt="Vue kanban"
                            width={111}
                            height={45}
                        />
                    </button>
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
                            <div className='mt-10'>
                                <KanbanBoard tasks={filteredTasks} onTaskClick={handleTaskClick} />
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

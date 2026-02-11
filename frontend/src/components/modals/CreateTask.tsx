/**
 * Modale de création de tâche
 *
 * Utilise le composant TaskForm partagé pour le formulaire.
 *
 * @module components/modals/CreateTask
 */

'use client';

import Modal from '@/components/ui/Modal';
import TaskForm, { type TaskFormData } from './TaskForm';
import { useCreateTask } from '@/hooks/useTasks';

// ============================================================================
// Types
// ============================================================================

interface CreateTaskModalProps {
    /** ID du projet dans lequel créer la tâche */
    projectId: string;
    /** Callback de fermeture */
    onClose: () => void;
    /** Callback de succès */
    onSuccess?: () => void;
}

// ============================================================================
// Composant
// ============================================================================

export default function CreateTaskModal({ projectId, onClose, onSuccess }: CreateTaskModalProps) {
    const { createTask, isLoading: isCreating } = useCreateTask();

    /** Soumet le formulaire de création */
    const handleSubmit = async (data: TaskFormData) => {
        await createTask(projectId, {
            title: data.title,
            description: data.description || undefined,
            dueDate: new Date(data.dueDate).toISOString(),
            status: data.status,
            assigneeIds: data.assignees.length > 0 ? data.assignees.map((u) => u.id) : undefined,
        });
        onSuccess?.();
        onClose();
    };

    return (
        <Modal title="Créer une tâche" onClose={onClose}>
            <TaskForm
                idPrefix="task"
                onSubmit={handleSubmit}
                submitLabel="+ Ajouter une tâche"
                loadingLabel="Création..."
                isLoading={isCreating}
            />
        </Modal>
    );
}

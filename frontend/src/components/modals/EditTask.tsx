/**
 * Modale d'édition de tâche
 *
 * Utilise le composant TaskForm partagé pour le formulaire.
 *
 * @module components/modals/EditTask
 */

'use client';

import Modal from '@/components/ui/Modal';
import TaskForm, { type TaskFormData } from './TaskForm';
import { useUpdateTask } from '@/hooks/useTasks';
import type { Task } from '@/types';

// ============================================================================
// Types
// ============================================================================

interface EditTaskModalProps {
    /** Tâche à modifier */
    task: Task;
    /** ID du projet contenant la tâche */
    projectId: string;
    /** Callback de fermeture */
    onClose: () => void;
    /** Callback de succès */
    onSuccess?: () => void;
}

// ============================================================================
// Composant
// ============================================================================

export default function EditTaskModal({ task, projectId, onClose, onSuccess }: EditTaskModalProps) {
    const { updateTask, isLoading: isUpdating } = useUpdateTask();

    /** Soumet le formulaire de modification */
    const handleSubmit = async (data: TaskFormData) => {
        await updateTask(projectId, task.id, {
            title: data.title,
            description: data.description || undefined,
            dueDate: new Date(data.dueDate).toISOString(),
            status: data.status,
            assigneeIds: data.assignees.map((u) => u.id),
        });
        onSuccess?.();
        onClose();
    };

    return (
        <Modal title="Modifier la tâche" onClose={onClose}>
            <TaskForm
                idPrefix="edit-task"
                initialValues={{
                    title: task.title,
                    description: task.description || '',
                    dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
                    status: task.status,
                    assignees: task.assignees?.map((a) => a.user) || [],
                }}
                onSubmit={handleSubmit}
                submitLabel="Enregistrer"
                loadingLabel="Enregistrement..."
                isLoading={isUpdating}
            />
        </Modal>
    );
}

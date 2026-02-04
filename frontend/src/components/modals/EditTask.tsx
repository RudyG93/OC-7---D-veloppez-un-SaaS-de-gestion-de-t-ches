/**
 * Modale d'édition de tâche
 *
 * Permet de modifier une tâche existante :
 * - Titre (requis)
 * - Description (optionnelle)
 * - Échéance (optionnelle)
 * - Assignés (optionnel, recherche d'utilisateurs)
 * - Statut
 *
 * @module components/modals/EditTask
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import Alert from '@/components/ui/Alert';
import { AssigneeDropdown } from '@/components/ui/AssigneeDropdown';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useUpdateTask } from '@/hooks/useTasks';
import { STATUS_CONFIG, DisplayableStatus } from '@/lib/taskConstants';
import type { Task, TaskStatus, User } from '@/types';

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
    // État du formulaire (pré-rempli avec les valeurs existantes)
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || '');
    const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split('T')[0] : '');
    const [status, setStatus] = useState<TaskStatus>(task.status);
    const [error, setError] = useState('');
    const [selectedAssignees, setSelectedAssignees] = useState<User[]>(
        task.assignees?.map((a) => a.user) || []
    );

    const { updateTask, isLoading: isUpdating } = useUpdateTask();
    const firstInputRef = useRef<HTMLInputElement>(null);

    // Focus sur le premier input à l'ouverture
    useEffect(() => {
        firstInputRef.current?.focus();
    }, []);

    // ========================================================================
    // Handlers
    // ========================================================================

    /** Soumet le formulaire */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Le titre est requis');
            return;
        }
        if (!description.trim()) {
            setError('La description est requise');
            return;
        }
        if (!dueDate) {
            setError("L'échéance est requise");
            return;
        }

        try {
            const formattedDueDate = new Date(dueDate).toISOString();

            await updateTask(projectId, task.id, {
                title: title.trim(),
                description: description.trim() || undefined,
                dueDate: formattedDueDate,
                status,
                assigneeIds: selectedAssignees.map((u) => u.id),
            });

            onSuccess?.();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la modification');
        }
    };

    // ========================================================================
    // Rendu
    // ========================================================================

    return (
        <Modal title="Modifier la tâche" onClose={onClose}>
            {error && (
                <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Titre */}
                <div>
                    <label htmlFor="edit-task-title" className="block text-sm font-medium text-gray-700 mb-1">
                        Titre<span className="text-red-500" aria-hidden="true">*</span>
                        <span className="sr-only">(requis)</span>
                    </label>
                    <input
                        ref={firstInputRef}
                        id="edit-task-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="edit-task-description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description<span className="text-red-500" aria-hidden="true">*</span>
                        <span className="sr-only">(requis)</span>
                    </label>
                    <textarea
                        id="edit-task-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        required
                        className="form-input form-textarea"
                    />
                </div>

                {/* Échéance */}
                <div>
                    <label htmlFor="edit-task-due-date" className="block text-sm font-medium text-gray-700 mb-1">
                        Échéance<span className="text-red-500" aria-hidden="true">*</span>
                        <span className="sr-only">(requis)</span>
                    </label>
                    <input
                        id="edit-task-due-date"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>

                {/* Assignés */}
                <AssigneeDropdown
                    selectedAssignees={selectedAssignees}
                    onAssigneesChange={setSelectedAssignees}
                />

                {/* Statut */}
                <fieldset>
                    <legend className="block text-sm font-medium text-gray-700 mb-2">Statut :</legend>
                    <div className="flex gap-2">
                        {(Object.keys(STATUS_CONFIG) as DisplayableStatus[]).map((statusKey) => {
                            const config = STATUS_CONFIG[statusKey];
                            const isActive = status === statusKey;
                            return (
                                <button
                                    key={statusKey}
                                    type="button"
                                    role="radio"
                                    aria-checked={isActive}
                                    onClick={() => setStatus(statusKey)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${config.ring} ${
                                        isActive ? config.activeClass : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    }`}
                                >
                                    {config.label}
                                </button>
                            );
                        })}
                    </div>
                </fieldset>

                {/* Bouton de soumission */}
                <div className="pt-4">
                    <Button type="submit" variant="primary" fullWidth isLoading={isUpdating}>
                        {isUpdating ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

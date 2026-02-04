/**
 * Modale de création de tâche
 *
 * Permet de créer une nouvelle tâche avec :
 * - Titre (requis)
 * - Description (optionnelle)
 * - Échéance (optionnelle)
 * - Assignés (optionnel, recherche d'utilisateurs)
 * - Statut (TODO par défaut)
 *
 * @module components/modals/CreateTask
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import Alert from '@/components/ui/Alert';
import { AssigneeDropdown } from '@/components/ui/AssigneeDropdown';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useCreateTask } from '@/hooks/useTasks';
import { STATUS_CONFIG, DisplayableStatus } from '@/lib/taskConstants';
import type { TaskStatus, User } from '@/types';

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
    // État du formulaire
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState<TaskStatus>('TODO');
    const [error, setError] = useState('');
    const [selectedAssignees, setSelectedAssignees] = useState<User[]>([]);

    const { createTask, isLoading: isCreating } = useCreateTask();
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

            await createTask(projectId, {
                title: title.trim(),
                description: description.trim() || undefined,
                dueDate: formattedDueDate,
                status,
                assigneeIds: selectedAssignees.length > 0 ? selectedAssignees.map((u) => u.id) : undefined,
            });

            onSuccess?.();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la création');
        }
    };

    // ========================================================================
    // Rendu
    // ========================================================================

    return (
        <Modal title="Créer une tâche" onClose={onClose}>
            {error && (
                <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Titre */}
                <div>
                    <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-1">
                        Titre<span className="text-red-500" aria-hidden="true">*</span>
                        <span className="sr-only">(requis)</span>
                    </label>
                    <input
                        ref={firstInputRef}
                        id="task-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description<span className="text-red-500" aria-hidden="true">*</span>
                        <span className="sr-only">(requis)</span>
                    </label>
                    <textarea
                        id="task-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        required
                        className="form-input form-textarea"
                    />
                </div>

                {/* Échéance */}
                <div>
                    <label htmlFor="task-due-date" className="block text-sm font-medium text-gray-700 mb-1">
                        Échéance<span className="text-red-500" aria-hidden="true">*</span>
                        <span className="sr-only">(requis)</span>
                    </label>
                    <input
                        id="task-due-date"
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
                    <Button type="submit" variant="primary" fullWidth isLoading={isCreating}>
                        {isCreating ? 'Création...' : '+ Ajouter une tâche'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

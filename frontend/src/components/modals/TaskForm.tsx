/**
 * Formulaire de tâche partagé
 *
 * Composant réutilisable pour la création et l'édition de tâches.
 * Gère les champs communs : titre, description, échéance, assignés, statut.
 *
 * @module components/modals/TaskForm
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import Alert from '@/components/ui/Alert';
import { AssigneeDropdown } from '@/components/ui/AssigneeDropdown';
import Button from '@/components/ui/Button';
import { STATUS_CONFIG, DisplayableStatus } from '@/lib/taskConstants';
import type { TaskStatus, User } from '@/types';

// ============================================================================
// Types
// ============================================================================

/** Données du formulaire de tâche */
export interface TaskFormData {
    title: string;
    description: string;
    dueDate: string;
    status: TaskStatus;
    assignees: User[];
}

interface TaskFormProps {
    /** Préfixe d'ID pour les champs (accessibilité) */
    idPrefix: string;
    /** Valeurs initiales du formulaire */
    initialValues?: Partial<TaskFormData>;
    /** Handler de soumission */
    onSubmit: (data: TaskFormData) => Promise<void>;
    /** Texte du bouton de soumission */
    submitLabel: string;
    /** Texte pendant le chargement */
    loadingLabel: string;
    /** Si le formulaire est en cours de soumission */
    isLoading: boolean;
}

// ============================================================================
// Composant
// ============================================================================

/**
 * Formulaire partagé entre création et édition de tâche
 * Gère la validation, les champs et la sélection de statut
 */
export default function TaskForm({
    idPrefix,
    initialValues,
    onSubmit,
    submitLabel,
    loadingLabel,
    isLoading,
}: TaskFormProps) {
    const [title, setTitle] = useState(initialValues?.title || '');
    const [description, setDescription] = useState(initialValues?.description || '');
    const [dueDate, setDueDate] = useState(initialValues?.dueDate || '');
    const [status, setStatus] = useState<TaskStatus>(initialValues?.status || 'TODO');
    const [selectedAssignees, setSelectedAssignees] = useState<User[]>(initialValues?.assignees || []);
    const [error, setError] = useState('');

    const firstInputRef = useRef<HTMLInputElement>(null);

    // Focus sur le premier input à l'ouverture
    useEffect(() => {
        firstInputRef.current?.focus();
    }, []);

    // ========================================================================
    // Handlers
    // ========================================================================

    /** Soumet le formulaire avec validation */
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
            await onSubmit({
                title: title.trim(),
                description: description.trim(),
                dueDate,
                status,
                assignees: selectedAssignees,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        }
    };

    // ========================================================================
    // Rendu
    // ========================================================================

    return (
        <>
            {error && (
                <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Titre */}
                <div>
                    <label htmlFor={`${idPrefix}-title`} className="block text-sm font-medium text-gray-700 mb-1">
                        Titre<span className="text-red-500" aria-hidden="true">*</span>
                        <span className="sr-only">(requis)</span>
                    </label>
                    <input
                        ref={firstInputRef}
                        id={`${idPrefix}-title`}
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>

                {/* Description */}
                <div>
                    <label htmlFor={`${idPrefix}-description`} className="block text-sm font-medium text-gray-700 mb-1">
                        Description<span className="text-red-500" aria-hidden="true">*</span>
                        <span className="sr-only">(requis)</span>
                    </label>
                    <textarea
                        id={`${idPrefix}-description`}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        required
                        className="form-input form-textarea"
                    />
                </div>

                {/* Échéance */}
                <div>
                    <label htmlFor={`${idPrefix}-due-date`} className="block text-sm font-medium text-gray-700 mb-1">
                        Échéance<span className="text-red-500" aria-hidden="true">*</span>
                        <span className="sr-only">(requis)</span>
                    </label>
                    <input
                        id={`${idPrefix}-due-date`}
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
                    <div className="flex gap-2" role="radiogroup" aria-label="Statut de la tâche">
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
                    <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
                        {isLoading ? loadingLabel : submitLabel}
                    </Button>
                </div>
            </form>
        </>
    );
}

/**
 * Modale de création de projet
 *
 * Permet de créer un nouveau projet avec :
 * - Titre (requis)
 * - Description (optionnelle)
 * - Contributeurs par recherche de nom/prénom avec autocomplétion
 *
 * Utilise le composant AssigneeDropdown partagé pour la sélection
 * de contributeurs, garantissant une UX cohérente avec les formulaires de tâche.
 *
 * @module components/modals/CreateProject
 */

'use client';

import { useState } from 'react';
import Alert from '@/components/ui/Alert';
import { AssigneeDropdown } from '@/components/ui/AssigneeDropdown';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useCreateProject } from '@/hooks/useProjects';
import type { User } from '@/types';

// ============================================================================
// Types
// ============================================================================

interface CreateProjectModalProps {
    /** Callback de fermeture */
    onClose: () => void;
    /** Callback de succès avec l'ID du projet créé */
    onSuccess?: (projectId: string) => void;
}

// ============================================================================
// Composant
// ============================================================================

export default function CreateProjectModal({
    onClose,
    onSuccess,
}: CreateProjectModalProps) {
    // État du formulaire
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedContributors, setSelectedContributors] = useState<User[]>([]);
    const [error, setError] = useState('');

    const { createProject, isLoading: isCreating } = useCreateProject();

    // ========================================================================
    // Handlers
    // ========================================================================

    /** Soumet le formulaire de création */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Le titre est requis');
            return;
        }

        try {
            const contributorEmails = selectedContributors.map((c) => c.email);
            const newProject = await createProject({
                name: title.trim(),
                description: description.trim() || undefined,
                contributors: contributorEmails.length > 0 ? contributorEmails : undefined,
            });

            if (newProject?.id && onSuccess) {
                onSuccess(newProject.id);
            }
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la création');
        }
    };

    // ========================================================================
    // Rendu
    // ========================================================================

    return (
        <Modal title="Créer un projet" onClose={onClose}>
            {error && (
                <Alert
                    type="error"
                    message={error}
                    onClose={() => setError('')}
                    className="mb-4"
                />
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Titre */}
                <div>
                    <label htmlFor="project-title" className="block text-sm font-medium text-gray-700 mb-1">
                        Titre<span className="text-red-500" aria-hidden="true">*</span>
                        <span className="sr-only">(requis)</span>
                    </label>
                    <input
                        id="project-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        aria-required="true"
                        className="form-input"
                        autoFocus
                    />
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="project-description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <input
                        id="project-description"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="form-input"
                    />
                </div>

                {/* Contributeurs */}
                <AssigneeDropdown
                    selectedAssignees={selectedContributors}
                    onAssigneesChange={setSelectedContributors}
                    label="Contributeurs"
                    placeholder="Choisir un ou plusieurs collaborateurs"
                    searchPlaceholder="Rechercher par nom ou prénom..."
                />

                {/* Bouton de soumission */}
                <div className="pt-4">
                    <Button type="submit" variant="secondary" isLoading={isCreating}>
                        {isCreating ? 'Création...' : 'Ajouter un projet'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

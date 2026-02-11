/**
 * Modale d'édition de projet
 *
 * Permet de modifier un projet existant :
 * - Titre (requis)
 * - Description (optionnelle)
 * - Gestion des contributeurs (via ContributorManager)
 *
 * @module components/modals/EditProject
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ContributorManager from './ContributorManager';
import { useUpdateProject } from '@/hooks/useProjects';
import type { Project } from '@/types';

// ============================================================================
// Types
// ============================================================================

interface EditProjectModalProps {
    /** Projet à modifier */
    project: Project;
    /** Callback de fermeture */
    onClose: () => void;
    /** Callback de succès (appelé après chaque modification) */
    onSuccess?: () => void;
}

// ============================================================================
// Composant
// ============================================================================

export default function EditProjectModal({ project, onClose, onSuccess }: EditProjectModalProps) {
    // État du formulaire
    const [title, setTitle] = useState(project.name);
    const [description, setDescription] = useState(project.description || '');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // État pour la section contributeurs
    const [showContributors, setShowContributors] = useState(false);

    // Hook API
    const { updateProject, isLoading: isUpdating } = useUpdateProject();

    // ========================================================================
    // Handlers
    // ========================================================================

    /** Soumet la mise à jour du projet */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!title.trim()) {
            setError('Le titre est requis');
            return;
        }

        try {
            await updateProject(project.id, {
                name: title.trim(),
                description: description.trim() || undefined,
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
        <Modal title="Modifier un projet" onClose={onClose} maxWidth="lg">
            {/* Messages globaux */}
            {error && (
                <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />
            )}
            {successMessage && (
                <Alert
                    type="success"
                    message={successMessage}
                    autoDismiss={3000}
                    onClose={() => setSuccessMessage('')}
                    className="mb-4"
                />
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Titre */}
                <div>
                    <label htmlFor="edit-project-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Titre<span className="text-red-500" aria-hidden="true">*</span>
                        <span className="sr-only">(requis)</span>
                    </label>
                    <input
                        id="edit-project-name"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="form-input"
                        autoFocus
                    />
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="edit-project-description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        id="edit-project-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="form-input form-textarea"
                    />
                </div>

                {/* Section Contributeurs */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contributeurs
                    </label>
                    <button
                        type="button"
                        onClick={() => setShowContributors(!showContributors)}
                        aria-expanded={showContributors}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white hover:bg-gray-50"
                    >
                        <span className="text-gray-700">
                            {project.members && project.members.length > 0
                                ? `${project.members.length} contributeur${project.members.length > 1 ? 's' : ''}`
                                : 'Aucun contributeur'}
                        </span>
                        <Image
                            src="/dropdown.png"
                            alt=""
                            width={16}
                            height={16}
                            aria-hidden="true"
                            className={`transition-transform ${showContributors ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {/* Panneau des contributeurs */}
                    {showContributors && (
                        <ContributorManager
                            project={project}
                            onSuccess={onSuccess}
                            onMessage={setSuccessMessage}
                        />
                    )}
                </div>

                {/* Boutons de soumission */}
                <div className="pt-4 flex gap-3">
                    <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                        Annuler
                    </Button>
                    <Button type="submit" variant="primary" isLoading={isUpdating} className="flex-1">
                        {isUpdating ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

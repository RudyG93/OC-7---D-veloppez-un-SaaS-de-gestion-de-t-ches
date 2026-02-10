/**
 * Modale de création de projet
 *
 * Permet de créer un nouveau projet avec :
 * - Titre (requis)
 * - Description (optionnelle)
 * - Contributeurs par email (optionnel)
 *
 * @module components/modals/CreateProject
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useCreateProject } from '@/hooks/useProjects';

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
    const [contributorEmail, setContributorEmail] = useState('');
    const [contributors, setContributors] = useState<string[]>([]);
    const [showContributorDropdown, setShowContributorDropdown] = useState(false);
    const [error, setError] = useState('');

    const { createProject, isLoading: isCreating } = useCreateProject();

    // ========================================================================
    // Handlers
    // ========================================================================

    /** Ajoute un contributeur à la liste */
    const handleAddContributor = () => {
        if (contributorEmail && !contributors.includes(contributorEmail)) {
            setContributors([...contributors, contributorEmail]);
            setContributorEmail('');
        }
        setShowContributorDropdown(false);
    };

    /** Retire un contributeur de la liste */
    const handleRemoveContributor = (email: string) => {
        setContributors(contributors.filter((c) => c !== email));
    };

    /** Soumet le formulaire de création */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Le titre est requis');
            return;
        }

        try {
            const newProject = await createProject({
                name: title.trim(),
                description: description.trim() || undefined,
                contributors: contributors.length > 0 ? contributors : undefined,
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
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contributeurs
                    </label>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowContributorDropdown(!showContributorDropdown)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gray-200"
                        >
                            <span className="text-gray-500">
                                {contributors.length > 0
                                    ? `${contributors.length} collaborateur${contributors.length > 1 ? 's' : ''}`
                                    : 'Choisir un ou plusieurs collaborateurs'}
                            </span>
                            <Image
                                src="/dropdown.png"
                                alt=""
                                width={16}
                                height={16}
                                aria-hidden="true"
                            />
                        </button>

                        {showContributorDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-3">
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="email"
                                        value={contributorEmail}
                                        onChange={(e) => setContributorEmail(e.target.value)}
                                        placeholder="Email du collaborateur"
                                        className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddContributor}
                                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
                                    >
                                        Ajouter
                                    </button>
                                </div>

                                {contributors.length > 0 && (
                                    <div className="space-y-1">
                                        {contributors.map((email) => (
                                            <div
                                                key={email}
                                                className="flex items-center justify-between px-2 py-1 bg-gray-50 rounded text-sm"
                                            >
                                                <span className="text-gray-700">{email}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveContributor(email)}
                                                    className="text-gray-400 hover:text-red-500"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

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

/**
 * Modale de création de projet
 *
 * Permet de créer un nouveau projet avec :
 * - Titre (requis)
 * - Description (optionnelle)
 * - Contributeurs par recherche de nom/prénom avec autocomplétion
 *
 * @module components/modals/CreateProject
 */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useCreateProject } from '@/hooks/useProjects';
import { useSearchUsers } from '@/hooks/useUsers';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useDebounce } from '@/hooks/useDebounce';
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
    const [contributorSearch, setContributorSearch] = useState('');
    const [selectedContributors, setSelectedContributors] = useState<User[]>([]);
    const [dropdownDismissed, setDropdownDismissed] = useState(false);
    const [showContributorSection, setShowContributorSection] = useState(false);
    const [error, setError] = useState('');

    const dropdownRef = useRef<HTMLDivElement>(null);
    const { createProject, isLoading: isCreating } = useCreateProject();
    const { searchUsers, users: searchResults, isLoading: isSearching } = useSearchUsers();

    // Click-outside pour fermer le dropdown
    const closeDropdown = useCallback(() => setDropdownDismissed(true), []);
    useClickOutside(dropdownRef, closeDropdown);

    // Debounce de la recherche
    const debouncedSearch = useDebounce(contributorSearch, 300);

    useEffect(() => {
        if (debouncedSearch.length >= 2) {
            searchUsers(debouncedSearch);
        }
    }, [debouncedSearch, searchUsers]);

    // Afficher le dropdown seulement si recherche active et non fermé
    const showUserDropdown = debouncedSearch.length >= 2 && !dropdownDismissed;

    // Filtrer les utilisateurs déjà sélectionnés
    const filteredResults = searchResults.filter(
        (user) => !selectedContributors.some((c) => c.id === user.id)
    );

    // ========================================================================
    // Handlers
    // ========================================================================

    /** Sélectionne un utilisateur dans le dropdown */
    const handleSelectUser = (user: User) => {
        setSelectedContributors([...selectedContributors, user]);
        setContributorSearch('');
        setDropdownDismissed(true);
    };

    /** Retire un contributeur de la liste */
    const handleRemoveContributor = (userId: string) => {
        setSelectedContributors(selectedContributors.filter((c) => c.id !== userId));
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
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contributeurs
                    </label>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowContributorSection(!showContributorSection)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gray-200"
                        >
                            <span className="text-gray-500">
                                {selectedContributors.length > 0
                                    ? `${selectedContributors.length} collaborateur${selectedContributors.length > 1 ? 's' : ''}`
                                    : 'Choisir un ou plusieurs collaborateurs'}
                            </span>
                            <Image
                                src="/dropdown.png"
                                alt=""
                                width={16}
                                height={16}
                                aria-hidden="true"
                                style={{ width: 'auto', height: 'auto' }}
                            />
                        </button>

                        {showContributorSection && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-3">
                                {/* Champ de recherche avec autocomplétion */}
                                <div className="relative" ref={dropdownRef}>
                                    <input
                                        type="text"
                                        value={contributorSearch}
                                        onChange={(e) => {
                                            setContributorSearch(e.target.value);
                                            setDropdownDismissed(false);
                                        }}
                                        placeholder="Rechercher par nom ou prénom..."
                                        aria-label="Rechercher un contributeur"
                                        className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                                        autoFocus
                                    />

                                    {/* Dropdown autocomplétion */}
                                    {showUserDropdown && (
                                        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                            {isSearching ? (
                                                <div className="p-3 text-center text-gray-500 text-sm">Recherche en cours...</div>
                                            ) : filteredResults.length === 0 ? (
                                                <div className="p-3 text-center text-gray-500 text-sm">Aucun utilisateur trouvé</div>
                                            ) : (
                                                <div className="py-1">
                                                    {filteredResults.map((user) => (
                                                        <button
                                                            key={user.id}
                                                            type="button"
                                                            onClick={() => handleSelectUser(user)}
                                                            className="w-full px-3 py-2 flex items-center gap-3 hover:bg-gray-50 text-left"
                                                        >
                                                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                                                                {(user.name || user.email).charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-gray-900 truncate">{user.name || 'Sans nom'}</p>
                                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Liste des contributeurs sélectionnés */}
                                {selectedContributors.length > 0 && (
                                    <div className="space-y-1 mt-2">
                                        {selectedContributors.map((user) => (
                                            <div
                                                key={user.id}
                                                className="flex items-center justify-between px-2 py-1 bg-gray-50 rounded text-sm"
                                            >
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium shrink-0">
                                                        {(user.name || user.email).charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-gray-700 truncate">{user.name || user.email}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveContributor(user.id)}
                                                    aria-label={`Retirer ${user.name || user.email}`}
                                                    className="text-gray-400 hover:text-red-500 shrink-0"
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

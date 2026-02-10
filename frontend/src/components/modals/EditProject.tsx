/**
 * Modale d'édition de projet
 *
 * Permet de modifier un projet existant :
 * - Titre (requis)
 * - Description (optionnelle)
 * - Gestion des contributeurs (ajout/suppression)
 *
 * @module components/modals/EditProject
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Alert from '@/components/ui/Alert';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useUpdateProject, useAddContributor, useRemoveContributor } from '@/hooks/useProjects';
import { getDisplayName } from '@/lib/utils';
import { useSearchUsers } from '@/hooks/useUsers';
import { getRoleLabel } from '@/lib/permissions';
import type { Project, ProjectMember, User } from '@/types';

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

    // État pour la gestion des contributeurs
    const [showContributors, setShowContributors] = useState(false);
    const [contributorSearch, setContributorSearch] = useState('');
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [contributorError, setContributorError] = useState('');

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Hooks API
    const { updateProject, isLoading: isUpdating } = useUpdateProject();
    const { addContributor, isLoading: isAdding } = useAddContributor();
    const { removeContributor, isLoading: isRemoving } = useRemoveContributor();
    const { searchUsers, users: searchResults, isLoading: isSearching } = useSearchUsers();

    // ========================================================================
    // Effets
    // ========================================================================

    // Recherche d'utilisateurs avec debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (contributorSearch.length >= 2) {
                searchUsers(contributorSearch);
                setShowUserDropdown(true);
            } else {
                setShowUserDropdown(false);
            }
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [contributorSearch, searchUsers]);

    // Fermer le dropdown au clic extérieur
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowUserDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filtrer les utilisateurs déjà membres
    const filteredResults = searchResults.filter((user) => {
        if (user.id === project.ownerId) return false;
        if (project.members?.some((m) => m.userId === user.id)) return false;
        return true;
    });

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
            onClose(); // Fermer la modale après le succès
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la modification');
        }
    };

    /** Sélectionne un utilisateur dans le dropdown */
    const handleSelectUser = (user: User) => {
        setSelectedUser(user);
        setContributorSearch(user.name || user.email);
        setShowUserDropdown(false);
    };

    /** Ajoute le contributeur sélectionné */
    const handleAddContributor = async () => {
        if (!selectedUser) {
            setContributorError('Veuillez sélectionner un utilisateur');
            return;
        }

        setContributorError('');
        try {
            await addContributor(project.id, {
                email: selectedUser.email,
                role: 'CONTRIBUTOR',
            });
            setContributorSearch('');
            setSelectedUser(null);
            setSuccessMessage('Contributeur ajouté avec succès');
            onSuccess?.();
        } catch (err) {
            setContributorError(err instanceof Error ? err.message : "Erreur lors de l'ajout");
        }
    };

    /** Supprime un contributeur */
    const handleRemoveContributor = async (member: ProjectMember) => {
        setContributorError('');
        try {
            await removeContributor(project.id, member.userId);
            setSuccessMessage('Contributeur supprimé avec succès');
            onSuccess?.();
        } catch (err) {
            setContributorError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
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
                        <div className="mt-3 border border-gray-200 rounded-lg p-4 space-y-4">
                            {contributorError && (
                                <Alert type="error" message={contributorError} onClose={() => setContributorError('')} />
                            )}

                            {/* Administrateur (Owner) */}
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Avatar name={project.owner.name} email={project.owner.email} size="md" variant="orange" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{project.owner.name || project.owner.email}</p>
                                        <p className="text-xs text-gray-500">{project.owner.email}</p>
                                    </div>
                                </div>
                                <span className="px-2 py-1 bg-primary-light text-primary text-xs font-medium rounded">
                                    Administrateur
                                </span>
                            </div>

                            {/* Liste des membres */}
                            {project.members && project.members.length > 0 && (
                                <div className="space-y-2">
                                    {project.members.map((member) => (
                                        <div key={member.id} className="flex items-center justify-between p-2 bg-white border border-gray-100 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Avatar name={member.user.name} email={member.user.email} size="md" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{getDisplayName(member.user.name, member.user.email)}</p>
                                                    <p className="text-xs text-gray-500">{member.user.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                                                    {getRoleLabel(member.role)}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveContributor(member)}
                                                    disabled={isRemoving}
                                                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded disabled:opacity-50"
                                                    title="Supprimer ce contributeur"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Ajouter un contributeur */}
                            <div className="pt-3 border-t border-gray-200">
                                <p className="text-sm font-medium text-gray-700 mb-2">Ajouter un contributeur</p>
                                <div className="relative" ref={dropdownRef}>
                                    <input
                                        type="text"
                                        value={contributorSearch}
                                        onChange={(e) => {
                                            setContributorSearch(e.target.value);
                                            setSelectedUser(null);
                                        }}
                                        placeholder="Rechercher par nom ou prénom..."
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                                    />

                                    {/* Dropdown autocomplete */}
                                    {showUserDropdown && (
                                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
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
                                                            <Avatar name={user.name} email={user.email} size="md" />
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">{user.name || user.email}</p>
                                                                {user.name && <p className="text-xs text-gray-500">{user.email}</p>}
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    fullWidth
                                    onClick={handleAddContributor}
                                    disabled={isAdding || !selectedUser}
                                    className="mt-2"
                                >
                                    {isAdding ? 'Ajout en cours...' : '+ Ajouter'}
                                </Button>
                            </div>
                        </div>
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

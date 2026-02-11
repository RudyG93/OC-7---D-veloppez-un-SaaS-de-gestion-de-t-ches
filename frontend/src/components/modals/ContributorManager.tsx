/**
 * Gestionnaire de contributeurs
 *
 * Composant extrait de EditProject pour gérer :
 * - Affichage du propriétaire et des membres
 * - Ajout de contributeurs via recherche
 * - Suppression de contributeurs
 *
 * @module components/modals/ContributorManager
 */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Alert from '@/components/ui/Alert';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { useAddContributor, useRemoveContributor } from '@/hooks/useProjects';
import { useSearchUsers } from '@/hooks/useUsers';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useDebounce } from '@/hooks/useDebounce';
import { getDisplayName } from '@/lib/utils';
import { getRoleLabel } from '@/lib/permissions';
import type { Project, ProjectMember, User } from '@/types';

// ============================================================================
// Types
// ============================================================================

interface ContributorManagerProps {
    /** Projet contenant les contributeurs */
    project: Project;
    /** Callback de succès (refetch du projet) */
    onSuccess?: () => void;
    /** Callback pour afficher un message dans le parent */
    onMessage?: (message: string) => void;
}

// ============================================================================
// Composant
// ============================================================================

/**
 * Panneau de gestion des contributeurs d'un projet
 * Permet d'ajouter et supprimer des contributeurs avec recherche
 */
export default function ContributorManager({
    project,
    onSuccess,
    onMessage,
}: ContributorManagerProps) {
    const [contributorSearch, setContributorSearch] = useState('');
    const [dropdownDismissed, setDropdownDismissed] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [contributorError, setContributorError] = useState('');

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Hooks API
    const { addContributor, isLoading: isAdding } = useAddContributor();
    const { removeContributor, isLoading: isRemoving } = useRemoveContributor();
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

    // Dériver l'affichage du dropdown à partir des données
    const showUserDropdown = debouncedSearch.length >= 2 && !dropdownDismissed;

    // Filtrer les utilisateurs déjà membres
    const filteredResults = searchResults.filter((user) => {
        if (user.id === project.ownerId) return false;
        if (project.members?.some((m) => m.userId === user.id)) return false;
        return true;
    });

    // ========================================================================
    // Handlers
    // ========================================================================

    /** Sélectionne un utilisateur dans le dropdown */
    const handleSelectUser = (user: User) => {
        setSelectedUser(user);
        setContributorSearch(user.name || user.email);
        setDropdownDismissed(true);
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
            onMessage?.('Contributeur ajouté avec succès');
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
            onMessage?.('Contributeur supprimé avec succès');
            onSuccess?.();
        } catch (err) {
            setContributorError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
        }
    };

    // ========================================================================
    // Rendu
    // ========================================================================

    return (
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
                                    aria-label={`Supprimer ${getDisplayName(member.user.name, member.user.email)}`}
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
                            setDropdownDismissed(false);
                        }}
                        placeholder="Rechercher par nom ou prénom..."
                        aria-label="Rechercher un contributeur"
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
    );
}

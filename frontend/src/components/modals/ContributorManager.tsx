/**
 * Gestionnaire de contributeurs
 *
 * Composant extrait de EditProject pour gérer :
 * - Affichage du propriétaire et des membres
 * - Ajout de contributeurs via recherche (AssigneeDropdown)
 * - Suppression de contributeurs
 *
 * Utilise le composant AssigneeDropdown partagé pour la recherche
 * d'utilisateurs, garantissant une UX cohérente avec les autres formulaires.
 *
 * @module components/modals/ContributorManager
 */

'use client';

import { useState } from 'react';
import Alert from '@/components/ui/Alert';
import { AssigneeDropdown } from '@/components/ui/AssigneeDropdown';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { useAddContributor, useRemoveContributor } from '@/hooks/useProjects';
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
    // L'utilisateur sélectionné dans le dropdown (avant confirmation d'ajout)
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [contributorError, setContributorError] = useState('');

    // Hooks API
    const { addContributor, isLoading: isAdding } = useAddContributor();
    const { removeContributor, isLoading: isRemoving } = useRemoveContributor();

    // IDs à exclure : le propriétaire + les membres déjà ajoutés
    const excludeUserIds = [
        project.ownerId,
        ...(project.members?.map((m) => m.userId) ?? []),
    ];

    // ========================================================================
    // Handlers
    // ========================================================================

    /** Ajoute le contributeur sélectionné */
    const handleAddContributor = async () => {
        if (selectedUsers.length === 0) {
            setContributorError('Veuillez sélectionner un utilisateur');
            return;
        }

        setContributorError('');
        try {
            // Ajouter chaque utilisateur sélectionné
            await Promise.all(
                selectedUsers.map((user) =>
                    addContributor(project.id, {
                        email: user.email,
                        role: 'CONTRIBUTOR',
                    })
                )
            );
            setSelectedUsers([]);
            onMessage?.(
                selectedUsers.length === 1
                    ? 'Contributeur ajouté avec succès'
                    : `${selectedUsers.length} contributeurs ajoutés avec succès`
            );
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
                <AssigneeDropdown
                    selectedAssignees={selectedUsers}
                    onAssigneesChange={setSelectedUsers}
                    label="Ajouter un contributeur"
                    placeholder="Sélectionner un ou plusieurs utilisateurs"
                    searchPlaceholder="Rechercher par nom ou prénom..."
                    excludeUserIds={excludeUserIds}
                />
                <Button
                    type="button"
                    variant="secondary"
                    fullWidth
                    onClick={handleAddContributor}
                    disabled={isAdding || selectedUsers.length === 0}
                    className="mt-2"
                >
                    {isAdding ? 'Ajout en cours...' : '+ Ajouter'}
                </Button>
            </div>
        </div>
    );
}

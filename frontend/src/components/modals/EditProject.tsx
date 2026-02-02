'use client';

import { useState, useEffect, useRef } from 'react';
import Alert from '@/components/ui/Alert';
import { useUpdateProject, useAddContributor, useRemoveContributor } from '@/hooks/useProjects';
import { useSearchUsers } from '@/hooks/useUsers';
import type { Project, ProjectMember, User } from '@/types';
import { getRoleLabel } from '@/lib/permissions';

interface EditProjectModalProps {
    project: Project;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function EditProjectModal({ project, onClose, onSuccess }: EditProjectModalProps) {
    const [title, setTitle] = useState(project.name);
    const [description, setDescription] = useState(project.description || '');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Gestion des contributeurs
    const [showContributors, setShowContributors] = useState(false);
    const [contributorSearch, setContributorSearch] = useState('');
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [contributorError, setContributorError] = useState('');

    const dropdownRef = useRef<HTMLDivElement>(null);

    const { updateProject, isLoading: isUpdating } = useUpdateProject();
    const { addContributor, isLoading: isAdding } = useAddContributor();
    const { removeContributor, isLoading: isRemoving } = useRemoveContributor();
    const { searchUsers, users: searchResults, isLoading: isSearching } = useSearchUsers();

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

    // Fermer le dropdown si on clique en dehors
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowUserDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filtrer les utilisateurs déjà membres du projet
    const filteredResults = searchResults.filter((user) => {
        // Exclure le propriétaire
        if (user.id === project.ownerId) return false;
        // Exclure les membres existants
        if (project.members?.some((m) => m.userId === user.id)) return false;
        return true;
    });

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

            setSuccessMessage('Projet mis à jour avec succès');
            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la modification');
        }
    };

    const handleSelectUser = (user: User) => {
        setSelectedUser(user);
        setContributorSearch(user.name || user.email);
        setShowUserDropdown(false);
    };

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
            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            setContributorError(err instanceof Error ? err.message : "Erreur lors de l'ajout");
        }
    };

    const handleRemoveContributor = async (member: ProjectMember) => {
        setContributorError('');
        try {
            await removeContributor(project.id, member.userId);
            setSuccessMessage('Contributeur supprimé avec succès');
            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            setContributorError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
        }
    };

    const getInitials = (name: string | null, email: string) => {
        if (name) {
            const parts = name.split(' ');
            if (parts.length >= 2) {
                return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
            }
            return name.substring(0, 2).toUpperCase();
        }
        return email.substring(0, 2).toUpperCase();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Modifier un projet</h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Messages */}
                {error && (
                    <Alert
                        type="error"
                        message={error}
                        onClose={() => setError('')}
                        className="mb-4"
                    />
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Titre<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Nom du projet"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
                            autoFocus
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description du projet"
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Contributeurs */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contributeurs
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowContributors(!showContributors)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white hover:bg-gray-50 transition-colors"
                        >
                            <span className="text-gray-700">
                                {project.members && project.members.length > 0
                                    ? `${project.members.length} contributeur${project.members.length > 1 ? 's' : ''}`
                                    : 'Aucun contributeur'}
                            </span>
                            <svg
                                className={`w-4 h-4 text-gray-400 transition-transform ${showContributors ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Liste des contributeurs */}
                        {showContributors && (
                            <div className="mt-3 border border-gray-200 rounded-lg p-4 space-y-4">
                                {/* Erreur contributeur */}
                                {contributorError && (
                                    <Alert
                                        type="error"
                                        message={contributorError}
                                        onClose={() => setContributorError('')}
                                    />
                                )}

                                {/* Administrateur (Owner) */}
                                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#D3590B] flex items-center justify-center text-xs font-medium text-white">
                                            {getInitials(project.owner.name, project.owner.email)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {project.owner.name || project.owner.email}
                                            </p>
                                            <p className="text-xs text-gray-500">{project.owner.email}</p>
                                        </div>
                                    </div>
                                    <span className="px-2 py-1 bg-[#FFE8D9] text-[#D3590B] text-xs font-medium rounded">
                                        Administrateur
                                    </span>
                                </div>

                                {/* Liste des membres */}
                                {project.members && project.members.length > 0 && (
                                    <div className="space-y-2">
                                        {project.members.map((member) => (
                                            <div
                                                key={member.id}
                                                className="flex items-center justify-between p-2 bg-white border border-gray-100 rounded-lg"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
                                                        {getInitials(member.user.name, member.user.email)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {member.user.name || member.user.email}
                                                        </p>
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
                                                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
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
                                                    <div className="p-3 text-center text-gray-500 text-sm">
                                                        Recherche en cours...
                                                    </div>
                                                ) : filteredResults.length === 0 ? (
                                                    <div className="p-3 text-center text-gray-500 text-sm">
                                                        Aucun utilisateur trouvé
                                                    </div>
                                                ) : (
                                                    <div className="py-1">
                                                        {filteredResults.map((user) => (
                                                            <button
                                                                key={user.id}
                                                                type="button"
                                                                onClick={() => handleSelectUser(user)}
                                                                className="w-full px-3 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                                                            >
                                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
                                                                    {getInitials(user.name, user.email)}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        {user.name || user.email}
                                                                    </p>
                                                                    {user.name && (
                                                                        <p className="text-xs text-gray-500">{user.email}</p>
                                                                    )}
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleAddContributor}
                                        disabled={isAdding || !selectedUser}
                                        className="mt-2 w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isAdding ? 'Ajout en cours...' : '+ Ajouter'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Boutons */}
                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="flex-1 px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                        >
                            {isUpdating ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

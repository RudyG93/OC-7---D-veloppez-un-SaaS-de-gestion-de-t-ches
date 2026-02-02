'use client';

import { useState, useEffect, useCallback } from 'react';
import Alert from '@/components/ui/Alert';
import { useUpdateTask } from '@/hooks/useTasks';
import { searchUsersApi } from '@/api/users';
import type { Task, TaskStatus, User } from '@/types';

interface EditTaskModalProps {
    task: Task;
    projectId: string;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function EditTaskModal({ task, projectId, onClose, onSuccess }: EditTaskModalProps) {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || '');
    const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split('T')[0] : '');
    const [status, setStatus] = useState<TaskStatus>(task.status);
    const [selectedAssignees, setSelectedAssignees] = useState<User[]>(
        task.assignees?.map((a) => a.user) || []
    );
    const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
    const [assigneeSearch, setAssigneeSearch] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState('');

    const { updateTask, isLoading: isUpdating } = useUpdateTask();

    // Rechercher des utilisateurs via l'API
    const searchUsers = useCallback(async (query: string) => {
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await searchUsersApi(query);
            // Filtrer les utilisateurs déjà sélectionnés
            const filteredUsers = (response.data?.users || []).filter(
                (user) => !selectedAssignees.some((a) => a.id === user.id)
            );
            setSearchResults(filteredUsers);
        } catch (err) {
            console.error('Erreur de recherche:', err);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, [selectedAssignees]);

    // Debounce la recherche
    useEffect(() => {
        const timer = setTimeout(() => {
            if (assigneeSearch) {
                searchUsers(assigneeSearch);
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [assigneeSearch, searchUsers]);

    const handleAddAssignee = (user: User) => {
        setSelectedAssignees((prev) => [...prev, user]);
        setAssigneeSearch('');
        setSearchResults([]);
    };

    const handleRemoveAssignee = (userId: string) => {
        setSelectedAssignees((prev) => prev.filter((u) => u.id !== userId));
    };

    const getSelectedAssigneesDisplay = () => {
        if (selectedAssignees.length === 0) {
            return 'Choisir un ou plusieurs collaborateurs';
        }
        return selectedAssignees.map((u) => u.name || u.email).join(', ');
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Le titre est requis');
            return;
        }

        try {
            // Convertir la date au format ISO si elle est définie
            let formattedDueDate: string | null | undefined = undefined;
            if (dueDate) {
                const date = new Date(dueDate);
                formattedDueDate = date.toISOString();
            } else if (dueDate === '') {
                formattedDueDate = null; // Supprimer la date
            }

            await updateTask(projectId, task.id, {
                title: title.trim(),
                description: description.trim() || undefined,
                dueDate: formattedDueDate,
                status,
                assigneeIds: selectedAssignees.map((u) => u.id),
            });

            if (onSuccess) {
                onSuccess();
            }
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la modification');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Modifier</h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Titre
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
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
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Échéance */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Échéance
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Assigné à */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Assigné à :
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                        >
                            <span className={selectedAssignees.length > 0 ? 'text-gray-900 truncate' : 'text-gray-500'}>
                                {getSelectedAssigneesDisplay()}
                            </span>
                            <svg
                                className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${showAssigneeDropdown ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown des assignés */}
                        {showAssigneeDropdown && (
                            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                                {/* Recherche */}
                                <div className="p-2 border-b border-gray-100">
                                    <input
                                        type="text"
                                        placeholder="Rechercher par nom ou email..."
                                        value={assigneeSearch}
                                        onChange={(e) => setAssigneeSearch(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                                        autoFocus
                                    />
                                </div>

                                {/* Assignés sélectionnés */}
                                {selectedAssignees.length > 0 && (
                                    <div className="p-2 border-b border-gray-100">
                                        <p className="text-xs text-gray-500 mb-2">Sélectionnés :</p>
                                        <div className="flex flex-wrap gap-1">
                                            {selectedAssignees.map((user) => (
                                                <span
                                                    key={user.id}
                                                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs"
                                                >
                                                    {user.name || user.email}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveAssignee(user.id)}
                                                        className="text-gray-400 hover:text-red-500"
                                                    >
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Résultats de recherche */}
                                <div className="max-h-40 overflow-y-auto">
                                    {isSearching ? (
                                        <div className="p-4 text-center text-gray-500 text-sm">
                                            Recherche...
                                        </div>
                                    ) : searchResults.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500 text-sm">
                                            {assigneeSearch.length < 2
                                                ? 'Tapez au moins 2 caractères'
                                                : 'Aucun résultat'}
                                        </div>
                                    ) : (
                                        <div className="py-1">
                                            {searchResults.map((user) => (
                                                <button
                                                    key={user.id}
                                                    type="button"
                                                    onClick={() => handleAddAssignee(user)}
                                                    className="w-full px-3 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
                                                        {getInitials(user.name, user.email)}
                                                    </div>
                                                    <div className="text-left">
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
                            </div>
                        )}
                    </div>

                    {/* Statut */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Statut :
                        </label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setStatus('TODO')}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                    status === 'TODO'
                                        ? 'bg-red-100 text-red-600'
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                            >
                                À faire
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatus('IN_PROGRESS')}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                    status === 'IN_PROGRESS'
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                            >
                                En cours
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatus('DONE')}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                    status === 'DONE'
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                            >
                                Terminée
                            </button>
                        </div>
                    </div>

                    {/* Bouton */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="w-full px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                        >
                            {isUpdating ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

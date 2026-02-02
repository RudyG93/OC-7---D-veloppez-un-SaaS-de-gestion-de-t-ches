'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Alert from '@/components/ui/Alert';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { useCreateTask } from '@/hooks/useTasks';
import { searchUsersApi } from '@/api/users';
import type { TaskStatus, User } from '@/types';

interface CreateTaskModalProps {
    projectId: string;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function CreateTaskModal({ projectId, onClose, onSuccess }: CreateTaskModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState<TaskStatus>('TODO');
    const [selectedAssignees, setSelectedAssignees] = useState<User[]>([]);
    const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
    const [assigneeSearch, setAssigneeSearch] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState('');

    const { createTask, isLoading: isCreating } = useCreateTask();
    const modalRef = useRef<HTMLDivElement>(null);
    const firstInputRef = useRef<HTMLInputElement>(null);

    // Focus trap et gestion du clavier pour la modale
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        firstInputRef.current?.focus();

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Rechercher des utilisateurs via l'API
    const searchUsers = useCallback(async (query: string) => {
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await searchUsersApi(query);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Le titre est requis');
            return;
        }

        try {
            let formattedDueDate: string | undefined = undefined;
            if (dueDate) {
                const date = new Date(dueDate);
                formattedDueDate = date.toISOString();
            }

            await createTask(projectId, {
                title: title.trim(),
                description: description.trim() || undefined,
                dueDate: formattedDueDate,
                status,
                assigneeIds: selectedAssignees.length > 0 ? selectedAssignees.map((u) => u.id) : undefined,
            });
            if (onSuccess) {
                onSuccess();
            }
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la création');
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            role="presentation"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="create-task-title"
                className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 id="create-task-title" className="text-xl font-bold text-gray-900">
                        Créer une tâche
                    </h2>
                    <button
                        onClick={onClose}
                        aria-label="Fermer la modale"
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 rounded"
                    >
                        <svg className="w-5 h-5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-1">
                            Titre<span className="text-red-500" aria-hidden="true">*</span>
                            <span className="sr-only">(requis)</span>
                        </label>
                        <input
                            ref={firstInputRef}
                            id="task-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            aria-required="true"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E65C00] focus:border-transparent"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="task-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E65C00] focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Échéance */}
                    <div>
                        <label htmlFor="task-due-date" className="block text-sm font-medium text-gray-700 mb-1">
                            Échéance
                        </label>
                        <input
                            id="task-due-date"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E65C00] focus:border-transparent"
                        />
                    </div>

                    {/* Assigné à */}
                    <div className="relative">
                        <label id="assignee-label" className="block text-sm font-medium text-gray-700 mb-1">
                            Assigné à :
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
                            aria-expanded={showAssigneeDropdown}
                            aria-haspopup="listbox"
                            aria-labelledby="assignee-label"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#E65C00]"
                        >
                            <span className={selectedAssignees.length > 0 ? 'text-gray-900 truncate' : 'text-gray-500'}>
                                {getSelectedAssigneesDisplay()}
                            </span>
                            <svg
                                className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${showAssigneeDropdown ? 'rotate-180' : ''}`}
                                aria-hidden="true"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown des assignés */}
                        {showAssigneeDropdown && (
                            <div
                                role="listbox"
                                aria-label="Liste des collaborateurs"
                                className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg"
                            >
                                {/* Recherche */}
                                <div className="p-2 border-b border-gray-100">
                                    <label htmlFor="assignee-search" className="sr-only">
                                        Rechercher des collaborateurs
                                    </label>
                                    <input
                                        id="assignee-search"
                                        type="text"
                                        placeholder="Rechercher par nom ou email..."
                                        value={assigneeSearch}
                                        onChange={(e) => setAssigneeSearch(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E65C00]"
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
                                                        aria-label={`Retirer ${user.name || user.email}`}
                                                        className="text-gray-400 hover:text-red-500 focus:outline-none focus:text-red-500"
                                                    >
                                                        <svg className="w-3 h-3" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                        <div className="p-4 text-center text-gray-500 text-sm" role="status" aria-live="polite">
                                            Recherche...
                                        </div>
                                    ) : searchResults.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500 text-sm">
                                            {assigneeSearch.length < 2
                                                ? 'Tapez au moins 2 caractères'
                                                : 'Aucun résultat'}
                                        </div>
                                    ) : (
                                        <div role="group" aria-label="Résultats de recherche">
                                            {searchResults.map((user) => (
                                                <button
                                                    key={user.id}
                                                    type="button"
                                                    role="option"
                                                    aria-selected="false"
                                                    onClick={() => handleAddAssignee(user)}
                                                    className="w-full px-3 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-100"
                                                >
                                                    <Avatar name={user.name} email={user.email} size="md" />
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
                    <fieldset>
                        <legend className="block text-sm font-medium text-gray-700 mb-2">
                            Statut :
                        </legend>
                        <div className="flex gap-2" role="radiogroup" aria-label="Statut de la tâche">
                            <button
                                type="button"
                                role="radio"
                                aria-checked={status === 'TODO'}
                                onClick={() => setStatus('TODO')}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                                    status === 'TODO'
                                        ? 'bg-red-100 text-red-600'
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                            >
                                À faire
                            </button>
                            <button
                                type="button"
                                role="radio"
                                aria-checked={status === 'IN_PROGRESS'}
                                onClick={() => setStatus('IN_PROGRESS')}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${
                                    status === 'IN_PROGRESS'
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                            >
                                En cours
                            </button>
                            <button
                                type="button"
                                role="radio"
                                aria-checked={status === 'DONE'}
                                onClick={() => setStatus('DONE')}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                                    status === 'DONE'
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                            >
                                Terminée
                            </button>
                        </div>
                    </fieldset>

                    {/* Bouton */}
                    <div className="pt-4">
                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            isLoading={isCreating}
                        >
                            {isCreating ? 'Création...' : '+ Ajouter une tâche'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

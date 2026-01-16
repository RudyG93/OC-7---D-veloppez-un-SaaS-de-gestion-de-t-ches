'use client';

import { useState, useMemo } from 'react';
import Alert from '@/components/ui/Alert';
import { useUpdateTask } from '@/hooks/useTasks';
import type { Task, TaskStatus, Project, User, ProjectMember } from '@/types';

interface EditTaskModalProps {
    task: Task;
    projectId: string;
    project?: Project;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function EditTaskModal({ task, projectId, project, onClose, onSuccess }: EditTaskModalProps) {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || '');
    const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split('T')[0] : '');
    const [status, setStatus] = useState<TaskStatus>(task.status);
    const [selectedAssignees, setSelectedAssignees] = useState<string[]>(
        task.assignees?.map((a) => a.userId) || []
    );
    const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
    const [assigneeSearch, setAssigneeSearch] = useState('');
    const [error, setError] = useState('');

    const { updateTask, isLoading: isUpdating } = useUpdateTask();

    // Liste des membres du projet (owner + contributors)
    const projectMembers = useMemo(() => {
        if (!project) return [];

        const members: { id: string; user: User }[] = [];

        // Ajouter le propriétaire
        if (project.owner) {
            members.push({ id: project.owner.id, user: project.owner });
        }

        // Ajouter les contributeurs
        if (project.members) {
            project.members.forEach((member: ProjectMember) => {
                members.push({ id: member.userId, user: member.user });
            });
        }

        return members;
    }, [project]);

    // Filtrer les membres selon la recherche
    const filteredMembers = useMemo(() => {
        if (!assigneeSearch) return projectMembers;
        const query = assigneeSearch.toLowerCase();
        return projectMembers.filter(
            (member) =>
                member.user.name?.toLowerCase().includes(query) ||
                member.user.email.toLowerCase().includes(query)
        );
    }, [projectMembers, assigneeSearch]);

    const handleToggleAssignee = (userId: string) => {
        setSelectedAssignees((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const getSelectedAssigneesDisplay = () => {
        if (selectedAssignees.length === 0) {
            return 'Choisir un ou plusieurs collaborateurs';
        }
        const names = selectedAssignees
            .map((id) => {
                const member = projectMembers.find((m) => m.id === id);
                return member?.user.name || member?.user.email || '';
            })
            .filter(Boolean);
        return names.join(', ');
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
            await updateTask(projectId, task.id, {
                title: title.trim(),
                description: description.trim() || undefined,
                dueDate: dueDate || undefined,
                status,
                assigneeIds: selectedAssignees,
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
                            <span className={selectedAssignees.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
                                {getSelectedAssigneesDisplay()}
                            </span>
                            <svg
                                className={`w-4 h-4 text-gray-400 transition-transform ${showAssigneeDropdown ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown des assignés */}
                        {showAssigneeDropdown && (
                            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {/* Recherche */}
                                <div className="p-2 border-b border-gray-100">
                                    <input
                                        type="text"
                                        placeholder="Rechercher par nom..."
                                        value={assigneeSearch}
                                        onChange={(e) => setAssigneeSearch(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                                    />
                                </div>

                                {/* Liste des membres */}
                                {filteredMembers.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500 text-sm">
                                        {projectMembers.length === 0
                                            ? 'Aucun membre dans le projet'
                                            : 'Aucun résultat'}
                                    </div>
                                ) : (
                                    <div className="py-1">
                                        {filteredMembers.map((member) => (
                                            <button
                                                key={member.id}
                                                type="button"
                                                onClick={() => handleToggleAssignee(member.id)}
                                                className="w-full px-3 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                                            >
                                                <div
                                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                                        selectedAssignees.includes(member.id)
                                                            ? 'bg-[#D3590B] border-[#D3590B]'
                                                            : 'border-gray-300'
                                                    }`}
                                                >
                                                    {selectedAssignees.includes(member.id) && (
                                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
                                                    {getInitials(member.user.name, member.user.email)}
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {member.user.name || member.user.email}
                                                    </p>
                                                    {member.user.name && (
                                                        <p className="text-xs text-gray-500">{member.user.email}</p>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
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

'use client';

import { useState } from 'react';
import Alert from '@/components/ui/Alert';
import { useUpdateTask } from '@/hooks/useTasks';
import type { Task, TaskStatus } from '@/types';

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
    const [error, setError] = useState('');

    const { updateTask, isLoading: isUpdating } = useUpdateTask();

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
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
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
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Assigné à :
                        </label>
                        <div className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-left flex items-center justify-between bg-gray-50">
                            <span className="text-gray-500">
                                {task.assignees && task.assignees.length > 0
                                    ? `${task.assignees.length} collaborateur${task.assignees.length > 1 ? 's' : ''}`
                                    : 'Choisir un ou plusieurs collaborateurs'}
                            </span>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
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
                            className="px-6 py-2.5 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                        >
                            {isUpdating ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

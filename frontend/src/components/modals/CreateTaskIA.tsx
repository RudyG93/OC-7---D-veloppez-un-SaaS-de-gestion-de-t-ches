/**
 * Modale de création de tâches par IA
 *
 * Deux états :
 * 1. Prompt initial — l'utilisateur décrit les tâches souhaitées (avec échéance obligatoire)
 * 2. Liste des tâches générées — modifier, supprimer, puis ajouter au projet
 *
 * Utilise le backend Express via le wrapper src/api/ai.ts.
 */
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useCreateTask } from '@/hooks/useTasks';
import { generateTasksAI } from '@/api/ai';

// ============================================================================
// Types
// ============================================================================

/** Tâche générée par l'IA (locale, pas encore persistée) */
interface AIGeneratedTask {
    id: string;
    title: string;
    description: string;
    dueDate: string;
}

interface CreateTaskIAProps {
    projectId: string;
    onClose: () => void;
    onSuccess?: () => void;
}

/** Mots-clés qui indiquent que le prompt mentionne une échéance */
const DEADLINE_KEYWORDS = [
    'échéance', 'echeance', 'deadline', 'date', 'délai', 'delai',
    'avant le', 'pour le', 'fin', 'semaine', 'mois', 'jour',
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
    'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi',
];

// ============================================================================
// Composant
// ============================================================================

export default function CreateTaskIA({ projectId, onClose, onSuccess }: CreateTaskIAProps) {
    const [prompt, setPrompt] = useState('');
    const [tasks, setTasks] = useState<AIGeneratedTask[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { createTask } = useCreateTask();
    const inputRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Focus sur l'input à l'ouverture
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Fermer avec Escape
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // ========================================================================
    // Handlers
    // ========================================================================

    /** Génère les tâches à partir du prompt via l'API Groq */
    const handleGenerate = async () => {
        if (!prompt.trim() || isGenerating) return;

        // Vérifier que le prompt mentionne une échéance
        const lower = prompt.toLowerCase();
        const hasDeadline = DEADLINE_KEYWORDS.some(kw => lower.includes(kw));

        if (!hasDeadline) {
            setError('Veuillez préciser une échéance dans votre demande (ex: "pour la fin du mois", "avant le 15 mars"...)');
            return;
        }

        setIsGenerating(true);
        setError(null);

        try {
            const aiTasks = await generateTasksAI(prompt.trim());

            const generatedTasks: AIGeneratedTask[] = aiTasks.map(t => ({
                id: crypto.randomUUID(),
                title: t.title,
                description: t.description,
                dueDate: t.dueDate || '',
            }));

            setTasks(generatedTasks);
            setPrompt('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Impossible de contacter le serveur. Réessayez.');
            setError('Impossible de contacter le serveur. Réessayez.');
        } finally {
            setIsGenerating(false);
        }
    };

    /** Supprime une tâche de la liste */
    const handleDeleteTask = (taskId: string) => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
    };

    /** Modifie un champ d'une tâche */
    const handleEditField = (taskId: string, field: 'title' | 'description' | 'dueDate', value: string) => {
        setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, [field]: value } : t)));
    };

    /** Ajoute toutes les tâches au projet via l'API */
    const handleAddTasks = async () => {
        if (tasks.length === 0 || isAdding) return;
        setIsAdding(true);

        try {
            await Promise.all(
                tasks.map(task =>
                    createTask(projectId, {
                        title: task.title,
                        description: task.description || undefined,
                        dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : undefined,
                        status: 'TODO',
                    })
                )
            );
            onSuccess?.();
            onClose();
        } catch {
            // Erreur gérée par le hook
        } finally {
            setIsAdding(false);
        }
    };

    /** Fermer en cliquant sur l'overlay */
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    const hasTasks = tasks.length > 0;

    // ========================================================================
    // Rendu
    // ========================================================================

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            role="presentation"
            onClick={handleOverlayClick}
        >
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-ia-title"
                className="bg-white rounded-xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-4">
                    <h2 id="modal-ia-title" className="text-xl font-heading font-bold text-heading flex items-center gap-2">
                        <Image src="/ico-star-ia.png" alt="" width={20} height={20} />
                        {hasTasks ? 'Vos tâches...' : 'Créer une tâche'}
                    </h2>
                    <button
                        onClick={onClose}
                        aria-label="Fermer la modale"
                        className="p-1 text-sub hover:text-heading transition-colors rounded focus:outline-none focus:ring-2 focus:ring-primary-grey"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Contenu */}
                <div className="flex-1 overflow-y-auto px-6">
                    {/* Message d'erreur */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm font-body text-red-600">
                            {error}
                        </div>
                    )}

                    {hasTasks ? (
                        <div className="space-y-4">
                            {tasks.map(task => (
                                <div key={task.id} className="border border-primary-grey rounded-xl p-5">
                                    {editingTaskId === task.id ? (
                                        /* Mode édition */
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                value={task.title}
                                                onChange={e => handleEditField(task.id, 'title', e.target.value)}
                                                className="w-full font-heading font-semibold text-heading text-sm border-b border-primary-grey pb-1 focus:outline-none focus:border-accent"
                                            />
                                            <textarea
                                                value={task.description}
                                                onChange={e => handleEditField(task.id, 'description', e.target.value)}
                                                className="w-full font-body text-sub text-sm resize-none focus:outline-none"
                                                rows={2}
                                            />
                                            <div className="flex items-center gap-2">
                                                <label className="text-xs font-body text-sub">Échéance :</label>
                                                <input
                                                    type="date"
                                                    value={task.dueDate}
                                                    onChange={e => handleEditField(task.id, 'dueDate', e.target.value)}
                                                    className="font-body text-sm text-heading border border-primary-grey rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-accent"
                                                />
                                            </div>
                                            <button
                                                onClick={() => setEditingTaskId(null)}
                                                className="text-sm text-primary font-body font-medium hover:underline"
                                            >
                                                Valider
                                            </button>
                                        </div>
                                    ) : (
                                        /* Mode affichage */
                                        <>
                                            <p className="font-heading font-semibold text-heading text-sm">{task.title}</p>
                                            <p className="font-body text-sub text-sm mt-1">{task.description}</p>
                                            {task.dueDate && (
                                                <p className="font-body text-sub text-xs mt-2">
                                                    📅 {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-2 mt-4 text-sm font-body">
                                                <button
                                                    onClick={() => handleDeleteTask(task.id)}
                                                    className="flex items-center gap-1.5 text-sub hover:text-red-500 transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Supprimer
                                                </button>
                                                <span className="text-primary-grey">|</span>
                                                <button
                                                    onClick={() => setEditingTaskId(task.id)}
                                                    className="flex items-center gap-1.5 text-sub hover:text-heading transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                    Modifier
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}

                            {/* Bouton ajouter les tâches */}
                            <div className="flex justify-center pt-2 pb-2">
                                <button
                                    onClick={handleAddTasks}
                                    disabled={isAdding}
                                    className="bg-heading text-white font-heading font-medium text-sm px-8 py-3 rounded-full hover:bg-heading/90 transition-colors disabled:opacity-50"
                                >
                                    {isAdding ? 'Ajout en cours...' : '+ Ajouter les tâches'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* État vide — en attente du prompt */
                        <div className="min-h-75 flex items-center justify-center">
                            {isGenerating && (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
                                    <p className="font-body text-sub text-sm">Génération des tâches...</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Barre de prompt en bas */}
                <div className="p-6 pt-4">
                    <div className="flex items-center gap-3 border border-primary-grey rounded-full px-5 py-3">
                        <input
                            ref={inputRef}
                            type="text"
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                            placeholder="Décrivez vos tâches avec une échéance (ex: pour fin mars...)"
                            className="flex-1 font-body text-sm text-heading placeholder:text-sub focus:outline-none bg-transparent"
                            disabled={isGenerating}
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={!prompt.trim() || isGenerating}
                            aria-label="Générer les tâches"
                            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-accent transition-colors disabled:opacity-50 shrink-0"
                        >
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

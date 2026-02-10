/**
 * API de génération de tâches par IA
 *
 * Appelle le backend Express qui communique avec Groq (Llama 3).
 */

import { API_BASE_URL, authHeaders } from '@/lib/api';

/** Tâche retournée par l'IA */
export interface AIGeneratedTask {
    title: string;
    description: string;
    dueDate: string;
}

/** Réponse de l'API */
interface GenerateTasksResponse {
    success: boolean;
    message: string;
    data?: { tasks: AIGeneratedTask[] };
    error?: string;
}

/**
 * Génère des tâches à partir d'un prompt via l'IA
 *
 * @param prompt - Description des tâches souhaitées
 * @returns Liste de tâches générées (title, description, dueDate)
 * @throws Error avec le message d'erreur du backend
 */
export async function generateTasksAI(prompt: string): Promise<AIGeneratedTask[]> {
    const response = await fetch(`${API_BASE_URL}/ai/generate-tasks`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ prompt }),
    });

    const data: GenerateTasksResponse = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || 'Erreur lors de la génération');
    }

    return data.data?.tasks ?? [];
}

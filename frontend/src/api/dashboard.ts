/**
 * API du tableau de bord
 */

import { API_BASE_URL, authHeaders } from '@/lib/api';
import type { ApiResponse, TasksResponse } from '@/types';

/**
 * Récupère les tâches assignées à l'utilisateur connecté
 */
export async function getAssignedTasksApi(): Promise<ApiResponse<TasksResponse>> {
    const response = await fetch(`${API_BASE_URL}/dashboard/assigned-tasks`, {
        headers: authHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération des tâches');
    }
    return data;
}

/**
 * Types Dashboard
 */

/**
 * Statistiques du tableau de bord
 */
export interface DashboardStats {
    /** Statistiques des tâches */
    tasks: {
        /** Nombre total de tâches */
        total: number;
        /** Nombre de tâches urgentes */
        urgent: number;
        /** Nombre de tâches en retard */
        overdue: number;
        /** Répartition par statut */
        byStatus: {
            TODO: number;
            IN_PROGRESS: number;
            DONE: number;
            CANCELLED: number;
        };
    };
    /** Statistiques des projets */
    projects: {
        /** Nombre total de projets */
        total: number;
    };
}

/** Réponse pour les statistiques */
export interface StatsResponse {
    stats: DashboardStats;
}

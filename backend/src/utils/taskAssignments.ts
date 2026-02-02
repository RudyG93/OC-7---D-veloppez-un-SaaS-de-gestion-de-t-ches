import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Vérifie si les utilisateurs sont membres du projet (incluant le propriétaire)
 * @param projectId - ID du projet
 * @param userIds - IDs des utilisateurs à vérifier
 * @returns true si tous les utilisateurs sont membres ou propriétaire, false sinon
 */
export const validateProjectMembers = async (
  projectId: string,
  userIds: string[]
): Promise<boolean> => {
  if (userIds.length === 0) return true;

  // Récupérer le projet avec son propriétaire
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  });

  if (!project) return false;

  // Récupérer les membres du projet
  const projectMembers = await prisma.projectMember.findMany({
    where: {
      projectId,
      userId: { in: userIds },
    },
  });

  // Créer un Set avec tous les IDs valides (propriétaire + membres)
  const validUserIds = new Set<string>([project.ownerId]);
  projectMembers.forEach((member) => validUserIds.add(member.userId));

  // Vérifier que tous les userIds sont dans le Set des IDs valides
  return userIds.every((userId) => validUserIds.has(userId));
};

/**
 * Met à jour les assignations d'une tâche
 * @param taskId - ID de la tâche
 * @param assigneeIds - IDs des utilisateurs à assigner
 */
export const updateTaskAssignments = async (
  taskId: string,
  assigneeIds: string[]
): Promise<void> => {
  // Supprimer toutes les assignations existantes
  await prisma.taskAssignee.deleteMany({
    where: { taskId },
  });

  // Ajouter les nouvelles assignations
  if (assigneeIds.length > 0) {
    await prisma.taskAssignee.createMany({
      data: assigneeIds.map((userId) => ({
        taskId,
        userId,
      })),
    });
  }
};

/**
 * Récupère les assignations d'une tâche avec les détails des utilisateurs
 * @param taskId - ID de la tâche
 * @returns Les assignations avec les détails des utilisateurs
 */
export const getTaskAssignments = async (taskId: string) => {
  const assignees = await prisma.taskAssignee.findMany({
    where: { taskId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });

  return assignees.map((assignee) => ({
    id: assignee.id,
    assignedAt: assignee.assignedAt,
    user: assignee.user,
  }));
};

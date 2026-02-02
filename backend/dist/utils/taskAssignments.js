"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTaskAssignments = exports.updateTaskAssignments = exports.validateProjectMembers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const validateProjectMembers = async (projectId, userIds) => {
    if (userIds.length === 0)
        return true;
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { ownerId: true },
    });
    if (!project)
        return false;
    const projectMembers = await prisma.projectMember.findMany({
        where: {
            projectId,
            userId: { in: userIds },
        },
    });
    const validUserIds = new Set([project.ownerId]);
    projectMembers.forEach((member) => validUserIds.add(member.userId));
    return userIds.every((userId) => validUserIds.has(userId));
};
exports.validateProjectMembers = validateProjectMembers;
const updateTaskAssignments = async (taskId, assigneeIds) => {
    await prisma.taskAssignee.deleteMany({
        where: { taskId },
    });
    if (assigneeIds.length > 0) {
        await prisma.taskAssignee.createMany({
            data: assigneeIds.map((userId) => ({
                taskId,
                userId,
            })),
        });
    }
};
exports.updateTaskAssignments = updateTaskAssignments;
const getTaskAssignments = async (taskId) => {
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
exports.getTaskAssignments = getTaskAssignments;
//# sourceMappingURL=taskAssignments.js.map
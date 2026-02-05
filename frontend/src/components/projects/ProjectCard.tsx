'use client';

import Link from 'next/link';
import type { Project, ProjectRole, User } from '@/types';
import Avatar from '@/components/ui/Avatar';

interface ProjectCardProps {
    project: Project;
    user: User;
}

export default function ProjectCard({ project, user }: ProjectCardProps) {
    // Calculer la progression
    const totalTasks = project._count?.tasks ?? project.tasks?.length ?? 0;
    const completedTasks = project.tasks?.filter((t) => t.status === 'DONE').length ?? 0;
    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Rôle de l'utilisateur (OWNER = Administrateur, CONTRIBUTOR = Contributeur)
    const getRoleLabel = (role: ProjectRole) => {
        switch (role) {
            case 'OWNER':
                return 'Administrateur';
            case 'CONTRIBUTOR':
                return 'Contributeur';
            default:
                return role;
        }
    };

    return (
        <Link
            href={`/projects/${project.id}`}
            aria-label={`Projet ${project.name}, progression ${progressPercent}%, ${completedTasks} sur ${totalTasks} tâches terminées`}
            className="card-interactive-lg block p-6"
        >
            {/* Titre */}
            <h3 className="text-lg font-bold text-gray-900 mb-2">
                {project.name}
            </h3>

            {/* Description */}
            {project.description && (
                <p className="text-sm text-gray-500 line-clamp-2 mb-6">
                    {project.description}
                </p>
            )}

            {/* Progression */}
            <div className="mb-1">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Progression</span>
                    <span className="text-sm font-medium text-gray-900">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-accent rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            {/* Compteur de tâches */}
            <p className="text-xs text-gray-500 mb-6">
                {completedTasks}/{totalTasks} tâches terminées
            </p>

            {/* Équipe */}
            <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="text-sm text-gray-600">
                    Équipe ({(project.members?.length ?? 0) + 1})
                </span>
            </div>

            {/* Membres */}
            <div className="flex items-center gap-2 mt-3 flex-wrap" aria-label="Membres de l'équipe">
                {/* Utilisateur connecté */}
                <Avatar
                    name={user.name}
                    email={user.email}
                    size="md"
                    variant="orange"
                    className="bg-primary-light text-black"
                    alt={`Vous: ${user.name || user.email}`}
                />

                {/* Rôle de l'utilisateur connecté */}
                {project.userRole && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-light text-accent">
                        {getRoleLabel(project.userRole)}
                    </span>
                )}

                {/* Autres membres (sauf l'utilisateur connecté) */}
                {project.members
                    ?.filter((member) => member.userId !== user.id)
                    .slice(0, 3)
                    .map((member) => (
                        <Avatar
                            key={member.id}
                            name={member.user.name}
                            email={member.user.email}
                            size="md"
                            alt={member.user.name || member.user.email}
                        />
                    ))}

                {/* Indicateur pour plus de membres */}
                {project.members && project.members.filter((m) => m.userId !== user.id).length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">
                        +{project.members.filter((m) => m.userId !== user.id).length - 3}
                    </div>
                )}
            </div>
        </Link>
    );
}

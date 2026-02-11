'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Project, User } from '@/types';
import Avatar from '@/components/ui/Avatar';
import { getRoleLabel } from '@/lib/permissions';

interface ProjectCardProps {
    project: Project;
    user: User;
}

export default function ProjectCard({ project, user }: ProjectCardProps) {
    // Calculer la progression
    const totalTasks = project._count?.tasks ?? project.tasks?.length ?? 0;
    const completedTasks = project.tasks?.filter((t) => t.status === 'DONE').length ?? 0;
    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Autres membres (hors utilisateur connecté) — mémorisé
    const otherMembers = useMemo(
        () => project.members?.filter((m) => m.userId !== user.id) ?? [],
        [project.members, user.id]
    );

    return (
        <Link
            href={`/projects/${project.id}`}
            aria-label={`Projet ${project.name}, progression ${progressPercent}%, ${completedTasks} sur ${totalTasks} tâches terminées`}
            className="card-interactive-lg block p-6"
        >
            {/* Titre */}
            <h3 className="text-lg font-heading font-bold text-heading mb-4">
                {project.name}
            </h3>

            {/* Description */}
            {project.description && (
                <p className="text-sm font-body text-sub line-clamp-2 mb-10">
                    {project.description}
                </p>
            )}

            {/* Progression */}
            <div className="mb-1">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-body text-sub">Progression</span>
                    <span className="text-sm font-body font-medium text-heading">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-primary-grey rounded-full overflow-hidden">
                    <div
                        className="h-full bg-accent rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            {/* Compteur de tâches */}
            <p className="text-xs font-body text-sub mb-10">
                {completedTasks}/{totalTasks} tâches terminées
            </p>

            {/* Équipe */}
            <div className="flex items-center gap-2 mb-4">
                <Image src="/ico-team.png" alt="" width={16} height={16} aria-hidden="true" style={{ height: 'auto' }} />
                <span className="text-sm font-body text-sub">
                    Équipe ({(project.members?.length ?? 0) + 1})
                </span>
            </div>

            {/* Membres */}
            <div className="flex items-center gap-2 flex-wrap" aria-label="Membres de l'équipe">
                {/* Utilisateur connecté */}
                <Avatar
                    name={user.name}
                    email={user.email}
                    size="md"
                    variant="light"
                />

                {/* Rôle de l'utilisateur connecté */}
                {project.userRole && (
                    <span className="px-3 py-1 rounded-full text-xs font-body font-medium bg-primary-light text-accent">
                        {getRoleLabel(project.userRole)}
                    </span>
                )}

                {/* Autres membres (superposés) */}
                {otherMembers.length > 0 && (
                    <div className="flex items-center -space-x-2">
                        {otherMembers.slice(0, 3).map((member) => (
                            <Avatar
                                key={member.id}
                                name={member.user.name}
                                email={member.user.email}
                                size="md"
                                className="ring-2 ring-white"
                            />
                        ))}

                        {/* Indicateur pour plus de membres */}
                        {otherMembers.length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-primary-grey flex items-center justify-center text-xs font-body font-medium text-sub ring-2 ring-white">
                                +{otherMembers.length - 3}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Link>
    );
}

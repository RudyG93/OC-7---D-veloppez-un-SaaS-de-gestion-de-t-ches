import { getRoleLabel } from "@/lib/permissions";
import { getDisplayName } from '@/lib/utils';
import Avatar from '@/components/ui/Avatar';
import type { Project, ProjectRole, User } from '@/types';

interface ProjectMembersProps {
  project: Project;
  user: User;
}

export function ProjectMembers({ project, user }: ProjectMembersProps) {
  const memberCount = (project.members?.length ?? 0) + 1;

  return (
    <div className="bg-[#F3F4F6] rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between">
        {/* Titre + compteur */}
        <div className="flex items-baseline gap-2">
          <h2 className="font-heading font-semibold text-heading">Contributeurs</h2>
          <span className="text-sm font-body text-sub">{memberCount} personnes</span>
        </div>

        {/* Avatars et noms */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Utilisateur connecté */}
          <div className="flex items-center gap-2">
            <Avatar
              name={user.name}
              email={user.email}
              size="md"
              variant="light"
            />
            <span className="px-3 py-1 rounded-full text-xs font-body font-medium bg-primary-light text-primary">
              {getRoleLabel(project.userRole as ProjectRole)}
            </span>
          </div>

          {/* Autres membres */}
          {project.members?.map((member) => (
            <div key={member.id} className="flex items-center gap-2">
              <Avatar
                name={member.user.name}
                email={member.user.email}
                size="md"
              />
              <span className="px-3 py-1 rounded-full text-xs font-body font-medium bg-primary-grey text-heading">
                {getDisplayName(member.user.name, member.user.email)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

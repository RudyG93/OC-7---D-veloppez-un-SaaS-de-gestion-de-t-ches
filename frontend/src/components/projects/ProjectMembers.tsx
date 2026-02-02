import { getRoleLabel } from "@/lib/permissions";
import Avatar from '@/components/ui/Avatar';
import type { Project, ProjectRole, User } from '@/types';

interface ProjectMembersProps {
  project: Project;
  user: User;
}

export function ProjectMembers({ project, user }: ProjectMembersProps) {

  return (
    <>
      <div className="bg-gray-50 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Contributeurs</h2>
          <span className="text-sm text-gray-500">
            {(project.members?.length ?? 0) + 1} personnes
          </span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Connected User */}
          <div className="flex items-center gap-2">
            <Avatar
              name={user.name}
              email={user.email}
              size="md"
              alt={user.name || user.email}
            />
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#FFE8D9] text-[#D3590B]">
              {getRoleLabel(project.userRole as ProjectRole)}
            </span>
          </div>

          {/* Membres */}
          {project.members?.map((member) => (
            <div key={member.id} className="flex items-center gap-2">
              <Avatar
                name={member.user.name}
                email={member.user.email}
                size="md"
                alt={member.user.name || member.user.email}
              />
              <span className="text-sm text-gray-700">
                {member.user.name || member.user.email}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

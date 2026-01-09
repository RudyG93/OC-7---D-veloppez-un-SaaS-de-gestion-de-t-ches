export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  owner: User;
  members: ProjectMember[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  id: string;
  role: string;
  user: User;
  joinedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
  projectId: string;
  creatorId: Project;
  assignee?: User;
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskAssignee {
  id: string;
  userId: string;
  taskId: string;
  user: User;
  assignedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  authorId: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface Error {
  success: boolean;
  message: string;
  error: string;
  details: {
    field: string;
    message: string;
  };
}

export interface Success {
  success: boolean;
  message: string;
  data: {
    description: string;
  }
}
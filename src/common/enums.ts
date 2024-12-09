export enum TaskStatus {
  NEW = 'New',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  ON_HOLD = 'On Hold',
  CANCELLED = 'Cancelled',
  //   PENDING_REVIEW = 'Pending Review',
  //   IN_REVIEW = 'In Review',
  ARCHIVED = 'Archived',
}

export const TaskStatusColors = {
  NEW: {
    text: 'text-white',
    bg: 'bg-sky-500', // Blue represents a fresh or new task
  },
  IN_PROGRESS: {
    text: 'text-white',
    bg: 'bg-yellow-500', // Yellow represents active work or ongoing progress
  },
  COMPLETED: {
    text: 'text-white',
    bg: 'bg-green-500', // Green represents a successfully completed task
  },
  ON_HOLD: {
    text: 'text-white',
    bg: 'bg-gray-500', // Gray represents tasks that are paused or pending
  },
  CANCELLED: {
    text: 'text-white',
    bg: 'bg-red-500', // Red represents tasks that have been cancelled or abandoned
  },
  ARCHIVED: {
    text: 'text-white',
    bg: 'bg-purple-500', // Purple represents archived tasks (set aside for reference)
  },
};

export enum ProjectStatus {
  NEW = 'New',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  ON_HOLD = 'On Hold',
}

export const ProjectStatusColors = {
  NEW: {
    text: 'text-white',
    bg: 'bg-sky-500', // Blue represents a fresh or new task
  },
  IN_PROGRESS: {
    text: 'text-white',
    bg: 'bg-yellow-500', // Yellow represents active work or ongoing progress
  },
  COMPLETED: {
    text: 'text-white',
    bg: 'bg-green-500', // Green represents a successfully completed task
  },
  ON_HOLD: {
    text: 'text-white',
    bg: 'bg-slate-500', // Gray represents tasks that are paused or pending
  },
  CANCELLED: {
    text: 'text-white',
    bg: 'bg-red-500', // Red represents tasks that have been cancelled or abandoned
  },
};

export enum TaskPriority {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}
export enum ProjectPriority {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}
export enum ProjectCategory {
  A = 'A',
  'A+' = 'A+',
  'AA' = 'AA',
  'AA++' = 'AA+',
}

export const ProjectCategoryColors = {
  A: {
    text: 'text-white',
    bg: 'bg-sky-200', // Blue represents a fresh or new task
  },
  'A+': {
    text: 'text-white',
    bg: 'bg-sky-400', // Yellow represents active work or ongoing progress
  },
  AA: {
    text: 'text-white',
    bg: 'bg-sky-600', // Green represents a successfully completed task
  },
  'AA++': {
    text: 'text-white',
    bg: 'bg-sky-800', // Gray represents tasks that are paused or pending
  },
};

export enum AccessModules {
  ACCESS_CONTROL = 'ACCESS_CONTROL',
  PERMISSIONS = 'PERMISSIONS',
  USER_ROLES = 'USER_ROLES',
  ROLES = 'ROLES',
  PROJECTS = 'PROJECTS',
  TASKS = 'TASKS',
  TEAMS = 'TEAMS',
}

export enum AccessMethods {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  ALL = '*',
}

import { Data } from './common.types';
import { Task, TaskQuery } from './useTasksStore.types';

export interface ApprovalStoreType {
  approvals: Data<Task>;
  fetchApprovalResquests: (query: TaskQuery) => void;
}

import { useState } from 'react';
import Table, { ColumnDef } from '../../common/Table';
import { useTaskStore } from '../../store/useTasksStore';
import { TaskQuery, Task as TaskType } from '../../types/useTasksStore.types';
import AddTaskDialog from './AddTaskDialog';
import {
  TaskStatusColors,
  TaskStatus,
  ProjectCategoryColors,
  ProjectCategory,
} from '../../common/enums';
import humanizeDuration from 'humanize-duration';
import { Pencil, Send } from 'lucide-react';
import EditTaskDialog from './EditTaskDialog';
const Tasks = () => {
  const { fetchTasks, tasks, sendTaskToTeamLead } = useTaskStore();
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, _setQuery] = useState<TaskQuery>({
    paginate: true,
    isActive: true,
    projectId: undefined,
    relation: true,
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [task, setTask] = useState<undefined | TaskType>(undefined);
  const columns: ColumnDef[] = [
    {
      key: 'sr_no',
      label: 'Sr No',
      type: 'sr_no',
    },
    {
      key: 'title',
      label: 'Title',
      type: 'text',
    },
    {
      key: 'description',
      label: 'Description',
      type: 'text',
    },
    {
      key: 'priority',
      label: 'Priority',
      type: 'text',
    },
    {
      key: 'project',
      label: 'Project',
      type: 'element',
      render: (row) => (
        <div className="flex gap-2">
          <span>{row?.project?.name}</span>
          <span
            className={`px-2 py-0.5 text-xs rounded-xl ${ProjectCategoryColors[
              row?.project?.category as keyof typeof ProjectCategory
            ]?.bg} ${ProjectCategoryColors[
              row?.project?.category as keyof typeof ProjectCategory
            ]?.text}`}
          >
            {
              ProjectCategory[
                row?.project?.category as keyof typeof ProjectCategory
              ]
            }
          </span>
        </div>
      ),
    },
    {
      key: 'dueTime',
      label: 'Due Timeline',
      type: 'element',
      render: (row) => (
        <span>{humanizeDuration(row?.dueTime * 1000 * 60 * 60)}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      type: 'element',
      render: (row) => (
        <span
          className={`px-2 py-0.5 text-xs rounded-xl ${TaskStatusColors[
            row?.status as keyof typeof TaskStatus
          ]?.bg} ${TaskStatusColors[row?.status as keyof typeof TaskStatus]
            ?.text}`}
        >
          {TaskStatus[row?.status as keyof typeof TaskStatus]}
        </span>
      ),
    },

    {
      key: 'assignedTo',
      label: 'Assigned to',
      type: 'element',
      render: (row) => <span>{row?.assignedTo?.name}</span>,
    },
    {
      key: 'createdBy',
      label: 'Created By',
      type: 'element',
      render: (row) => <span>{row?.createdBy?.name}</span>,
    },
    // {
    //   key: 'isActive',
    //   label: 'Active',
    //   type: 'element',
    //   render: (row) => <>{row?.isActive ? 'Yes' : 'No'}</>,
    // },
    {
      key: 'Action',
      label: 'Action',
      type: 'element',
      render: (row: TaskType) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setIsEditModalOpen(true);
              setTask(row);
            }}
            className="flex items-center justify-center p-1.5 rounded-full dark:text-white bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => {
              sendTaskToTeamLead(row.taskId, row.projectId);
            }}
            className="flex items-center justify-center p-1.5 rounded-full dark:text-white bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            <Send size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* <Breadcrumb pageName="Tasks" /> */}
      <div className="w-full max-w-full flex flex-col items-end rounded-md h-full">
        <AddTaskDialog limit={limit} query={query} skip={skip} />
        <EditTaskDialog
          query={query}
          skip={skip}
          limit={limit}
          isEditModalOpen={isEditModalOpen}
          setIsEditModalOpen={setIsEditModalOpen}
          task={task}
        />
        <Table
          name={'Tasks'}
          columns={columns}
          total={tasks.total}
          key={'task-table'}
          query={query}
          pageable={true}
          data={tasks.data}
          fetch={fetchTasks}
          skip={skip}
          setSkip={setSkip}
          limit={limit}
          setLimit={setLimit}
        />
      </div>
    </>
  );
};
export default Tasks;

import { useEffect, useState } from 'react';
import Table, { ColumnDef } from '../../common/Table';
import { useTaskStore } from '../../store/useTasksStore';
import { TaskQuery, Task as TaskType } from '../../types/useTasksStore.types';
import AddTaskDialog from './AddTaskDialog';
import {
  TaskStatusColors,
  TaskStatus,
  ProjectCategoryColors,
  ProjectCategory,
  TaskPriority,
  TaskPriorityColors,
} from '../../common/enums';
import { Mail, Send } from 'lucide-react';
import EditTaskDialog from './EditTaskDialog';
import { Link } from 'react-router-dom';
import { useLoginStore } from '../../store/useLoginStore';
import { useProjectStore } from '../../store/useProjectStore';
const Tasks = () => {
  const { authenticatedUserRoleId, permissionEntities, user } = useLoginStore();
  const { fetchTasks, tasks, sendTaskToTeamLead } = useTaskStore();
  const { fetchProjects, projects } = useProjectStore();
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, _setQuery] = useState<TaskQuery>({
    paginate: true,
    isActive: true,
    projectId: permissionEntities['projectId']?.at(0),
    relation: true,
    priority: undefined,
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [task, setTask] = useState<undefined | TaskType>(undefined);

  useEffect(() => {
    fetchProjects({
      paginate: false,
      isActive: true,
      select: ['name', 'projectId'],
      ...(permissionEntities['projectId']?.at(0) == '*'
        ? {}
        : { projectId: permissionEntities['projectId'] }),
    });
  }, []);

  const columns: ColumnDef[] = [
    {
      key: 'sr_no',
      label: 'Sr No',
      type: 'sr_no',
    },
    {
      key: 'drawingTitle',
      label: 'Title',
      type: 'element',
      render: (row: TaskType) => (
        <Link
          title="view task details"
          to={`/tasks/${row?.taskId}`}
          className="underline decoration-blue-500 text-blue-500"
        >
          {row?.drawingTitle}
        </Link>
      ),
    },
    // {
    //   key: 'description',
    //   label: 'Description',
    //   type: 'element',
    //   render: (row: TaskType) => (
    //     <span className="block max-w-70">
    //       {row?.description?.length > 100
    //         ? `${row?.description?.slice(0, 99)}...`
    //         : row?.description}
    //     </span>
    //   ),
    // },
    {
      key: 'priority',
      label: 'Priority',
      type: 'text',
      render: (row) => (
        <span
          className={`px-4 py-1 text-xs rounded-xl font-medium ${TaskPriorityColors[
            row?.priority as keyof typeof TaskPriority
          ]?.bg} ${TaskPriorityColors[
            row?.priority as keyof typeof TaskPriority
          ]?.text}`}
        >
          {TaskPriority[row?.priority as keyof typeof TaskPriority]}
        </span>
      ),
    },
    {
      key: 'project',
      label: 'Project',
      type: 'element',
      render: (row) => (
        <div className="flex gap-2">
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
          <span>{row?.project?.name}</span>
        </div>
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
      label:
        authenticatedUserRoleId === 'DIRECTOR'
          ? 'Employee Name'
          : 'Assigned to',
      type: 'element',
      render: (row) => <span>{row?.assignedTo?.name}</span>,
    },
    {
      key: 'createdBy',
      label: 'Created By',
      type: 'element',
      render: (row) => <span>{row?.createdBy?.name}</span>,
    },
    {
      key: 'Action',
      label: 'Action',
      type: 'element',
      render: (row: TaskType) => (
        <div className="flex gap-2">
          <button
            title="send task to review"
            onClick={() => {
              sendTaskToTeamLead(row.taskId, row.projectId);
            }}
            className="flex items-center justify-center p-1.5 rounded-full dark:text-white bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            <Send size={14} />
          </button>

          <a
            target="_blank"
            href={`mailto:?subject=${encodeURIComponent(
              `Request for a review - ${row?.drawingTitle}`,
            )}&body=${encodeURIComponent(
              `Hi,

Task title: ${row?.drawingTitle ?? ''}
Task description: ${row?.description ?? 'NA'}

Thanks and regards,
${user?.name ?? ''}`,
            )}`}
            rel="noopener noreferrer"
          >
            <button
              title="Send Email"
              className="flex items-center justify-center p-1.5 rounded-full dark:text-white bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              <Mail size={14} />
            </button>
          </a>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* <Breadcrumb pageName="Tasks" /> */}
      <div className="w-full max-w-full flex flex-col items-end rounded-md h-full">
        <div className="flex gap-3 items-center">
          <label htmlFor="priority" className="text-sm">
            Priority:{' '}
            <select
              id="priority"
              defaultValue=""
              className="py-1 px-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent dark:bg-slate-900"
              onChange={(e) => {
                if (e?.target?.value) {
                  _setQuery({ ...query, priority: [e.target.value] });
                }
              }}
            >
              <option value="" disabled className="text-sm">
                Select Priority
              </option>
              {Object.entries(TaskPriority).map(([key, priority]) => (
                <option key={key} value={key}>
                  {priority}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="projects" className="text-sm">
            Projects:{' '}
            <select
              id="projects"
              defaultValue=""
              className="py-1 px-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent dark:bg-slate-900"
              onChange={(e) => {
                if (e?.target?.value) {
                  _setQuery({
                    ...query,
                    projectId: [e.target.value].join(','),
                  });
                }
              }}
            >
              <option value="" disabled className="text-sm">
                Select Project
              </option>
              {projects?.data?.map((project) => (
                <option key={project?.projectId} value={project?.projectId}>
                  {project?.name}
                </option>
              ))}
            </select>
          </label>

          <AddTaskDialog limit={limit} query={query} skip={skip} />
        </div>
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

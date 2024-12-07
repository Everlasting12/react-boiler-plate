import { useState } from 'react';
import Table, { ColumnDef } from '../../common/Table';
import { useTaskStore } from '../../store/useTasksStore';
import { TaskQuery } from '../../types/useTasksStore.types';
import AddTaskDialog from './AddTaskDialog';
import { TaskStatusColors, TaskStatus } from '../../common/enums';
import humanizeDuration from 'humanize-duration';
const Tasks = () => {
  const { fetchTasks, tasks } = useTaskStore();
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, _setQuery] = useState<TaskQuery>({
    paginate: true,
    isActive: true,
    projectId: undefined,
    relation: true,
  });
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
      key: 'drawingTitle',
      label: 'Drawing Title',
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
      render: (row) => <span>{row?.project?.name}</span>,
    },
    {
      key: 'dueTime',
      label: 'Due Timeline',
      type: 'element',
      render: (row) => <span>{humanizeDuration(row?.dueTime * 1000)}</span>,
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
    {
      key: 'isActive',
      label: 'Active',
      type: 'element',
      render: (row) => <>{row?.isActive ? 'Yes' : 'No'}</>,
    },
  ];

  return (
    <>
      {/* <Breadcrumb pageName="Tasks" /> */}
      <div className="w-full max-w-full flex flex-col items-end rounded-md h-full">
        {/* <button
          className="p-2 my-2 bg-primary text-white rounded-lg"
          onClick={handleAddTask}
        >
          + Task
        </button> */}

        <AddTaskDialog />

        <Table
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

import { useEffect, useState } from 'react';
import Table, { ColumnDef } from '../../common/Table';
import { useApprovalStore } from '../../store/useApprovalStore';
import dayjs from 'dayjs';
import { TaskQuery } from '../../types/useTasksStore.types';
import { useLoginStore } from '../../store/useLoginStore';
import { useProjectStore } from '../../store/useProjectStore';

const Approvals = () => {
  const { authenticatedUserRoleId, permissionEntities, user } = useLoginStore();
  const { fetchApprovalResquests, approvals } = useApprovalStore();
  const { fetchProjects, projects } = useProjectStore();
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, _setQuery] = useState<TaskQuery>({
    paginate: true,
    isActive: true,
    relation: true,
    projectId: permissionEntities['projectId']?.at(0),
  });

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
      key: 'name',
      label: 'Name',
      type: 'text',
    },
    {
      key: 'project',
      label: 'Project',
      type: 'element',
      render: (row) => <p className="max-w-[200px]">{row?.project?.name}</p>,
    },
    {
      key: 'members',
      label: 'Members',
      type: 'element',
      render: (row) => (
        <div className="flex flex-col items-start">
          {row?.members?.length && !row?.membersData ? (
            <button
              onClick={() => showMembers(row.id)}
              className="bg-slate-300 px-2 py-0.5 rounded-md text-black hover:bg-slate-200 dark:bg-black dark:text-white hover:dark:bg-slate-800"
            >
              Show Members
            </button>
          ) : (
            row?.membersData?.map((m) => (
              <span
                key={m.userId}
                className="py-0.5 px-2 my-0.5 bg-white dark:bg-slate-900/50 rounded-md"
              >
                {m.name} ({m.email})
              </span>
            ))
          )}
        </div>
        // <p className="max-w-[200px]">{JSON.stringify(row?.members)}</p>
      ),
    },
    {
      key: 'teamLeadId',
      label: 'Approval lead',
      type: 'element',
      render: (row) => (
        <span>
          {row?.teamLead?.name} <br /> ({row?.teamLead?.email})
        </span>
      ),
    },
    {
      key: 'createdBy',
      label: 'Created By',
      type: 'element',
      render: (row) => (
        <span>
          {row?.createdBy?.name} <br /> ({row?.createdBy?.email})
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created on',
      type: 'element',
      render: (row) => (
        <span>{dayjs(row?.createdAt).format('DD MMM YYYY')}</span>
      ),
    },
  ];

  return (
    <>
      {/* <Breadcrumb pageName="Approval" /> */}
      <div className="w-full max-w-full flex flex-col items-end rounded-md h-full">
        <div className="flex gap-3 items-center mb-2">
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
        </div>
        <Table
          name={'Approvals'}
          columns={columns}
          total={approvals.total}
          key={'approval-table'}
          query={query}
          pageable={true}
          data={approvals.data}
          fetch={fetchApprovalResquests}
          skip={skip}
          setSkip={setSkip}
          limit={limit}
          setLimit={setLimit}
        />
      </div>
    </>
  );
};
export default Approvals;

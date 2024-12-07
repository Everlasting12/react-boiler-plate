import { useState } from 'react';
import Table, { ColumnDef } from '../../common/Table';
import { useProjectStore } from '../../store/useProjectStore';
import { ProjectQuery } from '../../types/useProjectStore.types';
import AddProjectDialog from './AddProjectDialog';
import dayjs from 'dayjs';
import { ProjectStatus, ProjectStatusColors } from '../../common/enums';
const Project = () => {
  const { fetchProjects, projects } = useProjectStore();
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, _setQuery] = useState<ProjectQuery>({
    paginate: true,
    isActive: true,
    relation: true,
  });
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
      key: 'description',
      label: 'Description',
      type: 'element',
      render: (row) => <p className="max-w-[200px]">{row?.description}</p>,
    },
    {
      key: 'priority',
      label: 'Priority',
      type: 'text',
    },
    {
      key: 'category',
      label: 'Category',
      type: 'text',
    },
    {
      key: 'status',
      label: 'Status',
      type: 'element',
      render: (row) => (
        <p
          className={`px-1 text-center text-[11px] rounded-xl ${ProjectStatusColors[
            row?.status as keyof typeof ProjectStatus
          ]?.bg} ${ProjectStatusColors[
            row?.status as keyof typeof ProjectStatus
          ]?.text}`}
        >
          {ProjectStatus[row?.status as keyof typeof ProjectStatus]}
        </p>
      ),
    },
    {
      key: 'createdBy',
      label: 'Created By',
      type: 'element',
      render: (row) => <span>{row?.createdBy?.name}</span>,
    },
    {
      key: 'startDate',
      label: 'Started on',
      type: 'element',
      render: (row) => (
        <span>{dayjs(row?.startDate).format('DD MMM YYYY')}</span>
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
    {
      key: 'isActive',
      label: 'Active',
      type: 'element',
      render: (row) => <>{row?.isActive ? 'Yes' : 'No'}</>,
    },
  ];

  return (
    <>
      {/* <Breadcrumb pageName="Project" /> */}
      <div className="w-full max-w-full flex flex-col items-end rounded-md h-full">
        <AddProjectDialog query={query} skip={skip} limit={limit} />

        <Table
          columns={columns}
          total={projects.total}
          key={'project-table'}
          query={query}
          pageable={true}
          data={projects.data}
          fetch={fetchProjects}
          skip={skip}
          setSkip={setSkip}
          limit={limit}
          setLimit={setLimit}
        />
      </div>
    </>
  );
};
export default Project;

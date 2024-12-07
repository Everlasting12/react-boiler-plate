import { useState } from 'react';
import Table, { ColumnDef } from '../../common/Table';
import { useTeamStore } from '../../store/useTeamStore';
import { TeamQuery } from '../../types/useTeamStore.types';
import AddTeamDialog from './AddTeamDialog';
import dayjs from 'dayjs';

const Teams = () => {
  const { fetchTeams, teams } = useTeamStore();
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, _setQuery] = useState<TeamQuery>({
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
      {/* <Breadcrumb pageName="team" /> */}
      <div className="w-full max-w-full flex flex-col items-end rounded-md h-full">
        <AddTeamDialog query={query} skip={skip} limit={limit} />

        <Table
          columns={columns}
          total={teams.total}
          key={'team-table'}
          query={query}
          pageable={true}
          data={teams.data}
          fetch={fetchTeams}
          skip={skip}
          setSkip={setSkip}
          limit={limit}
          setLimit={setLimit}
        />
      </div>
    </>
  );
};
export default Teams;

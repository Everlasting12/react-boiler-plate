import { useState } from 'react';
import Table, { ColumnDef } from '../../common/Table';
import { useRoleStore } from '../../store/useRoleStore';
import { PermissionQuery } from '../../types/usePermissionsStore.types';
import AddRoleDialog from './AddRoleDialog';
const Roles = () => {
  const { fetchRoles, roles } = useRoleStore();
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, _setQuery] = useState<PermissionQuery>({
    paginate: true,
    isActive: true,
    isDefault: true,
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
      key: 'roleId',
      label: 'Role id',
      type: 'text',
    },
    {
      key: 'permissionIds',
      label: 'Permission Ids',
      type: 'element',
      render: (row) => (
        <div className="flex flex-col items-start">
          {row?.permissionIds?.map((permission: string, index: number) => (
            <span
              key={index}
              className="py-0.5 px-2 my-0.5 bg-white dark:bg-slate-900/50 rounded-md"
            >
              {++index}. {permission}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'isDefault',
      label: 'Default',
      type: 'element',
      render: (row) => <>{row?.isDefault ? 'Yes' : 'No'}</>,
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
      {/* <Breadcrumb pageName="Permissions" /> */}
      <div className="w-full max-w-full flex flex-col items-end rounded-md h-full">
        <AddRoleDialog />
        <Table
          columns={columns}
          total={roles.total}
          key={'roles-table'}
          query={query}
          pageable={true}
          data={roles.data}
          fetch={fetchRoles}
          skip={skip}
          setSkip={setSkip}
          limit={limit}
          setLimit={setLimit}
          name={'Roles'}
        />
      </div>
    </>
  );
};
export default Roles;

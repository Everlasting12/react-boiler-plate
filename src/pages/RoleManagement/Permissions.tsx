import { useState } from 'react';
import Table, { ColumnDef } from '../../common/Table';
import { usePermissionStore } from '../../store/usePermissionStore';
import { PermissionQuery } from '../../types/usePermissionsStore.types';
import AddPermissionDialog from './AddPermissionDialog';

const Permissions = () => {
  const [showModal, setShowModal] = useState(false);
  const { fetchPermissions, permissions } = usePermissionStore();
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
      key: 'apiScopes',
      label: 'Api Scopes',
      type: 'element',
      render: (row) => (
        <div className="flex flex-col items-start">
          {row?.apiScopes?.map((api: string, index: number) => (
            <span
              key={index}
              className="py-0.5 px-2 my-0.5 bg-white dark:bg-slate-900/50 rounded-md"
            >
              {++index}. {api}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'isActive',
      label: 'Active',
      type: 'element',
      render: (row) => <>{row?.isActive ? 'Yes' : 'No'}</>,
    },
  ];

  const handleAddPermission = () => {
    setShowModal(true);
  };

  return (
    <>
      {/* <Breadcrumb pageName="Permissions" /> */}
      <div className="w-full max-w-full flex flex-col items-end rounded-md h-full">
        {/* <button
          className="p-2 my-2 bg-primary text-white rounded-lg"
          onClick={handleAddPermission}
        >
          + Permission
        </button> */}

        <AddPermissionDialog />

        <Table
          name={'Permissions'}
          columns={columns}
          total={permissions.total}
          key={'permission-table'}
          query={query}
          pageable={true}
          data={permissions.data}
          fetch={fetchPermissions}
          skip={skip}
          setSkip={setSkip}
          limit={limit}
          setLimit={setLimit}
        />
      </div>
    </>
  );
};
export default Permissions;

import { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const Users = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/users/table');
  }, []);

  return (
    <>
      <div className="w-full max-w-full flex flex-col rounded-md h-full">
        <UsersLinks />
        <Outlet />
      </div>
    </>
  );
};
export default Users;

const UsersTabLinks = [
  {
    path: '/users/table',
    label: 'Users',
  },
  {
    path: '/users/add',
    label: '+ Add user',
  },
];

export const UsersLinks = () => {
  const location = useLocation();

  return (
    <div className="mb-2 flex">
      {UsersTabLinks?.map((link, index, array) => (
        <Link
          key={link.path}
          className={`px-5 py-1 text-black dark:text-white text-sm border border-zinc-200 dark:border-slate-700 ${
            index === 0
              ? 'rounded-l-md'
              : index === array.length - 1
              ? 'rounded-r-md'
              : ''
          } ${
            location?.pathname === link.path
              ? ' bg-zinc-300 border-zinc-300 dark:bg-slate-700'
              : ''
          }  hover:bg-zinc-100 dark:hover:bg-slate-600`}
          to={link.path}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
};

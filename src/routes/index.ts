import { lazy } from 'react';

const Permissions = lazy(() => import('../pages/RoleManagement/Permissions'));
const Roles = lazy(() => import('../pages/RoleManagement/Roles'));
const UserRoles = lazy(() => import('../pages/RoleManagement/UserRoles'));
const Tasks = lazy(() => import('../pages/Tasks/Tasks'));
const Task = lazy(() => import('../pages/Tasks/Task'));
const Project = lazy(() => import('../pages/Project/Project'));
const Teams = lazy(() => import('../pages/Teams/Teams'));
const Approvals = lazy(() => import('../pages/Approvals/Approvals'));
const Chart = lazy(() => import('../pages/Chart'));
const FormElements = lazy(() => import('../pages/Form/FormElements'));
const FormLayout = lazy(() => import('../pages/Form/FormLayout'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const Tables = lazy(() => import('../pages/Tables'));
const Alerts = lazy(() => import('../pages/UiElements/Alerts'));
const Buttons = lazy(() => import('../pages/UiElements/Buttons'));

const coreRoutes = [
  {
    path: '/permissions',
    title: 'Permissions',
    component: Permissions,
  },
  {
    path: '/roles',
    title: 'Roles',
    component: Roles,
  },
  {
    path: '/user-roles',
    title: 'User Roles',
    component: UserRoles,
  },
  {
    path: '/tasks',
    title: 'Tasks',
    component: Tasks,
  },
  {
    path: '/tasks/:taskId',
    title: 'Task',
    component: Task,
  },
  {
    path: '/projects',
    title: 'Projects',
    component: Project,
  },
  {
    path: '/teams',
    title: 'Teams',
    component: Teams,
  },
  {
    path: '/approvals',
    title: 'Approvals',
    component: Approvals,
  },
  // {
  //   path: '/calendar',
  //   title: 'Calender',
  //   component: Calendar,
  // },
  {
    path: '/profile',
    title: 'Profile',
    component: Profile,
  },
  {
    path: '/forms/form-elements',
    title: 'Forms Elements',
    component: FormElements,
  },
  {
    path: '/forms/form-layout',
    title: 'Form Layouts',
    component: FormLayout,
  },
  {
    path: '/tables',
    title: 'Tables',
    component: Tables,
  },
  {
    path: '/settings',
    title: 'Settings',
    component: Settings,
  },
  {
    path: '/chart',
    title: 'Chart',
    component: Chart,
  },
  {
    path: '/ui/alerts',
    title: 'Alerts',
    component: Alerts,
  },
  {
    path: '/ui/buttons',
    title: 'Buttons',
    component: Buttons,
  },
];

const routes = [...coreRoutes];
export default routes;

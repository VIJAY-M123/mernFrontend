import UserRole from './UserRole';
import UserRoleDetails from './UserRoleDetails';

const UserRoleConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'masters/user-role',
      element: <UserRole />,
    },
    {
      path: 'masters/user-role/new',
      element: <UserRoleDetails />,
    },
    {
      path: 'masters/user-role/details/:id',
      element: <UserRoleDetails />,
    },
  ],
};

export default UserRoleConfig;

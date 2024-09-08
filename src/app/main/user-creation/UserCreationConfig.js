import UserCreation from './UserCreation';
import UserCreationDetails from './UserCreationDetails';

const UserCreationConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'user-creation',
      element: <UserCreation />,
    },
    {
      path: 'user-creation/create',
      element: <UserCreationDetails />,
    },
    {
      path: 'user-creation/details/:id',
      element: <UserCreationDetails />,
    },
    {
      path: 'masters/report-creation/new/:id',
      element: <UserCreationDetails />,
    },
  ],
};

export default UserCreationConfig;

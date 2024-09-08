import Upload from './Upload';
import UploadDetails from './UploadDetails';

const UploadConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'upload/bulk-upload',
      element: <Upload />,
    },
    {
      path: 'upload/details',
      element: <UploadDetails />,
    },
  ],
};

export default UploadConfig;

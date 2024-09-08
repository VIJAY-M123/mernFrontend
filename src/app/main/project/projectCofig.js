import Project from './project';

const ProjectConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/project',
      element: <Project />,
    },
  ],
};

export default ProjectConfig;

import { createBrowserRouter } from 'react-router-dom';

// project import
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';

// types
import DashboardDefault from 'pages/dashboard/default';
import DashboardLayout from 'layout/Dashboard';

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter(
  [
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        {
          index: true,
          element: <DashboardDefault />
        }
      ]
    },
    LoginRoutes,
    MainRoutes
  ],
  { basename: import.meta.env.VITE_APP_BASE_NAME }
);

export default router;

import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import PagesLayout from 'layout/Pages';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));

const TokensSettings = Loadable(lazy(() => import('pages/settings/tokens')));

const AccountProfile = Loadable(lazy(() => import('pages/account')));
const AccountTabAccount = Loadable(lazy(() => import('sections/account/TabAccount')));
const AccountTabPassword = Loadable(lazy(() => import('sections/account/TabPassword')));
const AccountTab2FA = Loadable(lazy(() => import('sections/account/Tab2FA')));
const AccountTabPersonal = Loadable(lazy(() => import('sections/account/TabNotifications')));

const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon')));

const PaymentLink = Loadable(lazy(() => import('pages/dashboard/payment-link')));

// render - sample page
const PricingPage = Loadable(lazy(() => import('pages/extra-pages/pricing')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'dashboard',
          children: []
        },
        {
          path: 'invoices',
          element: <PaymentLink />
        },
        {
          path: 'settings',
          children: [
            {
              path: 'tokens',
              element: <TokensSettings />
            }
          ]
        },
        {
          path: 'account',
          element: <AccountProfile />,
          children: [
            {
              path: 'settings',
              element: <AccountTabAccount />
            },
            {
              path: 'password',
              element: <AccountTabPassword />
            },
            {
              path: '2fa',
              element: <AccountTab2FA />
            },
            {
              path: 'notifications',
              element: <AccountTabPersonal />
            }
          ]
        },
        {
          path: 'pricing',
          element: <PricingPage />
        }
      ]
    },
    {
      path: '/maintenance',
      element: <PagesLayout />,
      children: [
        {
          path: '404',
          element: <MaintenanceError />
        },
        {
          path: '500',
          element: <MaintenanceError500 />
        },
        {
          path: 'under-construction',
          element: <MaintenanceUnderConstruction />
        },
        {
          path: 'coming-soon',
          element: <MaintenanceComingSoon />
        }
      ]
    }
  ]
};

export default MainRoutes;

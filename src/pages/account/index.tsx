import { useEffect, useState } from 'react';
import { useLocation, Link, Outlet } from 'react-router-dom';

// material-ui
import { Box, Tab, Tabs } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import { APP_DEFAULT_PATH } from 'config';

// assets
import { ContainerOutlined, SafetyOutlined, LockOutlined, BellOutlined } from '@ant-design/icons';

// ==============================|| PROFILE - ACCOUNT ||============================== //

const AccountProfile = () => {
  const { pathname } = useLocation();

  let selectedTab = 0;
  let breadcrumbTitle = '';
  let breadcrumbHeading = '';
  switch (pathname) {
    case '/account/password':
      breadcrumbTitle = 'Change Password';
      breadcrumbHeading = 'Change Password';
      selectedTab = 1;
      break;
    case '/account/2fa':
      breadcrumbTitle = 'Two-Factor Authentication';
      breadcrumbHeading = 'Two-Factor Authentication';
      selectedTab = 2;
      break;
    case '/account/notifications':
      breadcrumbTitle = 'Notifications';
      breadcrumbHeading = 'Notifications';
      selectedTab = 3;
      break;
    case '/account/settings':
    default:
      breadcrumbTitle = 'Account';
      breadcrumbHeading = 'Account';
      selectedTab = 0;
  }

  const [value, setValue] = useState(selectedTab);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  let breadcrumbLinks = [{ title: 'Home', to: APP_DEFAULT_PATH }, { title: 'Account', to: '/account/' }, { title: breadcrumbTitle }];
  if (selectedTab === 0) {
    breadcrumbLinks = [{ title: 'Home', to: APP_DEFAULT_PATH }, { title: 'Account Settings' }];
  }

  useEffect(() => {
    if (pathname === '/account/') {
      setValue(0);
    }
    // eslint-disable-next-line
  }, [pathname]);

  return (
    <>
      <Breadcrumbs custom heading={breadcrumbHeading} links={breadcrumbLinks} />
      <MainCard border={false} boxShadow>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
          <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="account tab">
            <Tab label="Account" component={Link} to="/account/settings" icon={<ContainerOutlined />} iconPosition="start" />
            <Tab label="Change Password" component={Link} to="/account/password" icon={<LockOutlined />} iconPosition="start" />
            <Tab label="Two-Factor Authentication" component={Link} to="/account/2fa" icon={<SafetyOutlined />} iconPosition="start" />
            <Tab label="Notifications" component={Link} to="/account/notifications" icon={<BellOutlined />} iconPosition="start" />
          </Tabs>
        </Box>
        <Box sx={{ mt: 2.5 }}>
          <Outlet />
        </Box>
      </MainCard>
    </>
  );
};

export default AccountProfile;

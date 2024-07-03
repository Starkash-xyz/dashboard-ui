import { useMemo } from 'react';

// material-ui
import { Theme } from '@mui/material/styles';
import { Box, useMediaQuery } from '@mui/material';

// project import
import Profile from './Profile';
import Localization from './Localization';
import Notification from './Notification';
import MobileSection from './MobileSection';

import useConfig from 'hooks/useConfig';
import DrawerHeader from 'layout/Dashboard/Drawer/DrawerHeader';

// types
import { MenuOrientation } from 'types/config';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const { i18n, menuOrientation } = useConfig();

  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const localization = useMemo(() => <Localization />, [i18n]);

  return (
    <>
      <Box sx={{ width: '100%' }}>{menuOrientation === MenuOrientation.HORIZONTAL && !downLG && <DrawerHeader open={true} />}</Box>
      {!downLG && localization}
      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}

      <Notification />
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </>
  );
};

export default HeaderContent;

// project import
import NavUser from './NavUser';
import Navigation from './Navigation';
import SimpleBar from 'components/third-party/SimpleBar';
import NavStores from './NavStores';

// ==============================|| DRAWER CONTENT ||============================== //

const DrawerContent = () => {
  return (
    <>
      <SimpleBar
        sx={{
          '& .simplebar-content': {
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <NavStores />
        <Navigation />
      </SimpleBar>
      <NavUser />
    </>
  );
};

export default DrawerContent;

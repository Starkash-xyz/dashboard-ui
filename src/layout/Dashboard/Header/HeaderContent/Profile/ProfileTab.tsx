// material-ui
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

// assets
import { SettingOutlined, LogoutOutlined } from '@ant-design/icons';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

interface Props {
  handleLogout: () => void;
}

const ProfileTab = ({ handleLogout }: Props) => {
  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <ListItemButton href="/account">
        <ListItemIcon>
          <SettingOutlined />
        </ListItemIcon>
        <ListItemText primary="Account Settings" />
      </ListItemButton>
      <ListItemButton onClick={handleLogout}>
        <ListItemIcon>
          <LogoutOutlined />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </List>
  );
};

export default ProfileTab;

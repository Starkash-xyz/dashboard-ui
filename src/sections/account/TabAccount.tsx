import { useState } from 'react';

// material-ui
import {
  Button,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import Dot from 'components/@extended/Dot';

// styles & constant
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
    }
  }
};

// ==============================|| ACCOUNT PROFILE - MY ACCOUNT ||============================== //

const TabAccount = () => {
  const [signing, setSigning] = useState('facebook');

  const handleChange = (event: SelectChangeEvent<string>) => {
    setSigning(event.target.value);
  };

  const [checked, setChecked] = useState(['sb', 'ln', 'la']);

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MainCard title="General Settings">
          <Grid container flexDirection="column" spacing={3}>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="my-account-username">Username</InputLabel>
                <TextField fullWidth defaultValue="Asoka_Tana_16" id="my-account-username" placeholder="Username" autoFocus />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="my-account-email">Email</InputLabel>
                <TextField fullWidth defaultValue="user@tana.com" id="my-account-email" placeholder="Account Email" />
              </Stack>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>

      <Grid item xs={12}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button variant="contained">Save</Button>
          <Button variant="outlined" color="secondary">
            Cancel
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default TabAccount;

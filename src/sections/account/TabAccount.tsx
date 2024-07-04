// material-ui
import { Button, Grid, InputLabel, Stack, TextField } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// ==============================|| ACCOUNT PROFILE - MY ACCOUNT ||============================== //

const TabAccount = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MainCard title="General Settings">
          <Grid container flexDirection="column" spacing={3}>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="my-account-username">Username</InputLabel>
                <TextField fullWidth id="my-account-username" placeholder="Username" autoFocus />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="my-account-email">Email</InputLabel>
                <TextField fullWidth id="my-account-email" placeholder="Account Email" />
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

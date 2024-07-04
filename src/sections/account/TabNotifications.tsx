// material-ui
import { Button, FormControl, FormControlLabel, FormGroup, Grid, Stack, Switch } from '@mui/material';

// third-party

// project import
import MainCard from 'components/MainCard';

// ==============================|| ACCOUNT PROFILE - PERSONAL ||============================== //

const TabNotifications = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <MainCard title="Notification Settings">
          <p>To disable notification for a feature, kindly toggle off the specified feature.</p>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormGroup aria-label="position" row>
                  <FormControlLabel control={<Switch defaultChecked />} label="All invoices updated" labelPlacement="end" />
                </FormGroup>
                <FormGroup aria-label="position" row>
                  <FormControlLabel control={<Switch defaultChecked />} label="Invoice was paid after expiration" labelPlacement="end" />
                </FormGroup>
                <FormGroup aria-label="position" row>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Invoice expired with partial payments"
                    labelPlacement="end"
                  />
                </FormGroup>
                <FormGroup aria-label="position" row>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Invoice has payments that failed to confirm on time"
                    labelPlacement="end"
                  />
                </FormGroup>
                <FormGroup aria-label="position" row>
                  <FormControlLabel control={<Switch defaultChecked />} label="Invoice is settled" labelPlacement="end" />
                </FormGroup>
                <FormGroup aria-label="position" row>
                  <FormControlLabel control={<Switch defaultChecked />} label="Payouts" labelPlacement="end" />
                </FormGroup>
              </FormControl>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button variant="contained">Save</Button>
          <Button variant="outlined" color="secondary">
            Disable all notifications
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default TabNotifications;

// material-ui
import { Button, Grid, Stack, TextField } from '@mui/material';

// third-party
import { PatternFormat } from 'react-number-format';

// project import
import MainCard from 'components/MainCard';

// assets

// ==============================|| ACCOUNT PROFILE - PERSONAL ||============================== //

const Tab2FA = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <MainCard title="Enable 2FA">
          <p>To use an authenticator app go through the following steps:</p>
          <ol>
            <li>
              <p>Download a two-factor authenticator app like …</p>
              <ul>
                <li>
                  Authy for{' '}
                  <a href="https://play.google.com/store/apps/details?id=com.authy.authy&pli=1" target="_blank" rel="noopener noreferrer">
                    Android
                  </a>{' '}
                  or{' '}
                  <a href="https://apps.apple.com/us/app/authy/id494168017" target="_blank" rel="noopener noreferrer">
                    iOS
                  </a>
                </li>
                <li>
                  Microsoft Authenticator for{' '}
                  <a href="https://play.google.com/store/apps/details?id=com.azure.authenticator" target="_blank" rel="noopener noreferrer">
                    Android
                  </a>{' '}
                  or{' '}
                  <a href="https://apps.apple.com/us/app/microsoft-authenticator/id983156458" target="_blank" rel="noopener noreferrer">
                    iOS
                  </a>
                </li>
                <li>
                  Google Authenticator for{' '}
                  <a
                    href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Android
                  </a>{' '}
                  or{' '}
                  <a href="https://apps.apple.com/us/app/google-authenticator/id388497605" target="_blank" rel="noopener noreferrer">
                    iOS
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <p>Scan the QR Code or enter the following key into your two-factor authenticator app:</p>
            </li>
            <li>
              <p>Your two-factor authenticator app will provide you with a unique code. Enter the code in the confirmation box below.</p>
              <PatternFormat format="####" mask="_" customInput={TextField} onBlur={() => {}} onChange={() => {}} />
            </li>
          </ol>
        </MainCard>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button variant="contained">Update Profile</Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Tab2FA;

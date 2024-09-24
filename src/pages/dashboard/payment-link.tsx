import { Grid, Stack, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import PaymentLinkTable from './components/payment-link-table';
import { MdInfo } from 'react-icons/md';

function PaymentLink() {
  return (
    <div>
      <Typography variant="h2">Payment Link</Typography>

      <Grid
        item
        xs={12}
        sx={{
          marginTop: '20px'
        }}
      >
        <MainCard
          style={{
            backgroundColor: '#e6f4ff',
            marginBottom: '32px'
          }}
        >
          <Stack>
            <Typography variant="h4">Get started</Typography>
            <Typography
              variant="body1"
              sx={{ marginTop: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <MdInfo color="#1677ff" size={20} />
              <span>
                Here you can create a Payment link (also known as Invoice), share it with your customers, and see all
                the information about the Payment links created previously.
              </span>
            </Typography>
            <Typography variant="h5">How to use</Typography>
            <ul>
              <li>Press “Create payment link”</li>
              <li>Enter the details of your payment link and click</li>
              <li>“Confirm” Send the link to your customer.</li>
            </ul>
          </Stack>
        </MainCard>

        <PaymentLinkTable />
      </Grid>
    </div>
  );
}

export default PaymentLink;

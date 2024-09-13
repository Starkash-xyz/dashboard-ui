import { Grid, Stack, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import { MdInfo } from 'react-icons/md';
import TokenSelector from './components/token-selector';

function TokensSettings() {
  return (
    <div>
      <Typography variant="h2">Tokens</Typography>

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
            <Typography variant="body1" sx={{ marginTop: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MdInfo color="#1677ff" size={20} />
              <span>In this section you can manage cryptocurrencies to accept.</span>
            </Typography>
            <Typography variant="h5">How to start:</Typography>
            <ol>
              <li>Type your desired coin name in the search field.</li>
              <li>Use the icon search to find the specific coin you want to enable.</li>
              <li>Explore popular coins, stablecoins, and other currencies.</li>
              <li>Click on the coin's image to enable it as a payment currency</li>
            </ol>
          </Stack>
        </MainCard>

        <TokenSelector />
      </Grid>
    </div>
  );
}

export default TokensSettings;

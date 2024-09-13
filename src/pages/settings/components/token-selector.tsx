import React, { useState } from 'react';
import { TextField, Grid, Button, Typography, InputAdornment, Switch } from '@mui/material';
import { styled } from '@mui/material/styles';
import { IoMdSearch } from 'react-icons/io';
import { Coin, popularCoins, stableCoins } from 'config';
import MainCard from 'components/MainCard';

const CustomButton = styled(Button)<{ selected?: boolean }>(({ theme, selected }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  border: '1px solid',
  borderColor: selected ? theme.palette.primary.main : theme.palette.divider,
  borderRadius: theme.shape.borderRadius,
  textAlign: 'left',
  width: '100%',
  backgroundColor: selected ? theme.palette.action.selected : theme.palette.background.paper,
  '& .icon': {
    width: 32,
    height: 32,
    backgroundColor: theme.palette.grey[200],
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing(1)
  },
  '& .text': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    flexGrow: 1
  },
  '& .network': {
    fontSize: theme.typography.body2.fontSize,
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.main,
    padding: theme.spacing(0.5),
    borderRadius: theme.shape.borderRadius
  }
}));

const TokenSelector: React.FC = () => {
  const [showPopularCoins, setShowPopularCoins] = useState<boolean>(true);
  const [showStableCoins, setShowStableCoins] = useState<boolean>(true);
  const [selectedCoins, setSelectedCoins] = useState<Record<string, boolean>>({});

  const toggleCoinSelection = (coin: Coin) => {
    setSelectedCoins((prev) => ({
      ...prev,
      [coin.symbol + coin.network]: !prev[coin.symbol + coin.network]
    }));
  };

  const CoinButton: React.FC<Coin> = ({ name, symbol, network }) => {
    const isSelected = selectedCoins[symbol + network];
    return (
      <CustomButton selected={isSelected} onClick={() => toggleCoinSelection({ name, symbol, network })}>
        <div className="icon">
          {isSelected && <div style={{ width: 24, height: 24, backgroundColor: '#ffffff', borderRadius: '50%' }} />}
        </div>
        <div className="text">
          <Typography variant="body1" component="span">
            {symbol} <span className="network">{network}</span>
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {name}
          </Typography>
        </div>
      </CustomButton>
    );
  };

  const sections = [
    { title: 'Popular Coins', coins: popularCoins, show: showPopularCoins, setShow: setShowPopularCoins },
    { title: 'Stable Coins', coins: stableCoins, show: showStableCoins, setShow: setShowStableCoins }
  ];

  return (
    <MainCard>
      <Typography variant="h5" gutterBottom>
        Customers will be able to pay in the following tokens.
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Received funds will be automatically converted and sent to your payout wallet(s).
      </Typography>

      <TextField
        placeholder="Searck token"
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IoMdSearch size={20} />
            </InputAdornment>
          )
        }}
      />

      {sections.map(({ title, coins, show, setShow }, index) => (
        <div key={index} style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <Switch checked={show} onChange={(e) => setShow(e.target.checked)} />
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              {title}
            </Typography>
          </div>
          <Grid container spacing={2}>
            {coins.map((coin, coinIndex) => (
              <Grid item xs={12} sm={6} md={4} key={coinIndex}>
                <CoinButton {...coin} />
              </Grid>
            ))}
          </Grid>
        </div>
      ))}
    </MainCard>
  );
};

export default TokenSelector;

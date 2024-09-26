import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  CircularProgress,
  Typography,
  Tooltip,
  InputAdornment,
  Autocomplete,
  Box,
  ListItem
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { IoIosInformationCircleOutline, IoIosSearch } from 'react-icons/io';
import { getFirestore } from 'firebase/firestore';
import { fetchUserSettings, savePaymentLink } from 'data/firebase';
import useAuth from 'hooks/useAuth';
import { PaymentLink, Token } from 'config';
import { enqueueSnackbar } from 'notistack';

interface PaymentTokenSelectProps {
  tokens: Token[];
  value: Token | null;
  onChange: (currency: Token | null) => void;
}

function PaymentCurrencySelect({ tokens, value, onChange }: PaymentTokenSelectProps) {
  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => onChange(newValue)}
      options={tokens}
      getOptionLabel={(token) => `${token.name} (${token.symbol})`}
      renderOption={(props, option) => (
        <ListItem
          key={option.symbol}
          {...props}
          sx={{
            '&:hover': {
              backgroundColor: '#e6f4ff'
            }
          }}
        >
          <img
            src={option.logo}
            alt={option.name}
            style={{ width: 30, height: 30, borderRadius: '50%', marginRight: '16px' }}
          />
          <Box>
            <Typography variant="body1">{option.symbol}</Typography>
            <Typography variant="body2" color="textSecondary">
              {option.name}
            </Typography>
          </Box>
          {option.network && (
            <Typography
              variant="caption"
              sx={{
                marginLeft: 'auto',
                backgroundColor: option.network.color,
                color: '#fff',
                padding: '2px 6px',
                borderRadius: '5px',
                fontSize: '12px'
              }}
            >
              {option.network?.name}
            </Typography>
          )}
        </ListItem>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="All currencies"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <IoIosSearch />
              </InputAdornment>
            )
          }}
        />
      )}
      sx={{ width: '100%' }}
    />
  );
}

interface CreatePaymentLinkFormProps {
  open: boolean;
  onClose: () => void;
}

function CreatePaymentLinkForm({ open, onClose }: CreatePaymentLinkFormProps) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [price, setPrice] = useState('');
  const [orderDescription, setOrderDescription] = useState('');
  const [orderId, setOrderId] = useState('');
  const [fixedRate, setFixedRate] = useState(false);
  const [feePaidByUser, setFeePaidByUser] = useState(false);
  const [loading, setLoading] = useState(true);

  const db = getFirestore();
  const auth = useAuth();

  useEffect(() => {
    const loadCurrencies = async () => {
      setLoading(true);
      try {
        const user = auth.user;
        if (!user) throw new Error('User not authenticated');

        const userSettings = await fetchUserSettings(db, user.uid || '');
        setTokens(userSettings.tokens);
      } catch (error) {
        console.error('Error loading currencies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCurrencies();
  }, [auth.user, db]);

  const handleSubmit = async () => {
    setSelectedToken(null);
    setPrice('');
    setOrderDescription('');
    setOrderId('');
    setFixedRate(false);
    setFeePaidByUser(false);

    try {
      const user = auth.user;
      if (!user || !user.uid) throw new Error('User not authenticated');

      if (!selectedToken) throw new Error('You must select pay currency first');

      const paymentLink: PaymentLink = {
        token: selectedToken,
        price: +price,
        description: orderDescription,
        orderId,
        fixedRate,
        feePaidByUser,
        createdAt: Date.now(),
        invoiceId: uuidv4(),
        status: 'unpaid',
        userId: user.uid
      };
      await savePaymentLink(db, paymentLink);
      enqueueSnackbar('Payment link have been successfully created.', {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    } catch (error) {
      console.error('Error saving payment link: ', error);
      enqueueSnackbar('Failed to save payment link.', {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    }

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Create payment link</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
              Pay currency
            </Typography>

            <PaymentCurrencySelect tokens={tokens} value={selectedToken} onChange={setSelectedToken} />

            <TextField
              label="Price"
              fullWidth
              margin="normal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              InputProps={{
                endAdornment: <Typography>USD</Typography>
              }}
            />

            <TextField
              label="Order description"
              fullWidth
              margin="normal"
              value={orderDescription}
              onChange={(e) => setOrderDescription(e.target.value)}
              placeholder="Optional"
            />

            <TextField
              label="Order ID"
              fullWidth
              margin="normal"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Optional"
            />

            {/* <FormControlLabel
              control={<Checkbox checked={fixedRate} onChange={(e) => setFixedRate(e.target.checked)} />}
              label={
                <Typography>
                  Fixed rate{' '}
                  <Tooltip title="The rate for this transaction will be frozen for 20 minutes">
                    <Typography component="span" style={{ fontSize: '12px', cursor: 'help' }}>
                      {' '}
                      <IoIosInformationCircleOutline />
                    </Typography>
                  </Tooltip>
                </Typography>
              }
            /> */}

            <FormControlLabel
              control={<Checkbox checked={feePaidByUser} onChange={(e) => setFeePaidByUser(e.target.checked)} />}
              label={
                <Typography>
                  Fee paid by user{' '}
                  <Tooltip title="Your customer will cover all the fees for this payment.">
                    <Typography component="span" style={{ fontSize: '12px', cursor: 'help' }}>
                      {' '}
                      <IoIosInformationCircleOutline />
                    </Typography>
                  </Tooltip>
                </Typography>
              }
            />

            <Button variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }} onClick={handleSubmit}>
              Confirm
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default CreatePaymentLinkForm;

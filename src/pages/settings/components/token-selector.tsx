import React, { useEffect, useState } from 'react';
import { TextField, Grid, Button, Typography, InputAdornment, Switch } from '@mui/material';
import { styled } from '@mui/material/styles';
import { IoMdSearch } from 'react-icons/io';
import { Token } from 'config';
import MainCard from 'components/MainCard';

import { fetchUserSettings, saveUserSettings } from 'data/firebase';
import { enqueueSnackbar } from 'notistack';
import { getFirestore } from 'firebase/firestore';
import useAuth from 'hooks/useAuth';

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
  const db = getFirestore();
  const auth = useAuth();

  const [selectedTokens, setSelectedTokens] = useState<Record<string, Token>>({});
  const [allTokens, setAllTokens] = useState<Token[]>([]);

  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        const userSettings = await fetchUserSettings(db, auth);
        const selectedTokensMap: Record<string, Token> = {};

        userSettings.tokens.forEach((token) => {
          selectedTokensMap[token.address] = token;
        });

        setSelectedTokens(selectedTokensMap);
        setAllTokens([...userSettings.tokens]);
      } catch (error) {
        console.error('Error loading user settings:', error);
        enqueueSnackbar('Failed to load user settings.', { variant: 'error' });
      }
    };

    loadUserSettings();
  }, [auth, db]);

  const toggleTokenSelection = async (token: Token) => {
    try {
      const updatedTokens = { ...selectedTokens };
      const isSelected = updatedTokens[token.address].isSelected ?? false;

      updatedTokens[token.address] = {
        ...updatedTokens[token.address],
        isSelected: !isSelected
      };

      setSelectedTokens(updatedTokens);

      const selectedTokenList = Object.values(updatedTokens);
      await saveUserSettings(db, auth, selectedTokenList);
      enqueueSnackbar('User settings have been successfully saved.', {
        variant: 'success',
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
      });
    } catch (error) {
      console.error('Error saving user settings:', error);
      enqueueSnackbar('Failed to save user settings.', {
        variant: 'error',
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
      });
    }
  };

  const handleToggleSwitch = async (category: string, isOn: boolean) => {
    try {
      const updatedTokens = { ...selectedTokens };
      const categoryTokens = allTokens.filter((token) => token.category === category);

      categoryTokens.forEach((token) => {
        if (token.category === category) {
          updatedTokens[token.address] = {
            ...updatedTokens[token.address],
            isSelected: isOn
          };
        }
      });

      setSelectedTokens(updatedTokens);

      const selectedTokenList = Object.values(updatedTokens);
      await saveUserSettings(db, auth, selectedTokenList);
      enqueueSnackbar('User settings have been successfully saved.', {
        variant: 'success',
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
      });
    } catch (error) {
      console.error('Error saving user settings:', error);
      enqueueSnackbar('Failed to save user settings.', {
        variant: 'error',
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
      });
    }
  };

  const TokenButton = ({ token }: { token: Token }) => {
    const isSelected = selectedTokens[token.address].isSelected;
    return (
      <CustomButton selected={isSelected} onClick={() => toggleTokenSelection(token)}>
        <div className="icon">
          {isSelected && <div style={{ width: 24, height: 24, backgroundColor: '#ffffff', borderRadius: '50%' }} />}
        </div>
        <div className="text">
          <Typography variant="body1" component="span">
            {token.symbol} <span className="network">{token.network}</span>
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {token.name}
          </Typography>
        </div>
      </CustomButton>
    );
  };

  interface Section {
    title: string;
    tokens: Token[];
    category: string;
  }

  const sections: Section[] = [
    {
      title: 'Popular Tokens',
      tokens: allTokens.filter((t) => t.category === 'popularTokens'),
      category: 'popularTokens'
    },
    {
      title: 'Stable Tokens',
      tokens: allTokens.filter((t) => t.category === 'stableTokens'),
      category: 'stableTokens'
    }
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

      {sections.map(({ title, tokens, category }, index) => (
        <div key={index} style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <Switch
              checked={Object.values(selectedTokens).some((token) => token.category === category && token.isSelected)}
              onChange={(e) => {
                handleToggleSwitch(category, e.target.checked);
              }}
            />
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              {title}
            </Typography>
          </div>
          <Grid container spacing={2}>
            {tokens.map((token, coinIndex) => (
              <Grid item xs={12} sm={6} md={4} key={coinIndex}>
                <TokenButton token={token} />
              </Grid>
            ))}
          </Grid>
        </div>
      ))}
    </MainCard>
  );
};

export default TokenSelector;

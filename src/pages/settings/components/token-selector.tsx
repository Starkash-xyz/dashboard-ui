import React, { useEffect, useState } from 'react';
import { TextField, Grid, Button, Typography, InputAdornment, Switch, CircularProgress, Box } from '@mui/material';
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
  backgroundColor: theme.palette.background.paper,
  '&:hover': { boxShadow: '0 2px 7px 0 #64acff80' },
  '& .icon': {
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
    flexGrow: 1,
    color: selected ? '#000' : '#c6c6c6'
  },
  '& .network': {
    fontSize: '9px',
    color: '#fff',
    padding: theme.spacing(0.5),
    borderRadius: theme.shape.borderRadius,
    textTransform: 'uppercase'
  }
}));

const TokenSelector: React.FC = () => {
  const db = getFirestore();
  const auth = useAuth();

  const [selectedTokens, setSelectedTokens] = useState<Record<string, Token>>({});
  const [allTokens, setAllTokens] = useState<Token[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        setLoading(true);

        const user = auth.user;
        if (!user) throw new Error('User not authenticated');

        const userSettings = await fetchUserSettings(db, user.uid || '');
        const selectedTokensMap: Record<string, Token> = {};

        userSettings.tokens.forEach((token) => {
          selectedTokensMap[token.address] = token;
        });

        setSelectedTokens(selectedTokensMap);
        setAllTokens([...userSettings.tokens]);
        setFilteredTokens([...userSettings.tokens]);
      } catch (error) {
        console.error('Error loading user settings:', error);
        enqueueSnackbar('Failed to load user settings.', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    loadUserSettings();
  }, [auth, db]);

  const toggleTokenSelection = async (token: Token) => {
    try {
      const user = auth.user;
      if (!user) throw new Error('User not authenticated');

      const updatedTokens = { ...selectedTokens };
      const isSelected = updatedTokens[token.address].isSelected ?? false;

      updatedTokens[token.address] = {
        ...updatedTokens[token.address],
        isSelected: !isSelected
      };

      setSelectedTokens(updatedTokens);

      const selectedTokenList = Object.values(updatedTokens);
      await saveUserSettings(db, user.uid || '', selectedTokenList);
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
      const user = auth.user;
      if (!user) throw new Error('User not authenticated');

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
      await saveUserSettings(db, user.uid || '', selectedTokenList);
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value.toLowerCase();
    setSearchKeyword(keyword);

    const filteredTokens = allTokens.filter((token: Token) => {
      return token.name.toLowerCase().includes(keyword) || token.symbol.toLowerCase().includes(keyword);
    });

    setFilteredTokens(filteredTokens);
  };

  const TokenButton = ({ token }: { token: Token }) => {
    const isSelected = selectedTokens[token.address].isSelected;
    return (
      <CustomButton selected={isSelected} onClick={() => toggleTokenSelection(token)}>
        <div className="icon">
          <img
            src={token.logo}
            alt={token.name}
            style={{ width: 30, height: 30, borderRadius: '50%', filter: isSelected ? 'none' : 'grayscale(1)' }}
          />
        </div>
        <div className="text">
          <Typography variant="body1" component="span" sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{token.symbol} </span>
            {token.network && (
              <span className="network" style={{ backgroundColor: isSelected ? token.network.color : '#c6c6c6' }}>
                {token.network.name}
              </span>
            )}
          </Typography>
          <Typography variant="body2" color={isSelected ? 'textSecondary' : '#c6c6c6'}>
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
      tokens: filteredTokens.filter((t) => t.category === 'popularTokens'),
      category: 'popularTokens'
    },
    {
      title: 'Stable Tokens',
      tokens: filteredTokens.filter((t) => t.category === 'stableTokens'),
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
        value={searchKeyword}
        onChange={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IoMdSearch size={20} />
            </InputAdornment>
          )
        }}
      />

      {loading ? (
        <Box sx={{ marginTop: '10px' }}>
          <CircularProgress size={20} />
        </Box>
      ) : (
        <>
          {filteredTokens.length > 0 ? (
            <>
              {sections.map(
                ({ title, tokens, category }, index) =>
                  tokens.length > 0 && (
                    <div key={index} style={{ marginBottom: 24 }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                        <Switch
                          checked={Object.values(selectedTokens).some(
                            (token) => token.category === category && token.isSelected
                          )}
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
                  )
              )}
            </>
          ) : (
            <p>No tokens found.</p>
          )}
        </>
      )}
    </MainCard>
  );
};

export default TokenSelector;

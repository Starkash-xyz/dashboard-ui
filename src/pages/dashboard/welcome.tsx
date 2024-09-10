import { Button, Grid, Stack, Typography } from '@mui/material';
import IconDropdown, { DropdownItem } from 'components/IconDropdown';
import CasinoIcon from '../../assets/images/icons/casino.svg';
import AdultIcon from '../../assets/images/icons/adults-only.svg';
import EcommerceIcon from '../../assets/images/icons/e-commerce.svg';
import CharityIcon from '../../assets/images/icons/charity.svg';
import GamingIcon from '../../assets/images/icons/gaming.svg';

import MainCard from 'components/MainCard';
import { useState } from 'react';

function Welcome() {
  const [selectedOption, setSelectedOption] = useState<DropdownItem | null>(null);

  const dropdownItems: DropdownItem[] = [
    {
      label: 'Casino',
      onClick: () => console.log('Casino'),
      icon: CasinoIcon
    },
    {
      label: 'Adult',
      onClick: () => console.log('Adult clicked'),
      icon: AdultIcon
    },
    {
      label: 'E-commerce',
      onClick: () => console.log('E-commerce clicked'),
      icon: EcommerceIcon
    },
    {
      label: 'Charity',
      onClick: () => console.log('Charity clicked'),
      icon: CharityIcon
    },
    {
      label: 'Gaming',
      onClick: () => console.log('Gaming clicked'),
      icon: GamingIcon
    }
  ];

  const handleSelect = (item: DropdownItem) => {
    setSelectedOption(item);
    item.onClick();
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <Typography variant="h2">Dashboard</Typography>
        <p>In this section, you will be able to find your account's statistics. Now get ready to start with your integration!</p>
      </Grid>
      <Grid item xs={12}>
        <MainCard>
          <Stack>
            <Typography variant="h4">Get started</Typography>
            <p>Complete a quick account setup and start accepting crypto in just 5 minutes.</p>
          </Stack>
          <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }}>
            Start integration
          </Button>
        </MainCard>
      </Grid>
      <Grid item xs={12}>
        <MainCard>
          <Stack>
            <Typography variant="h4">Our products</Typography>
            <p>
              We have selected the most relevant products for you. Choose your project’s industry and start integration here or go directly
              to the API documentation.
            </p>
          </Stack>
          <IconDropdown items={dropdownItems} onSelect={handleSelect} defaultText="Select industry" width={275} />
          {selectedOption && (
            <Typography variant="body1" sx={{ mt: 2 }}>
              Selected option: {selectedOption.label}
            </Typography>
          )}
        </MainCard>
      </Grid>
    </Grid>
  );
}

export default Welcome;

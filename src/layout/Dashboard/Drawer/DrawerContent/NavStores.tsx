import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

function NavStores() {
  return (
    <Box
      sx={{
        pt: 2,
        pl: 3,
        pr: 2,
        mb: 3,
        display: 'block'
      }}
    >
      <FormControl fullWidth>
        <InputLabel id="store-select-label">Select Store</InputLabel>
        <Select labelId="store-select-label" id="store-select" placeholder="Select Store">
          <MenuItem value={1}>Store 1</MenuItem>
          <MenuItem value={2}>Store 2</MenuItem>
          <MenuItem value={3}>Store 3</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

export default NavStores;

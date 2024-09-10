import React, { useState } from 'react';
import { Button, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { DownOutlined } from '@ant-design/icons';

export interface DropdownItem {
  label: string;
  icon: string;
  onClick: () => void;
}

const IconDropdown = ({
  defaultText,
  items,
  onSelect,
  width
}: {
  defaultText?: string;
  items: DropdownItem[];
  onSelect: (item: DropdownItem) => void;
  width: number;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<DropdownItem | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemSelect = (item: DropdownItem) => {
    setSelectedItem(item);
    onSelect(item);
    handleClose();
  };

  return (
    <div>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        startIcon={selectedItem && <img src={selectedItem.icon} alt={selectedItem.label} style={{ width: 24, height: 24 }} />}
        endIcon={<DownOutlined />}
        variant="outlined"
        color="secondary"
        sx={{
          width: width ?? 275,
          justifyContent: 'start',
          position: 'relative',

          '.MuiButton-endIcon': {
            position: 'absolute',
            right: '15px'
          }
        }}
      >
        <span>{selectedItem ? selectedItem.label : defaultText ?? 'Select an option'}</span>
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: '275px'
          }
        }}
      >
        {items.map((item, index) => (
          <MenuItem key={index} onClick={() => handleItemSelect(item)}>
            <ListItemIcon>
              <img src={item.icon} alt={item.label} style={{ width: 24, height: 24 }} />
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default IconDropdown;

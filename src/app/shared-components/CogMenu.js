import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { MoreVert } from '@mui/icons-material';

const CogMenu = ({ menus, disabled, iconProps }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton {...iconProps} onClick={handleClick} disabled={disabled}>
        <MoreVert />
      </IconButton>
      <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        {menus.map(({ label, onClick }, i) => (
          <MenuItem
            key={i}
            onClick={() => {
              if (typeof onClick === 'function') onClick();
              handleClose();
            }}
          >
            {label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default CogMenu;

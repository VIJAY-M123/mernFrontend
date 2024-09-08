import { AddCircle } from '@mui/icons-material';
import { Button, Checkbox, FormControlLabel, Menu, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';

const DropdownMenu = ({ handleRole, renderChips }) => {
  const [selectedChips, setSelectedChips] = useState([]);
  const [anchor, setAnchor] = useState(null);

  const open = Boolean(anchor);

  const handleOpen = (event) => setAnchor(event.currentTarget);

  const handleClose = () => {
    setAnchor(null);
    handleRole(selectedChips);
    setSelectedChips([]);
  };

  return (
    <>
      {!!renderChips.length && (
        <Button className="mr-6 mb-6" color="warning" onClick={(event) => handleOpen(event)}>
          <AddCircle />
        </Button>
      )}
      <Menu
        className="h-[300px]"
        anchorEl={anchor}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        {renderChips.map((chip, index) => (
          <MenuItem className="grid" key={index}>
            <FormControlLabel
              className="text-18"
              control={
                <Checkbox
                  size="small"
                  onChange={(e) => {
                    const { checked } = e.target;
                    const newSelectedChips = [...selectedChips].filter((c) => c !== chip.UR_ID);
                    if (checked) newSelectedChips.push(chip.UR_ID);
                    setSelectedChips(newSelectedChips);
                  }}
                />
              }
              label={<Typography className="text-14">{chip.UR_CODE}</Typography>}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default DropdownMenu;

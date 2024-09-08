import { Autocomplete, TextField } from '@mui/material';
import { selectAgency, selectAgencyList, selectModule, setAgency } from 'app/store/agencySlice';
import { setNavigation } from 'app/store/fuse/navigationSlice';
import { selectUser } from 'app/store/userSlice';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import utils from 'src/@utils';
import JwtService from 'src/app/auth/services/jwtService';

const { filterMenus } = utils;
const AgencyBox = (props) => {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const module = useSelector(selectModule);
  const user = useSelector(selectUser);
  const value = useSelector(selectAgency);
  const options = useSelector(selectAgencyList);

  const handleChange = (a) => {
    dispatch(setAgency(a));

    JwtService.getNavigation({
      cp_id: a.cp_id,
      user_id: user.data.user_id,
      KEY_VAL: module.upa_project_name || user.data.default_project_name,
    })
      .then((res) => dispatch(setNavigation(filterMenus(res))))
      .catch((err) => dispatch(setNavigation([])));
  };

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      isOptionEqualToValue={(option, val) => option.cp_id === val.cp_id}
      getOptionLabel={(option) => option.cp_name_withcode}
      options={options}
      value={value}
      onChange={(e, d) => handleChange(d)}
      className="m-8 w-1/2"
      sx={{ maxWidth: 300 }}
      disableClearable
      renderOption={(fields, option) => (
        <li {...fields} key={option.cp_id}>
          {option.cp_name_withcode}
        </li>
      )}
      renderInput={(params) => <TextField {...params} size="small" fullWidth />}
    />
  );
};

export default AgencyBox;

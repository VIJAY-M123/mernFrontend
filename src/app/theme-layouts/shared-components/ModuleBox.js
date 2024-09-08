import { Autocomplete, TextField } from '@mui/material';
import { selectAgency, setModule } from 'app/store/agencySlice';
import { setNavigation } from 'app/store/fuse/navigationSlice';

import { selectUser } from 'app/store/userSlice';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import utils from 'src/@utils';
import JwtService from 'src/app/auth/services/jwtService';

const { filterMenus } = utils;
const ModuleBox = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const agency = useSelector(selectAgency);

  const [open, setOpen] = useState(false);
  const options = user.data.user_project_access_xml || [];
  const [value, setValue] = useState(
    options.filter((i) => i.upa_project_name.match(`${user.data.default_project_name}`)).pop()
  );

  const handleChange = (a) => {
    setValue(a);
    dispatch(setModule(a));
    JwtService.getNavigation({
      cp_id: agency.cp_id,
      user_id: user.data.user_id,
      KEY_VAL: a.upa_project_name,
    })
      .then((res) => dispatch(setNavigation(filterMenus(res))))
      .catch((err) => dispatch(setNavigation([])));

    navigate('/home');
  };

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      isOptionEqualToValue={(option, val) => option.upa_project_id === val.upa_project_id}
      getOptionLabel={(option) => option.upa_project_name}
      options={options}
      value={value}
      onChange={(e, d) => handleChange(d)}
      className="m-8 w-1/4"
      sx={{ maxWidth: 300 }}
      disableClearable
      renderOption={(fields, option) => (
        <li {...fields} key={option.upa_id}>
          {option.upa_project_name}
        </li>
      )}
      renderInput={(params) => <TextField {...params} size="small" fullWidth />}
    />
  );
};

export default ModuleBox;

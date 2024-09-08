import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoader } from 'app/store/fuse/loaderSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import {
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { selectUser } from 'app/store/userSlice';
import jwtService from '../../auth/services/jwtService';

const schema = yup.object().shape({
  userName: yup.string(),
  oldPassword: yup
    .string()
    .required('Please enter your Old Password.')
    .min(5, 'Password is too short - must be at least 5 chars.')
    .max(20, 'Password is too Long. ')
    .test((value, ctx) => {
      if (value && String(value).match(/[^a-zA-Z0-9!@#$%^*()/_{}[]/)) {
        return ctx.createError({
          message: 'Illegal character does not allow',
        });
      }
      return true;
    }),
  newPassword: yup
    .string()
    .required('Please enter your New Password.')
    .min(5, 'Password is too short - must be at least 5 chars.')
    .max(20, 'Password is too Long. ')
    .test((value, ctx) => {
      if (value && String(value).match(/[^a-zA-Z0-9!@#$%^*()/_{}[]/)) {
        return ctx.createError({
          message: 'Illegal character does not allow',
        });
      }
      return true;
    }),
  confirmPassword: yup
    .string()
    .required('Please enter your Confirm Password.')
    .min(5, 'Password is too short - must be at least 5 chars.')
    .max(20, 'Password is too Long. ')
    .oneOf([yup.ref('newPassword')], 'Passwords do not match')
    .test((value, ctx) => {
      if (value && String(value).match(/[^a-zA-Z0-9!@#$%^*()/_{}[]/)) {
        return ctx.createError({
          message: 'Illegal character does not allow',
        });
      }
      return true;
    }),
});

const defaultValues = {
  userName: '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
  remember: true,
};

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowPassword1 = () => setShowPassword1((show) => !show);
  const handleClickShowPassword2 = () => setShowPassword2((show) => !show);

  const dispatch = useDispatch();

  const { control, formState, handleSubmit } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const onSubmit = (data) => {
    data.userName = user.data.user_code;
    if (data.oldPassword === data.newPassword) {
      dispatch(hideLoader());
      dispatch(
        showMessage({
          type: 'manual',
          message: 'Old Password Cannot be same as New Password',
          variant: 'error',
        })
      );
      return;
    }
    dispatch(hideLoader());

    jwtService
      .changePasswordandNewpassword(data)
      .then((res) => {
        dispatch(hideLoader());
        navigate('/home');
        dispatch(
          showMessage({
            message: res,
            variant: 'success',
          })
        );
      })
      .catch((message) => {
        dispatch(hideLoader());
        dispatch(
          showMessage({
            message,
            variant: 'error',
          })
        );
      });
  };

  return (
    <div className="p-20 flex justify-center items-center ">
      <Card className="rounded mb-12 ">
        <CardContent>
          <Typography className="font-extrabold flex justify-center text-2xl">
            Change Password
          </Typography>
          <hr className="mb-14" />
          <form
            name="changePasswordForm"
            noValidate
            className="flex flex-col justify-center w-full mt-32"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Grid item xs={12} md={1}>
              <Controller
                name="userName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="User Name"
                    autoFocus
                    value={user.data.user_code}
                    error={!!errors.userName}
                    helperText={errors?.userName?.message}
                    variant="outlined"
                    disabled
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={1}>
              <Controller
                name="oldPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-16"
                    label="Old Password"
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowPassword}>
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={!!errors.oldPassword}
                    helperText={errors?.oldPassword?.message}
                    variant="outlined"
                    required
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={1}>
              <Controller
                name="newPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-16"
                    label="New Password"
                    type={showPassword1 ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowPassword1}>
                            {showPassword1 ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={!!errors.newPassword}
                    helperText={errors?.newPassword?.message}
                    variant="outlined"
                    required
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={1}>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-16"
                    label="Confirm Password"
                    type={showPassword2 ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowPassword2}>
                            {showPassword2 ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={!!errors.confirmPassword}
                    helperText={errors?.confirmPassword?.message}
                    variant="outlined"
                    required
                    fullWidth
                  />
                )}
              />
            </Grid>

            <div className="flex flex-col sm:flex-row items-center gap-9 justify-end">
              <Button variant="contained" color="secondary" className=" w-full mt-16" type="submit">
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePasswordPage;

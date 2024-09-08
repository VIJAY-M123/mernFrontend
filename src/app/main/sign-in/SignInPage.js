import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import _ from '@lodash';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from 'app/store/fuse/loaderSlice';
import useAppIconText from 'src/app/hooks/useAppIconText';
import jwtService from '../../auth/services/jwtService';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  email: yup.string().required('You must enter a Username'),
  password: yup
    .string()
    .required('Please enter your password.')
    .min(4, 'Password is too short - must be at least 4 chars.'),
});

const defaultValues = {
  email: '',
  password: '',
  remember: true,
};

function SignInPage() {
  const dispatch = useDispatch();

  const { control, formState, handleSubmit, setError, setValue } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  function onSubmit({ email, password }) {
    dispatch(showLoader());
    jwtService
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        // No need to do anything, user data will be set at app/auth/AuthContext
      })
      .catch((message) => {
        dispatch(hideLoader());
        if (message.match(/exist/i)) {
          setError('email', {
            type: 'manual',
            message,
          });
          setError('password', {
            type: 'manual',
          });
        } else {
          setError('password', {
            type: 'manual',
            message,
          });
        }
      });
  }

  const icon = useAppIconText();
  const { REACT_APP_KEY: key } = process.env;

  return (
    <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-1 min-w-0">
      <Paper className="h-full sm:h-auto md:flex md:items-center md:justify-end w-full sm:w-auto md:h-full md:w-2/5 py-8 px-16 sm:p-48 md:p-64 sm:rounded-2xl md:rounded-none sm:shadow md:shadow-none ltr:border-r-1 rtl:border-l-1">
        <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
          <div className="w-full flex justify-center">
            <img
              className="w-[150px] h-[150px] "
              src={key === 'zealit' ? 'assets/images/image/logo.jpg' : icon}
              alt="logo"
            />
          </div>

          <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
            Sign in
          </Typography>
          <div className="flex items-baseline mt-2 font-medium">
            <Typography>Don't have an account?</Typography>
            <Link className="ml-4" to="/">
              Sign up
            </Link>
          </div>

          <form
            name="loginForm"
            noValidate
            className="flex flex-col justify-center w-full mt-32"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Username"
                  autoFocus
                  type="email"
                  error={!!errors.email}
                  helperText={errors?.email?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Password"
                  type="password"
                  error={!!errors.password}
                  helperText={errors?.password?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />

            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between">
              <Controller
                name="remember"
                control={control}
                render={({ field }) => (
                  <FormControl>
                    <FormControlLabel
                      label="Remember me"
                      control={<Checkbox size="small" {...field} />}
                    />
                  </FormControl>
                )}
              />

              <Link className="text-md font-medium" to="/">
                Forgot password?
              </Link>
            </div>

            <Button
              variant="contained"
              color="secondary"
              className=" w-full mt-16"
              aria-label="Sign in"
              disabled={_.isEmpty(dirtyFields) || !isValid}
              type="submit"
              size="large"
            >
              Sign in
            </Button>
          </form>
        </div>
      </Paper>

      <Box
        className="relative hidden md:flex flex-auto items-center justify-center h-full  lg:px-112 overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: 'url("assets/images/image/login-page.jpg")', // Notice the leading slash
          padding: '50px',
        }}
      >
        {/* <svg
          className="absolute inset-0 top-[-100px] pointer-events-none"
          viewBox="0 0 900 540"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Box
            component="g"
            sx={{ color: 'primary.light' }}
            className="opacity-20"
            fill="none"
            stroke="currentColor"
            strokeWidth="55"
          >
            <circle r="150" cx="196" cy="23" />
          </Box>
        </svg> */}

        {/* <svg
          className="absolute bottom-[-800px] right-[-600px] opacity-30"
          version="1.0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid meet"
        >
          <g
            transform="translate(0.000000,1182.000000) scale(0.100000,-0.100000)"
            fill="#64748b"
            stroke="none"
          >
            <path d="M3777 11129 c-226 -55 -297 -329 -126 -483 50 -45 131 -76 201 -76 27 0 46 -9 82 -41 62 -55 76 -48 76 35 0 60 3 67 39 111 39 47 57 85 40 85 -4 0 -14 -10 -20 -22 -6 -13 -27 -41 -45 -64 -28 -35 -33 -50 -36 -102 l-3 -62 -45 39 c-39 32 -54 39 -106 43 -153 14 -256 117 -258 258 -1 77 26 140 83 193 108 101 263 96 364 -12 53 -57 83 -139 73 -202 -7 -46 9 -53 19 -9 15 68 -16 160 -76 225 -64 69 -176 105 -262 84z" />
            <path d="M3755 11041 c-75 -35 -125 -111 -125 -190 0 -23 11 -60 28 -92 22 -43 38 -59 81 -81 34 -18 69 -28 96 -28 27 0 62 10 96 28 43 22 59 38 81 81 27 51 36 110 22 145 -12 32 -21 15 -16 -33 17 -186 -232 -275 -335 -120 -76 115 -7 266 129 285 62 9 112 -10 159 -58 22 -23 39 -34 39 -26 0 21 -59 75 -102 92 -49 21 -104 20 -153 -3z" />
            <path d="M3850 10985 c0 -13 25 -71 35 -83 5 -6 45 18 45 27 0 5 -9 7 -19 4 -15 -4 -23 3 -35 31 -16 38 -26 46 -26 21z" />
            <path d="M3780 10956 c0 -30 34 -87 48 -81 7 3 18 5 23 5 5 0 9 5 9 11 0 6 -9 9 -20 6 -15 -4 -22 2 -30 29 -12 37 -30 54 -30 30z" />
            <path d="M3710 10885 c0 -30 2 -55 5 -55 3 0 14 9 24 19 13 13 27 18 43 14 20 -5 18 0 -17 36 -21 22 -43 41 -47 41 -4 0 -8 -25 -8 -55z m35 6 c3 -5 1 -12 -5 -16 -5 -3 -10 1 -10 9 0 18 6 21 15 7z" />
            <path d="M3893 10853 c2 -10 8 -27 13 -37 7 -19 6 -19 -23 2 -28 20 -53 28 -53 18 0 -15 43 -96 52 -96 6 0 7 7 3 18 -4 9 -10 23 -13 31 -4 10 5 8 30 -7 19 -12 37 -19 41 -16 7 7 -36 103 -47 104 -4 0 -6 -8 -3 -17z" />
            <path d="M3780 10816 c0 -16 41 -96 50 -96 13 0 13 0 -10 54 -12 25 -25 46 -30 46 -6 0 -10 -2 -10 -4z" />
            <path d="M4145 10466 c-131 -56 -191 -87 -193 -99 -3 -16 140 -372 157 -389 6 -7 411 159 426 174 8 8 -151 380 -167 389 -7 5 -17 8 -23 8 -5 0 -95 -37 -200 -83z" />
            <path d="M3833 10245 c-83 -39 -93 -53 -117 -177 -17 -84 -15 -93 33 -205 36 -83 36 -83 16 -83 -18 0 -20 -30 -2 -53 11 -16 16 -15 64 8 36 16 51 28 47 38 -10 26 23 85 57 102 39 21 93 14 124 -15 l21 -20 97 41 c96 41 97 42 97 76 0 40 -1 40 -109 -9 -35 -16 -67 -25 -71 -21 -4 4 -35 76 -70 158 -69 165 -85 195 -103 194 -6 0 -45 -15 -84 -34z m98 -102 c11 -25 16 -50 12 -54 -18 -16 -157 -69 -164 -62 -7 7 13 120 22 126 21 13 78 36 92 36 12 1 24 -14 38 -46z" />
            <path d="M5575 10125 c-132 -11 -364 -42 -450 -60 -429 -91 -875 -244 -1155 -397 -41 -23 -100 -55 -130 -71 -123 -67 -145 -80 -204 -119 -33 -23 -92 -63 -131 -89 -264 -177 -646 -524 -822 -745 -26 -34 -69 -86 -94 -115 -57 -66 -222 -297 -268 -376 -73 -125 -185 -331 -221 -407 -85 -181 -100 -216 -143 -331 -178 -478 -264 -935 -271 -1440 -6 -434 43 -808 165 -1241 102 -365 272 -744 480 -1074 236 -371 518 -699 838 -970 36 -30 75 -64 87 -76 37 -33 321 -237 367 -262 23 -13 69 -41 102 -61 216 -137 563 -297 845 -391 323 -107 687 -180 1025 -205 206 -15 578 -10 735 10 25 3 81 10 125 16 213 27 470 82 675 145 63 20 131 40 150 46 82 24 327 125 469 194 297 144 556 306 816 513 153 121 431 393 551 536 32 39 63 75 70 80 23 20 186 246 263 367 72 111 281 485 281 501 0 4 18 45 40 91 47 101 69 152 80 186 5 14 29 83 54 154 46 129 130 435 146 531 5 27 18 104 29 170 50 290 65 720 37 1045 -72 825 -370 1586 -879 2240 -202 259 -462 520 -710 714 -120 93 -303 222 -367 259 -36 21 -99 58 -140 83 -93 56 -411 212 -505 248 -38 15 -90 36 -115 46 -251 103 -690 208 -1035 245 -198 22 -594 27 -790 10z m841 -370 c104 -13 196 -26 204 -29 8 -3 79 -19 157 -36 130 -27 200 -47 412 -116 294 -97 723 -318 977 -504 161 -118 455 -375 549 -480 23 -25 56 -61 74 -80 114 -120 379 -479 460 -624 66 -117 133 -247 179 -346 53 -115 167 -409 160 -415 -2 -2 -36 20 -76 49 -56 41 -84 55 -120 59 -26 3 -80 20 -121 37 -72 31 -74 31 -106 15 l-31 -18 -97 64 c-53 35 -97 69 -97 75 0 13 43 44 61 44 6 0 47 -25 90 -55 43 -30 83 -55 89 -55 5 0 9 14 8 32 -2 25 2 35 22 46 25 14 29 12 98 -38 40 -29 75 -50 78 -47 3 2 -12 60 -34 128 l-38 123 -88 65 -88 64 -85 -27 -85 -28 -71 48 c-71 49 -71 49 -82 109 -6 33 -14 66 -18 73 -9 13 -77 17 -77 5 0 -5 7 -46 15 -93 8 -47 15 -86 15 -87 0 -1 28 -23 63 -49 34 -26 66 -51 71 -55 11 -10 -60 -99 -78 -99 -7 0 -52 30 -100 66 -87 65 -87 66 -82 102 6 35 3 39 -48 82 -30 25 -57 51 -60 58 -7 16 24 82 38 82 6 -1 22 -7 36 -15 38 -22 46 -18 59 25 11 37 10 44 -10 71 -22 31 -204 159 -227 159 -13 0 -12 -10 9 -90 5 -19 9 -47 9 -61 0 -29 -46 -79 -73 -79 -18 0 -114 47 -121 59 -3 3 20 36 49 71 60 72 59 64 4 171 -32 62 -189 206 -240 219 -21 6 -104 24 -184 41 -80 16 -151 32 -158 35 -9 3 -29 -17 -52 -51 -21 -30 -43 -55 -49 -55 -6 0 -30 9 -53 20 -25 11 -45 15 -48 9 -4 -5 -10 -32 -14 -59 l-8 -51 64 -47 c71 -51 69 -45 44 -145 -8 -34 -7 -39 12 -47 12 -4 87 -35 166 -69 79 -34 148 -61 153 -61 10 0 -3 32 -72 173 -29 59 -50 110 -46 114 4 4 37 9 74 11 l67 3 91 -88 92 -88 7 -65 c6 -60 11 -69 53 -113 l47 -48 -24 -20 c-12 -10 -27 -16 -33 -13 -5 3 -16 3 -25 0 -13 -6 -10 -14 21 -45 34 -35 36 -41 24 -60 -11 -19 -9 -24 19 -53 l32 -31 46 38 c26 20 50 34 54 29 50 -56 109 -159 173 -304 43 -96 78 -180 78 -186 0 -6 -24 -30 -53 -53 -48 -36 -60 -41 -108 -41 -45 0 -69 8 -146 47 -51 26 -94 45 -96 43 -2 -3 -29 -40 -60 -82 -32 -43 -60 -78 -65 -78 -4 0 -20 10 -35 23 l-28 22 17 97 17 97 -57 76 c-31 41 -59 82 -62 89 -3 8 29 61 71 119 l76 105 -23 68 -23 68 -125 52 c-94 39 -128 50 -138 41 -8 -6 -27 -37 -43 -69 -16 -32 -36 -58 -44 -58 -23 0 -64 51 -109 134 -23 44 -47 81 -53 83 -5 2 -38 -33 -73 -78 l-63 -81 -89 4 -89 5 -35 -51 c-19 -28 -34 -56 -34 -62 0 -6 16 -32 35 -57 59 -77 43 -103 -50 -82 -127 28 -120 28 -148 -14 -24 -37 -25 -40 -9 -54 10 -9 67 -32 127 -52 l110 -36 23 27 c13 14 21 33 18 41 -15 39 -15 60 2 81 16 21 21 22 46 11 24 -11 27 -17 22 -44 -6 -29 -1 -37 53 -88 33 -32 61 -57 64 -57 2 0 18 7 36 16 37 19 86 7 118 -29 34 -36 37 -62 11 -92 l-23 -27 -55 21 c-30 11 -57 17 -61 13 -3 -4 -4 -24 -2 -44 5 -34 8 -38 33 -38 68 0 75 -10 98 -125 16 -78 19 -111 11 -123 -9 -13 1 -43 46 -137 55 -116 58 -126 82 -293 l25 -174 -26 -52 -27 -53 50 -130 c27 -71 56 -167 64 -213 l14 -82 -61 -80 c-80 -105 -81 -106 -76 -112 3 -2 40 -11 83 -19 l78 -15 27 35 c15 19 34 45 43 56 12 16 20 19 30 11 8 -6 82 -59 164 -119 83 -60 160 -118 173 -129 12 -11 49 -72 81 -136 l59 -115 -18 -115 c-16 -105 -40 -190 -65 -231 -6 -9 -39 -32 -75 -52 l-65 -36 -75 40 c-41 22 -80 46 -86 52 -6 7 -34 77 -63 157 -29 79 -56 150 -60 157 -5 10 -15 7 -41 -12 -41 -30 -46 -41 -55 -127 -11 -100 -10 -100 -120 -45 -52 26 -97 47 -99 47 -2 0 -52 -59 -111 -130 -60 -72 -113 -130 -119 -130 -6 0 -70 29 -142 66 -151 75 -138 54 -150 241 -5 85 -10 116 -23 126 -9 8 -59 33 -113 56 l-96 42 -67 -20 c-37 -12 -72 -18 -79 -13 -6 4 -46 36 -89 71 -64 53 -75 66 -67 82 20 36 12 45 -50 55 -59 10 -64 9 -186 -38 l-126 -48 -98 71 -99 70 -80 -35 c-57 -25 -92 -48 -118 -78 -21 -23 -52 -58 -69 -76 l-30 -34 -130 36 c-71 20 -132 36 -136 36 -4 0 -71 45 -148 101 l-141 101 -89 -37 -89 -37 -62 21 c-35 11 -69 21 -76 21 -7 0 -25 -26 -39 -57 -23 -54 -25 -67 -23 -199 l2 -142 -35 -58 c-19 -33 -53 -90 -76 -129 -22 -38 -58 -101 -81 -139 -23 -39 -39 -77 -37 -85 3 -9 15 -51 27 -93 l22 -76 90 -63 90 -62 -6 -71 c-6 -71 -6 -71 -64 -126 -32 -31 -73 -68 -92 -84 l-34 -28 3 -166 c6 -232 5 -238 -4 -319 l-8 -73 57 -107 c37 -71 76 -127 111 -163 30 -31 54 -60 54 -66 0 -5 -7 -19 -15 -31 l-15 -22 -46 19 c-25 11 -47 20 -50 20 -2 0 -11 -14 -19 -30 -13 -25 -14 -41 -5 -87 14 -80 15 -79 -35 -90 -41 -9 -48 -8 -87 18 -24 16 -45 29 -48 29 -11 0 -47 -69 -63 -120 -30 -94 -38 -99 -150 -107 -53 -3 -104 -11 -112 -17 -8 -6 -17 -24 -21 -41 -5 -29 -1 -33 86 -93 l91 -64 142 12 c162 13 158 12 253 56 40 18 105 47 145 64 41 18 82 40 92 50 11 10 51 71 90 136 l72 118 108 34 108 33 68 137 c55 113 70 136 86 134 11 -2 31 -5 45 -8 23 -4 43 20 215 258 l190 263 145 3 c127 2 150 0 192 -18 65 -28 76 -26 124 21 32 31 56 44 110 58 152 41 336 92 360 101 17 7 33 28 50 67 14 31 52 99 86 150 l60 93 -36 107 c-20 60 -36 114 -36 121 0 23 143 171 165 171 11 1 65 -29 120 -65 55 -35 109 -67 121 -70 11 -3 79 8 150 25 202 47 198 47 289 11 44 -18 97 -41 117 -51 21 -11 40 -19 42 -19 3 0 17 18 31 40 l25 40 55 -27 c51 -25 55 -30 50 -55 -5 -23 -2 -30 17 -37 13 -6 82 -34 155 -64 l131 -54 109 39 c59 22 113 45 120 52 6 6 13 32 16 59 2 26 6 49 8 51 2 2 83 31 179 66 l175 62 80 79 c44 43 85 79 90 79 12 -1 55 -36 55 -45 0 -4 -32 -42 -71 -85 -69 -76 -74 -80 -173 -116 -55 -20 -113 -43 -128 -51 -27 -13 -58 -59 -58 -85 0 -13 84 -58 108 -58 8 0 72 26 144 57 l130 58 90 122 c49 68 95 123 101 123 18 0 127 -19 147 -25 14 -4 30 12 70 67 29 40 57 78 63 83 26 27 -42 -222 -121 -440 -277 -762 -809 -1438 -1487 -1889 -762 -506 -1682 -732 -2580 -631 -71 8 -139 16 -150 19 -11 2 -40 7 -65 11 -422 65 -843 214 -1275 449 -176 96 -433 276 -605 424 -311 267 -640 658 -818 974 -11 18 -31 53 -45 78 -26 43 -135 263 -171 342 -144 320 -258 746 -301 1128 -16 143 -19 210 -9 210 3 0 26 -14 50 -32 24 -17 45 -29 47 -27 2 2 34 47 72 99 38 52 73 98 79 102 6 5 61 24 123 43 l112 35 87 121 c48 66 97 124 108 129 12 4 47 10 78 14 51 7 61 12 102 55 27 30 47 62 50 82 4 19 13 81 21 139 9 58 18 113 21 123 5 17 81 56 304 155 151 67 202 94 214 117 6 10 27 46 47 80 20 33 48 81 62 106 40 71 45 72 107 33 119 -76 144 -85 207 -75 65 10 71 8 150 -51 43 -33 53 -46 58 -81 4 -23 11 -49 15 -57 4 -8 58 -51 119 -95 67 -49 111 -87 111 -98 0 -15 111 -107 130 -107 18 0 508 112 530 121 14 5 42 36 64 67 21 31 61 90 89 130 50 71 51 73 35 100 -15 26 -15 30 9 80 13 28 28 52 33 52 5 0 24 -9 42 -19 l33 -20 49 42 49 43 -82 248 c-94 281 -93 239 -4 360 24 32 43 64 43 71 0 7 -22 60 -49 118 -41 87 -55 109 -83 123 -18 9 -65 39 -105 67 -62 45 -75 60 -104 120 -28 59 -47 81 -128 151 -168 144 -230 196 -236 196 -3 0 -33 -37 -66 -82 -34 -46 -62 -84 -64 -86 -2 -2 -77 26 -168 62 -113 45 -178 66 -208 66 -29 1 -52 8 -67 20 l-24 20 31 42 c17 23 31 48 31 55 0 7 -34 40 -76 73 l-77 61 -110 -4 -109 -4 -127 92 c-72 52 -126 98 -126 107 0 14 187 156 247 189 14 7 36 -4 99 -51 47 -35 88 -59 98 -56 9 3 41 10 72 16 51 10 62 17 109 70 28 33 57 60 63 60 12 0 47 -73 47 -98 0 -7 -17 -53 -37 -102 -20 -50 -34 -92 -32 -95 3 -2 50 4 104 14 85 16 103 23 123 47 81 96 66 89 211 102 l132 13 59 -43 c33 -24 59 -47 59 -53 0 -5 -25 -28 -56 -49 l-56 -39 -106 12 c-58 6 -121 11 -140 11 -31 0 -33 -2 -27 -27 6 -20 0 -36 -25 -71 l-32 -45 24 -45 c17 -33 34 -50 66 -64 38 -17 45 -17 78 -4 19 8 35 17 35 19 0 2 -23 18 -51 35 -45 29 -50 35 -47 63 l3 31 135 -1 c74 -1 153 -4 175 -7 32 -3 47 1 74 20 19 14 37 23 42 21 4 -3 13 -37 20 -76 l13 -71 51 -23 c29 -12 55 -28 59 -33 14 -23 19 -297 6 -351 l-12 -53 33 -35 c19 -19 72 -63 119 -98 76 -56 92 -64 145 -70 l60 -7 73 76 c64 66 75 83 84 130 l12 54 -59 66 c-48 56 -73 74 -142 106 -46 22 -88 40 -94 40 -5 0 -9 2 -9 4 0 5 40 100 44 103 2 2 20 -4 41 -12 20 -9 38 -15 40 -13 13 14 65 131 65 146 0 9 -29 47 -65 82 l-65 64 0 123 0 123 -52 54 c-29 30 -76 65 -103 79 -28 14 -61 34 -75 45 l-25 21 63 63 63 63 19 -25 c11 -14 30 -44 42 -67 13 -24 28 -43 33 -43 6 0 34 16 62 35 61 41 65 41 109 14 l33 -20 37 34 c36 33 37 34 30 89 -5 42 -19 75 -57 134 -39 62 -49 87 -49 121 0 23 6 45 13 50 46 30 592 23 863 -12z m-1291 -119 l-46 -65 42 -82 41 -83 -22 -18 c-25 -20 -16 -24 -143 66 l-97 69 1 46 c2 94 0 92 139 121 69 15 126 23 128 19 2 -5 -17 -37 -43 -73z m-975 -289 c0 -12 -54 -93 -86 -128 -16 -17 -18 -17 -55 13 -46 37 -45 37 48 89 73 41 93 46 93 26z m5225 -2275 c27 -21 51 -46 53 -56 2 -10 16 -29 30 -41 l26 -22 -23 -32 c-25 -35 -21 -36 -113 32 -59 43 -68 53 -68 81 0 30 23 76 38 76 4 0 29 -17 57 -38z m-80 -234 c47 -60 50 -78 13 -78 -21 0 -158 103 -158 119 0 5 9 20 21 35 l20 26 29 -22 c16 -12 50 -48 75 -80z m-1315 -82 c0 -39 -48 -43 -63 -4 -8 21 0 28 35 28 23 0 28 -4 28 -24z m749 8 c29 -11 45 -27 65 -63 30 -55 30 -54 -50 -94 l-52 -26 -26 37 c-14 21 -26 45 -26 54 0 19 37 108 44 108 3 0 23 -7 45 -16z m-559 -13 c0 -5 -9 -19 -19 -32 l-20 -24 -23 23 c-20 19 -21 24 -8 32 19 12 70 13 70 1z m162 -47 c81 -60 145 -176 109 -199 -18 -10 -96 29 -184 93 l-87 64 17 29 c11 18 26 29 40 29 12 0 25 5 28 10 10 17 25 12 77 -26z m-428 -19 c38 -14 71 -27 74 -30 2 -2 -5 -17 -17 -33 -31 -44 -65 -49 -113 -15 -50 34 -54 44 -33 77 10 14 18 26 19 26 0 0 32 -11 70 -25z m220 -29 l40 -33 -34 -46 c-18 -26 -36 -47 -40 -47 -13 0 -50 47 -61 78 -9 26 -8 37 5 57 22 33 43 31 90 -9z m162 -116 c44 -31 48 -39 58 -117 8 -56 -27 -133 -60 -133 -53 0 -54 3 -54 146 0 74 3 134 6 134 3 0 25 -14 50 -30z m-226 -61 c0 -9 7 -22 15 -29 18 -15 19 -31 3 -65 -14 -32 -21 -32 -73 6 -55 40 -68 92 -33 139 l22 30 33 -32 c18 -18 33 -39 33 -49z m1709 -934 c-13 -114 -23 -123 -29 -25 -4 63 -1 91 9 108 23 37 30 7 20 -83z" />
            <path d="M5792 9095 c-52 -47 -151 -98 -212 -109 -19 -3 -51 -2 -69 4 -19 5 -37 7 -40 5 -2 -3 -4 -29 -2 -58 1 -48 5 -55 49 -96 70 -65 151 -123 162 -116 6 4 22 29 36 57 l25 50 -25 33 c-32 41 -32 50 -5 69 17 12 40 14 104 9 80 -6 82 -5 103 22 35 44 29 84 -20 133 -22 23 -44 42 -48 42 -5 0 -31 -20 -58 -45z" />
            <path d="M5806 8888 c-22 -31 -20 -61 10 -151 20 -60 33 -83 60 -103 29 -23 36 -25 51 -13 27 23 43 75 43 141 -1 54 -5 68 -28 95 -46 54 -110 68 -136 31z" />
            <path d="M7220 7309 c0 -11 10 -29 21 -38 18 -15 20 -21 10 -39 -35 -66 56 -136 117 -89 19 15 15 24 -28 54 -36 25 -40 32 -36 60 4 26 0 37 -21 53 -34 27 -63 26 -63 -1z" />
            <path d="M7429 7093 c-9 -2 -21 -15 -27 -28 -10 -21 -8 -27 15 -45 32 -25 40 -25 53 0 25 47 3 86 -41 73z" />
            <path d="M4483 10086 l-73 -32 31 -23 31 -23 64 27 c73 31 79 37 64 65 -14 26 -31 24 -117 -14z" />
            <path d="M4322 10010 c-30 -28 -36 -62 -18 -98 17 -32 34 -42 72 -42 38 0 61 16 73 50 27 78 -68 145 -127 90z m74 -28 c17 -11 22 -35 12 -54 -12 -24 -55 -23 -68 2 -20 38 20 76 56 52z" />
            <path d="M3921 9834 c-35 -45 -26 -95 20 -119 40 -21 66 -19 94 10 53 52 18 135 -57 135 -28 0 -42 -7 -57 -26z m89 -29 c26 -32 -13 -81 -47 -59 -35 22 -23 74 17 74 10 0 23 -7 30 -15z" />
          </g>
        </svg> */}

        {/* <Box
          component="svg"
          className="absolute -top-64 -right-64 opacity-20"
          sx={{ color: 'primary.light' }}
          viewBox="0 0 220 192"
          width="220px"
          height="192px"
          fill="none"
        >
          <defs>
            <pattern
              id="837c3e70-6c3a-44e6-8854-cc48c737b659"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect x="0" y="0" width="4" height="4" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="220" height="192" fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)" />
        </Box> */}

        {/* <div className="z-10 relative w-full max-w-2xl">
          <div className="text-7xl font-bold leading-none text-gray-100">
            <div>Shal Xpress</div>
            <div>Logistics</div>
          </div>
          <div className="mt-24 w-2/6 tracking-tight leading-6 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 181 32"
              preserveAspectRatio="xMidYMid meet"
            >
              <g
                transform="translate(0.000000,32.000000) scale(0.100000,-0.100000)"
                fill="#fff"
                stroke="none"
              >
                <path d="M140 277 c-43 -15 -70 -61 -48 -83 7 -8 33 -20 58 -27 24 -7 45 -18 47 -24 5 -14 -46 -26 -104 -25 -29 0 -43 -5 -48 -16 -8 -20 12 -32 55 -32 133 0 176 89 58 120 -42 12 -48 24 -19 40 26 14 74 13 65 -1 -3 -6 8 -3 26 6 70 36 -5 72 -90 42z" />
                <path d="M1120 235 c-14 -22 -32 -52 -39 -67 -8 -16 -19 -28 -24 -28 -6 0 -18 -7 -28 -16 -16 -15 -17 -13 -12 25 5 38 4 41 -19 41 -25 0 -60 -31 -71 -62 -3 -9 2 -26 11 -37 17 -20 17 -20 57 -1 42 20 53 14 36 -19 -18 -33 -14 -71 8 -71 20 0 61 43 61 65 0 6 11 22 25 35 28 27 25 42 -4 16 -15 -14 -20 -14 -29 -3 -9 10 -3 25 24 64 23 33 34 60 32 75 -3 21 -5 20 -28 -17z m-137 -107 c-5 -27 -33 -40 -33 -16 0 11 31 51 36 46 1 -2 0 -15 -3 -30z m97 -61 c0 -20 -26 -52 -33 -40 -10 15 4 53 19 53 8 0 14 -6 14 -13z" />
                <path d="M631 226 c-10 -12 -6 -26 10 -26 11 0 19 29 10 35 -5 2 -14 -1 -20 -9z" />
                <path d="M1295 222 c-58 -33 -58 -34 -44 -43 11 -6 10 -12 -5 -28 -19 -21 -19 -72 0 -78 6 -2 34 14 62 37 28 22 53 40 56 40 2 0 -1 -13 -7 -30 -9 -23 -8 -33 1 -42 9 -9 17 -7 37 12 21 20 25 21 31 6 8 -21 23 -20 46 1 16 15 18 15 13 1 -10 -24 13 -32 41 -13 22 14 26 14 40 0 22 -21 38 -19 73 11 l31 26 0 -26 c0 -16 6 -26 14 -26 17 0 79 50 71 58 -2 3 -14 -3 -25 -13 -11 -10 -23 -15 -26 -12 -14 13 8 57 33 69 19 9 28 22 30 41 l2 27 -32 -17 c-55 -31 -60 -35 -45 -45 10 -6 4 -17 -24 -43 -39 -36 -74 -50 -45 -17 18 20 23 82 7 82 -5 0 -28 -20 -51 -45 -51 -55 -81 -62 -50 -11 35 55 24 63 -24 16 -46 -45 -77 -50 -35 -5 13 14 21 28 18 31 -10 9 -46 -15 -53 -35 -7 -25 -55 -57 -55 -38 0 7 7 23 16 35 18 26 13 38 -21 44 -27 6 -55 -17 -55 -45 0 -18 -47 -54 -57 -44 -11 11 17 62 40 72 14 6 22 20 24 38 1 15 1 27 0 26 -1 0 -15 -8 -32 -17z m311 -97 c-3 -9 -12 -12 -21 -9 -14 6 -14 9 2 26 18 20 30 10 19 -17z" />
                <path d="M300 193 c-31 -11 -60 -47 -60 -74 0 -58 49 -58 104 0 39 41 61 42 38 1 -13 -23 -14 -32 -5 -41 10 -10 19 -8 43 9 23 17 30 19 30 8 0 -23 19 -29 43 -14 35 23 67 28 74 12 7 -18 34 -18 58 0 16 12 21 11 36 -7 16 -20 17 -20 44 -3 25 16 28 16 44 2 22 -20 56 -10 86 25 l20 23 -28 -18 c-27 -17 -57 -16 -57 1 0 5 13 14 30 20 33 12 48 39 32 55 -14 14 -70 -17 -84 -46 -14 -32 -54 -54 -70 -38 -14 14 -4 27 34 46 28 14 37 46 12 46 -10 0 -36 -20 -60 -45 -23 -25 -49 -45 -58 -45 -21 0 -20 5 6 40 12 16 18 33 14 37 -11 11 -39 -10 -54 -40 -7 -15 -20 -27 -28 -27 -12 0 -12 4 2 25 9 14 14 28 11 32 -9 8 -35 -15 -50 -45 -13 -27 -37 -41 -37 -22 0 7 9 24 21 38 36 46 0 38 -41 -9 -42 -48 -67 -47 -31 1 25 34 22 46 -13 52 -31 6 -56 -8 -56 -32 0 -20 -44 -60 -66 -60 -25 0 -14 25 19 41 45 22 43 68 -3 52z m15 -23 c-3 -5 -16 -15 -28 -21 -22 -12 -22 -12 -3 10 19 21 43 30 31 11z m489 -15 c-29 -22 -42 -17 -15 6 13 11 26 17 29 14 3 -3 -3 -12 -14 -20z" />
              </g>
            </svg>
          </div>
        </div> */}
        <div className="z-10 relative w-full max-w-2xl">
          {/* <Typography
            className="flex justify-end underline decoration-1 font-bold "
            onClick={() => {
              window.open('https://support.aggrandizeventure.com/portal/en/home', '_blank');
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === 'Space') {
                window.open('https://support.aggrandizeventure.com/portal/en/home', '_blank');
              }
            }}
            role="button"
            tabIndex="0"
          >
            <img className="w-20 mr-3" src="assets/images/login-image/help.png" alt="logo" />
            Free launching Help Desk...
          </Typography> */}
          {/* <img className="w-2/5 mt-[70px]" src="assets/images/logo/modifiedlogo.png" alt="logo" /> */}
          {/* <Typography className="text-xl text-gray-700 mt-8">
            With the suite of products Aggrandize offer
          </Typography> */}
          {/* <div className="flex flex-row justify-between mt-[50px]">
            <div
              className="h-[100px] w-[100px] bg-[#EEF4FC] flex flex-col justify-center items-center p-14 rounded-md"
              onClick={() => {
                window.open('http://online.shal.asia/', '_blank');
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === 'Space') {
                  window.open('http://online.shal.asia/', '_blank');
                }
              }}
              role="button"
              tabIndex="0"
            >
              <img className="w-4/5" src="assets/images/login-image/cargo-ship.png" alt="logo" />
              <Typography>NVOCC</Typography>
            </div>
            <div
              className="h-[100px] w-[100px] bg-[#EEF4FC] flex flex-col justify-center items-center p-14 rounded-md"
              onClick={() => {
                window.open('http://online.shal.asia/account/agentlogin', '_blank');
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === 'Space') {
                  window.open('http://online.shal.asia/account/agentlogin', '_blank');
                }
              }}
              role="button"
              tabIndex="0"
            >
              <img
                className="w-4/5"
                src="assets/images/login-image/technical-support.png"
                alt="logo"
              />
              <Typography>Agency</Typography>
            </div>
            <div className="h-[100px] w-[100px] bg-[#EEF4FC] flex flex-col justify-center items-center p-14 rounded-md">
              <img
                className="w-4/5"
                src="assets/images/login-image/Freight-forwarding.png"
                alt="logo"
              />
              <Typography>Sea</Typography>
              <Typography>Freight</Typography>
            </div>
            <div className="h-[100px] w-[100px] bg-[#EEF4FC] flex flex-col justify-center items-center p-14 rounded-md">
              <img className="w-4/5" src="assets/images/login-image/air-plane.png" alt="logo" />
              <Typography>Air Freight</Typography>
            </div>
            <div
              className="h-[100px] w-[100px] bg-[#EEF4FC] flex flex-col justify-center items-center p-14 rounded-md"
              onClick={() => {
                window.open('https://portal.shalx.asia/', '_blank');
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === 'Space') {
                  window.open('https://portal.shalx.asia/', '_blank');
                }
              }}
              role="button"
              tabIndex="0"
            >
              <img className="w-4/5" src="assets/images/login-image/Transport.png" alt="logo" />
              <Typography>Transport</Typography>
            </div>
          </div>
          <div className="flex flex-row justify-between mt-28">
            <div
              className="h-[100px] w-[100px] bg-[#EEF4FC] flex flex-col justify-center items-center p-14 rounded-md"
              onClick={() => {
                window.open('https://depo.shal.asia/', '_blank');
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === 'Space') {
                  window.open('https://depo.shal.asia/', '_blank');
                }
              }}
              role="button"
              tabIndex="0"
            >
              <img className="w-4/5" src="assets/images/login-image/Depot.png" alt="logo" />
              <Typography>Depot</Typography>
            </div>
            <div
              className="h-[100px] w-[100px] bg-[#EEF4FC] flex flex-col justify-center items-center p-14 rounded-md"
              onClick={() => {
                window.open('https://portal.shalx.asia/', '_blank');
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === 'Space') {
                  window.open('https://portal.shalx.asia/', '_blank');
                }
              }}
              role="button"
              tabIndex="0"
            >
              <img className="w-4/5" src="assets/images/login-image/warehouse.png" alt="logo" />
              <Typography>Warehouse</Typography>
            </div>
            <div className="h-[100px] w-[100px] bg-[#EEF4FC] flex flex-col justify-center items-center p-14 rounded-md">
              <img className="w-3/5" src="assets/images/login-image/store.png" alt="logo" />
              <Typography>Store</Typography>
              <Typography>Management</Typography>
            </div>
            <div
              className="h-[100px] w-[100px] bg-[#EEF4FC] flex flex-col justify-center items-center p-14 rounded-md"
              onClick={() => {
                window.open('http://crm.aggrandizeventure.com/', '_blank');
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === 'Space') {
                  window.open('http://crm.aggrandizeventure.com/', '_blank');
                }
              }}
              role="button"
              tabIndex="0"
            >
              <img className="w-4/5" src="assets/images/login-image/crm.png" alt="logo" />
              <Typography>CRM</Typography>
            </div>
            <div
              className="h-[100px] w-[100px] bg-[#EEF4FC] flex flex-col justify-center items-center p-14 rounded-md"
              onClick={() => {
                window.open('http://hrms.shal.asia/', '_blank');
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === 'Space') {
                  window.open('http://hrms.shal.asia/', '_blank');
                }
              }}
              role="button"
              tabIndex="0"
            >
              <img
                className="w-4/5"
                src="assets/images/login-image/human-resources.png"
                alt="logo"
              />
              <Typography>HRMS</Typography>
            </div>
          </div>
          <Typography className="text-2xl text-black font-bold mt-[100px]">Updates:</Typography>
          <Typography className="text-base text-gray-700">
            Please be informed that we will release the updated versions every two weeks. If you
            have any enquiries, Please contact our support team.
          </Typography> */}
          {/* <div className="mt-24 w-2/6 tracking-tight leading-6 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 181 32"
              preserveAspectRatio="xMidYMid meet"
            >
              <g
                transform="translate(0.000000,32.000000) scale(0.100000,-0.100000)"
                fill="#fff"
                stroke="none"
              >
                <path d="M140 277 c-43 -15 -70 -61 -48 -83 7 -8 33 -20 58 -27 24 -7 45 -18 47 -24 5 -14 -46 -26 -104 -25 -29 0 -43 -5 -48 -16 -8 -20 12 -32 55 -32 133 0 176 89 58 120 -42 12 -48 24 -19 40 26 14 74 13 65 -1 -3 -6 8 -3 26 6 70 36 -5 72 -90 42z" />
                <path d="M1120 235 c-14 -22 -32 -52 -39 -67 -8 -16 -19 -28 -24 -28 -6 0 -18 -7 -28 -16 -16 -15 -17 -13 -12 25 5 38 4 41 -19 41 -25 0 -60 -31 -71 -62 -3 -9 2 -26 11 -37 17 -20 17 -20 57 -1 42 20 53 14 36 -19 -18 -33 -14 -71 8 -71 20 0 61 43 61 65 0 6 11 22 25 35 28 27 25 42 -4 16 -15 -14 -20 -14 -29 -3 -9 10 -3 25 24 64 23 33 34 60 32 75 -3 21 -5 20 -28 -17z m-137 -107 c-5 -27 -33 -40 -33 -16 0 11 31 51 36 46 1 -2 0 -15 -3 -30z m97 -61 c0 -20 -26 -52 -33 -40 -10 15 4 53 19 53 8 0 14 -6 14 -13z" />
                <path d="M631 226 c-10 -12 -6 -26 10 -26 11 0 19 29 10 35 -5 2 -14 -1 -20 -9z" />
                <path d="M1295 222 c-58 -33 -58 -34 -44 -43 11 -6 10 -12 -5 -28 -19 -21 -19 -72 0 -78 6 -2 34 14 62 37 28 22 53 40 56 40 2 0 -1 -13 -7 -30 -9 -23 -8 -33 1 -42 9 -9 17 -7 37 12 21 20 25 21 31 6 8 -21 23 -20 46 1 16 15 18 15 13 1 -10 -24 13 -32 41 -13 22 14 26 14 40 0 22 -21 38 -19 73 11 l31 26 0 -26 c0 -16 6 -26 14 -26 17 0 79 50 71 58 -2 3 -14 -3 -25 -13 -11 -10 -23 -15 -26 -12 -14 13 8 57 33 69 19 9 28 22 30 41 l2 27 -32 -17 c-55 -31 -60 -35 -45 -45 10 -6 4 -17 -24 -43 -39 -36 -74 -50 -45 -17 18 20 23 82 7 82 -5 0 -28 -20 -51 -45 -51 -55 -81 -62 -50 -11 35 55 24 63 -24 16 -46 -45 -77 -50 -35 -5 13 14 21 28 18 31 -10 9 -46 -15 -53 -35 -7 -25 -55 -57 -55 -38 0 7 7 23 16 35 18 26 13 38 -21 44 -27 6 -55 -17 -55 -45 0 -18 -47 -54 -57 -44 -11 11 17 62 40 72 14 6 22 20 24 38 1 15 1 27 0 26 -1 0 -15 -8 -32 -17z m311 -97 c-3 -9 -12 -12 -21 -9 -14 6 -14 9 2 26 18 20 30 10 19 -17z" />
                <path d="M300 193 c-31 -11 -60 -47 -60 -74 0 -58 49 -58 104 0 39 41 61 42 38 1 -13 -23 -14 -32 -5 -41 10 -10 19 -8 43 9 23 17 30 19 30 8 0 -23 19 -29 43 -14 35 23 67 28 74 12 7 -18 34 -18 58 0 16 12 21 11 36 -7 16 -20 17 -20 44 -3 25 16 28 16 44 2 22 -20 56 -10 86 25 l20 23 -28 -18 c-27 -17 -57 -16 -57 1 0 5 13 14 30 20 33 12 48 39 32 55 -14 14 -70 -17 -84 -46 -14 -32 -54 -54 -70 -38 -14 14 -4 27 34 46 28 14 37 46 12 46 -10 0 -36 -20 -60 -45 -23 -25 -49 -45 -58 -45 -21 0 -20 5 6 40 12 16 18 33 14 37 -11 11 -39 -10 -54 -40 -7 -15 -20 -27 -28 -27 -12 0 -12 4 2 25 9 14 14 28 11 32 -9 8 -35 -15 -50 -45 -13 -27 -37 -41 -37 -22 0 7 9 24 21 38 36 46 0 38 -41 -9 -42 -48 -67 -47 -31 1 25 34 22 46 -13 52 -31 6 -56 -8 -56 -32 0 -20 -44 -60 -66 -60 -25 0 -14 25 19 41 45 22 43 68 -3 52z m15 -23 c-3 -5 -16 -15 -28 -21 -22 -12 -22 -12 -3 10 19 21 43 30 31 11z m489 -15 c-29 -22 -42 -17 -15 6 13 11 26 17 29 14 3 -3 -3 -12 -14 -20z" />
              </g>
            </svg>
          </div> */}
        </div>
      </Box>
    </div>
  );
}

export default SignInPage;

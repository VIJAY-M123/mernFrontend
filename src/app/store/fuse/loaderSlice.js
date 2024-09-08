import { createSlice } from '@reduxjs/toolkit';

const loaderSlice = createSlice({
  name: 'loader',
  initialState: {
    state: false,
  },
  reducers: {
    showLoader: (state, action) => {
      state.state = true;
    },
    hideLoader: (state, action) => {
      state.state = false;
    },
  },
});

export const { showLoader, hideLoader } = loaderSlice.actions;

export const selectFuseLoader = ({ fuse }) => fuse.loader.state;

export default loaderSlice.reducer;

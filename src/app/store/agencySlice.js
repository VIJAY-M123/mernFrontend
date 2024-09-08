import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  state: null,
  list: [],
  module: [],
};

const agencySlice = createSlice({
  name: 'agency',
  initialState,
  reducers: {
    setAgency: (state, action) => {
      state.state = action.payload;
    },
    setAgencyList: (state, action) => {
      state.list = action.payload;
    },
    setModule: (state, action) => {
      state.module = action.payload;
    },
    setInitialAgency: (state) => {
      state = initialState;
    },
  },
});

export const { setAgency, setAgencyList, setModule, setInitialAgency } = agencySlice.actions;

export const selectAgency = ({ agency }) => agency.state;

export const selectAgencyList = ({ agency }) => agency.list;

export const selectModule = ({ agency }) => agency.module;

export default agencySlice.reducer;

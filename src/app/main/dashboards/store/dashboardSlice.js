import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filterData: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setfilterData: (state, { payload }) => {
      state.filterData = payload;
    },

    setInitialDashboard: (state) => initialState,
  },
});

export const { setfilterData, setInitialDashboard } = dashboardSlice.actions;

export const selectFilterData = ({ dashboard }) => dashboard.dashboard.filterData;

export default dashboardSlice.reducer;

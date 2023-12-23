import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'activeUser',
  initialState: {
    getLoggedInUserDetails: [],
    Theme: '',
    Device: '',
  },
  reducers: {
    loginUser: (state, action) => {
      state.getLoggedInUserDetails = action.payload;
    },
    setTheme: (state, action) => {
      state.Theme = action.payload;
    },
    Device: (state, action) => {
      state.Device = action.payload;
    },
  },
});

export const {
  loginUser,
  setTheme,
  Device,
} = userSlice.actions;

export default userSlice.reducer;

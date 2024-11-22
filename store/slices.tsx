import { createSlice } from '@reduxjs/toolkit';

const adminSlice = createSlice({
  name: 'admin',
  initialState: { menuCollapsed: false },
  reducers: {
    toggleMenu(state) {
      state.menuCollapsed = !state.menuCollapsed;
    },
  },
});

import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, payload) => {
      return payload.payload.user;
    },
    refresh: (state, payload) => {
      return payload.payload.user;
    },
    resetUser: (state) => {
      return initialState;
    },
  },
});

export const { login, refresh, resetUser } = userSlice.actions;
export default userSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  onlineUsers: 0,
  parties: [],
};

export const serverSlice = createSlice({
  name: "server",
  initialState,
  reducers: {
    updateUser: (state, payload) => {
      state.onlineUsers = payload.payload.onlineUsers;
    },
    updateParties: (state, payload) => {
      state.parties = payload.payload.parties;
    },

    resetServer: (state) => {
      return initialState;
    },
  },
});

export const { updateUser, updateParties, resetServer } = serverSlice.actions;
export default serverSlice.reducer;

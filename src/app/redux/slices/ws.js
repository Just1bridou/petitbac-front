import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  uuid: null,
};

export const wsSlice = createSlice({
  name: "ws",
  initialState,
  reducers: {
    connect: (state, payload) => {
      state.uuid = payload.payload;
    },
    resetWs: (state) => {
      return initialState;
    },
  },
});

export const { connect, resetWs } = wsSlice.actions;
export default wsSlice.reducer;

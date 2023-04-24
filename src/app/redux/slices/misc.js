import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const miscSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {
    updateSeeTotalScore: (state, payload) => {
      state.canSeeTotalScore = payload.payload;
    },
    resetMisc: (state) => {
      return initialState;
    },
  },
});

export const { updateSeeTotalScore, resetMisc } = miscSlice.actions;
export default miscSlice.reducer;

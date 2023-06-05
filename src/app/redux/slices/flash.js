import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const flashSlice = createSlice({
  name: "flash",
  initialState,
  reducers: {
    createFlash: (state, payload) => {
      return payload.payload;
    },
    updateThemeWords: (state, payload) => {
      let { themeIndex, words } = payload.payload;
      state.themes[themeIndex].words = words;
      return state;
    },
    updateFlash(state, payload) {
      console.log(payload.payload);
      return payload.payload;
    },
    updateFlashActualScore: (state, payload) => {
      state.actualScore = payload.payload;
      return state;
    },
    updateFlashIndex: (state, payload) => {
      state.index = payload.payload;
      return state;
    },
    updateFlashFinish: (state, payload) => {
      state.finish = payload.payload;
      return state;
    },
    resetFlash: (state) => {
      return initialState;
    },
  },
});

export const {
  createFlash,
  updateThemeWords,
  updateFlash,
  updateFlashActualScore,
  updateFlashFinish,
  updateFlashIndex,
  resetFlash,
} = flashSlice.actions;
export default flashSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const partySlice = createSlice({
  name: "party",
  initialState,
  reducers: {
    createParty: (state, payload) => {
      return payload.payload.party;
    },
    refreshParty: (state, payload) => {
      return payload.payload.party;
    },
    resetParty: (state) => {
      return initialState;
    },
    refreshPartyChat: (state, payload) => {
      state.chat = payload.payload.chat;
    },
  },
});

export const { createParty, refreshParty, resetParty, refreshPartyChat } =
  partySlice.actions;
export default partySlice.reducer;

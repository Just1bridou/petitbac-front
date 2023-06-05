import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	open: false,
	message: "",
	type: "info"
};

export const snackBar = initialState;

const slice = createSlice({
	name: "snackBar",
	initialState,
	reducers: {
		display: (state, action) => {
			let { message, type, validation } = action.payload;
			state.open = true;
			state.message = message;
			state.type = type;
			if (validation) {
				state.validation = validation;
			}
		},
		hide: state => {
			state.open = false;
			if (state.validation) {
				delete state.validation;
			}
		}
	}
});

export const { display, hide } = slice.actions;

export default slice.reducer;

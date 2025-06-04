import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	subjects: [],
};

const subjectSlice = createSlice({
	name: "subject",
	initialState,
	reducers: {
		setSubjects: (state, action) => {
			state.subjects = action.payload;
		},
	},
});

export const { setSubjects } = subjectSlice.actions;
export default subjectSlice.reducer;

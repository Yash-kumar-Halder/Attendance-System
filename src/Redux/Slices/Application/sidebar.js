import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	collapse: false,
};

const sidebarSlice = createSlice({
	name: "sidebar",
	initialState,
	reducers: {
		toggleCollapse: (state) => {
			state.collapse = !state.collapse;
		},
	},
});

export const { toggleCollapse } = sidebarSlice.actions;
export default sidebarSlice.reducer;

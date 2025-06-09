// src/features/attendance/attendanceSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	attendance: [],
	totalClasses: [],
};

export const attendanceSlice = createSlice({
	name: "attendance", // 👈 match this with the feature
	initialState,
	reducers: {
		setData: (state, action) => {
			state.attendance = action.payload.attendance;
			state.totalClasses = action.payload.totalClasses;
		},
	},
});

export const { setData } = attendanceSlice.actions;

export default attendanceSlice.reducer;

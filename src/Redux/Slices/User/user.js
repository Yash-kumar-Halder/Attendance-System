// src/features/auth/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	user: null,
	email: null,
	regNo: null,
	role: "",
	accessToken: null,
	isAuthenticated: false,
	loading: false,
	error: null,
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		loginSuccess: (state, action) => {
			state.user = action.payload.name;
			state.email = action.payload.email;
			state.regNo = action.payload.regNo;
			state.role = action.payload.role || "user";
			state.accessToken = action.payload.accessToken;
			state.isAuthenticated = true;
			state.loading = false;
			state.error = null;
		},
		refreshAccessToken: (state, action) => {
			state.accessToken = action.payload; // just update token
		},
		logout: (state) => {
			state.user = null;
			state.email = null;
			state.regNo = null;
			state.role = "";
			state.accessToken = null;
			state.isAuthenticated = false;
			state.loading = false;
			state.error = null;
		},
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		setError: (state, action) => {
			state.error = action.payload;
			state.loading = false;
		},
	},
});

export const {
	loginSuccess,
	refreshAccessToken,
	logout,
	setLoading,
	setError,
} = userSlice.actions;

export default userSlice.reducer;

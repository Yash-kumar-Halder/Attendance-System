import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	user: null,
	email: null,
	regNo: null,
	role: "user",
	accessToken: null,
	isAuthenticated: false,
	loading: false,
	error: null,
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload.name;
			state.email = action.payload.email;
			state.accessToken = action.payload.accessToken;
			state.isAuthenticated = true;
			state.loading = false;
			state.error = null;
		},
		clearUser: (state) => {
			console.log("Clearing user state");
			state.user = null;
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

export const { setUser, clearUser, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;

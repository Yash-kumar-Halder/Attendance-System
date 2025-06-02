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
		setUser: (state, action) => {
			state.user = action.payload.name;
			state.email = action.payload.email;
			state.regNo = action.payload.regNo;
			state.role = action.payload.role || "user"; // Default to 'user' if role is not provided
			state.accessToken = action.payload.accessToken;
			state.isAuthenticated = true;
			state.loading = false;
			state.error = null;
		},
		clearUser: (state) => {
			console.log("Clearing user state");
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

export const { setUser, clearUser, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;

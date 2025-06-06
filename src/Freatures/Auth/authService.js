// src/features/auth/authService.js
import axios from "axios";
import { store } from "../../Redux/store.js";
import { loginSuccess, logout } from "../../Redux/Slices/User/user.js";

const instance = axios.create({
	baseURL: "http://localhost:8000/api/v1",
	withCredentials: true, // needed for sending/receiving cookies
});

// Auto-refresh access token on 401 error
instance.interceptors.response.use(
	(res) => res,
	async (err) => {
		const originalRequest = err.config;
		if (err.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			try {
				const refreshRes = await axios.get("http://localhost:8000/api/v1/auth/refresh-token", {
					withCredentials: true,
				});
				const newAccessToken = refreshRes.data.accessToken;

				const user = store.getState().user.user;
				store.dispatch(loginSuccess({ ...user, token: newAccessToken }));

				originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
				return instance(originalRequest);
			} catch (refreshErr) {
				store.dispatch(logout());
				window.location.href = "/login";
				return Promise.reject(refreshErr);
			}
		}
		return Promise.reject(err);
	}
);

// ✅ LOGIN API
export const loginUser = async (loginData) => {
	const res = await instance.post("/auth/login", loginData);
	return res.data;
};

// ✅ REGISTER API
export const registerUser = async (registerData) => {
	const res = await instance.post("/auth/register", registerData);
	return res.data;
};

export default instance;

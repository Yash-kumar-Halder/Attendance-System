import axios from "axios";

export const refreshTokenAndRetry = async (method, route, data = null) => {
	try {
		// Step 1: Refresh access token
		const response = await axios.get(
			"http://localhost:8000/api/v1/auth/refresh-token",
			{ withCredentials: true }
		);

		const newAccessToken = response.data.accessToken;
		localStorage.setItem("accessToken", newAccessToken); // optional but useful

		// Step 2: Create config
		const config = {
			headers: {
				Authorization: `Bearer ${newAccessToken}`,
				"Content-Type": "application/json", // default safe header
			},
		};

		// Step 3: Retry original request
		const methodName = method.toLowerCase();

		if (["get", "delete"].includes(methodName)) {
			return axios[methodName](route, config);
		} else {
			return axios[methodName](route, data, config);
		}
	} catch (err) {
		console.error("Refresh token expired or invalid:", err);
		logoutUser(); // handle logout/redirect to login
	}
};

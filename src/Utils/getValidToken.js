import axios from "axios";

export const getValidToken = async () => {
	let token = localStorage.getItem("accessToken");
	try {
		// Try a dummy request to check token validity
		await axios.get("http://localhost:8000/api/v1/subject/get", {
			headers: { Authorization: `Bearer ${token}` },
			withCredentials: true,
		});
		return token;
	} catch (error) {
		if (error.response?.status === 401 || error.response?.status === 403) {
			// Refresh token
			try {
				const refreshResponse = await axios.get(
					"http://localhost:8000/api/v1/auth/refresh-token",
					{ withCredentials: true }
				);
				const newToken = refreshResponse.data.accessToken;
				localStorage.setItem("accessToken", newToken);
				return newToken;
			} catch (refreshError) {
				// Handle refresh token failure - logout or notify user here if needed
				toast.error("Session expired. Please login again.");
				throw refreshError;
			}
		}
		throw error;
	}
};

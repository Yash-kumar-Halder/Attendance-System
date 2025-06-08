import axios from "axios";
import { getValidToken } from "./getValidToken";
import { toast } from "sonner";

export const fetchSubjects = async (user) => {
	try {
		const token = await getValidToken();
		let response;

		if (user.role === "student") {
			response = await axios.get(
				"http://localhost:8000/api/v1/subject/student/get",
				{
					headers: { Authorization: `Bearer ${token}` },
					withCredentials: true,
				}
			);
		} else {
			response = await axios.get(
				"http://localhost:8000/api/v1/subject/get",
				{
					headers: { Authorization: `Bearer ${token}` },
					withCredentials: true,
				}
			);
		}

		if (response.data.success) {
			return response.data.subjects;
		} else {
			toast.error("Failed to fetch subjects");
			return [];
		}
	} catch (error) {
		console.error("Failed to fetch subjects", error);
		toast.error("Failed to fetch subjects");
		return [];
	}
};

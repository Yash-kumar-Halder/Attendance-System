// hooks/useTeacherRoute.js
import { useAppSelector } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const useTeacherRoute = () => {
	const navigate = useNavigate();
	const user = useAppSelector((state) => state.user);

	useEffect(() => {
		if (!user.role || user.role !== "teacher") {
			navigate("/");
		}
	}, [user, navigate]);
};

export const userAuthRoute = () => {
	const navigate = useNavigate();
	const user = useAppSelector((state) => state.user);

	useEffect(() => {
		if (!user.role || !user.accessToken) {
			navigate("/");
		}
	}, [user, navigate]);
};

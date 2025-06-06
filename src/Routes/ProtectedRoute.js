// src/routes/ProtectedRoute.jsx
import { useAppSelector } from "@/hooks";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
	const { user } = useAppSelector((state) => state.user);

	if (!user || !allowedRoles.includes(user.role)) {
		return <Navigate to="/login" replace />;
	}

	return children;
};

export default ProtectedRoute;

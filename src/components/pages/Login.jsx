import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../hooks/index.js";
import { loginSuccess } from "@/Redux/Slices/User/user.js";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner.jsx";
import { loginUser } from "@/Freatures/Auth/authService.js";
const Login = () => {

    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    const navigate = useNavigate();
    const [data, setData] = useState({
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value
        });
    }

    const loginHandler = async (e) => {
        e.preventDefault();

        try {
            const responseData = await loginUser(data); // ✅ uses instance with baseURL & credentials

            const { user, accessToken } = responseData;

            if (user && accessToken) {
                dispatch(
                    loginSuccess({
                        name: user.name,
                        email: user.email,
                        regNo: user.regNo,
                        role: user.role,
                        department: user.department,
                        semester: user.semester,
                        accessToken: accessToken,
                    })
                );

                localStorage.setItem("accessToken", accessToken); // optional: useful for page refresh access

                navigate("/dashboard");
                toast.success(`Welcome back, ${user.name}`);
            } else {
                throw new Error("Invalid response from server.");
            }
        } catch (error) {
            const errorMsg =
                error?.response?.data?.message || error.message || "Login failed";
            toast.error(errorMsg);
            console.error("Login failed:", errorMsg);
        }
    };    

    return (
        <div className="flex items-center justify-center h-screen bg-[var(--bg)]">
            <Toaster />
            <div className="w-full max-w-md p-8 bg-[var(--white-2)] rounded-lg shadow-[#464646] shadow-xl login-card border border-stone-700">
                <h2 className="text-2xl font-bold text-center text-[var(--white-8)] mb-6">Login</h2>
                <form onSubmit={loginHandler} className="w-full flex flex-col items-center justify-center-center">
                    <div className="mb-4 w-full">
                        <label className="w-full text-sm font-medium text-[var(--white-7)] mb-2" htmlFor="email">Email</label>
                        <input
                            name="email"
                            onChange={handleChange}
                            value={data.email}
                            type="email"
                            id="email"
                            className="w-full px-3 py-2 border border-[var(--white-5)] rounded focus:outline-none focus:ring focus:ring-none focus:border-[var(--white-4)] placeholder:text-[var(--white-6)] text-[var(--white-8)] active:bg-[var(--white-1)] "
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="mb-6 w-full">
                        <label className="w-full text-sm font-medium text-[var(--white-7)] mb-2" htmlFor="password">Password</label>
                        <input
                            name="password"
                            onChange={handleChange}
                            value={data.password}
                            type="password"
                            id="password"
                            className="w-full px-3 py-2 border border-[var(--white-5)] rounded focus:outline-none focus:ring focus:ring-none focus:border-[var(--white-1)] text-[var(--white-8)] placeholder:text-[var(--white-6)]"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-fit px-8 py-2 text-white font-semibold rounded hover:bg-blue-700 transition duration-200 gradient-btn"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../hooks/index.js";
import { setUser } from "@/Redux/Slices/User/user.js";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner.jsx";
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
            const response = await axios.post(
                "http://localhost:8000/api/v1/auth/login",
                data
            ); 

            if (response.data.success) {
                dispatch(setUser(response.data.user));
                navigate("/dashboard");
            }
        } catch (error) {
            // Axios errors are here when status is not 2xx
            const errorMsg = error.response?.data?.message || "Login failed";
            toast.error(errorMsg);
            console.error("Login failed:", errorMsg);
        }
    };    

    return (
        <div className="flex items-center justify-center h-screen bg-[#313131]">
            <Toaster />
            <div className="w-full max-w-md p-8 bg-[#313131] rounded-lg shadow-[black] shadow-xl login-card border border-stone-700">
                <h2 className="text-2xl font-bold text-center text-stone-100 mb-6">Login</h2>
                <form onSubmit={loginHandler} className="w-full flex flex-col items-center justify-center-center">
                    <div className="mb-4 w-full">
                        <label className="w-full text-sm font-medium text-stone-300 mb-2" htmlFor="email">Email</label>
                        <input
                            name="email"
                            onChange={handleChange}
                            value={data.email}
                            type="email"
                            id="email"
                            className="w-full px-3 py-2 border ring-stone-500 rounded focus:outline-none focus:ring focus:ring-none focus:border-amber-300/70 placeholder:text-stone-400 text-stone-300 active:bg-black "
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="mb-6 w-full">
                        <label className="w-full text-sm font-medium text-stone-300 mb-2" htmlFor="password">Password</label>
                        <input
                            name="password"
                            onChange={handleChange}
                            value={data.password}
                            type="password"
                            id="password"
                            className="w-full px-3 py-2 border ring-stone-500 rounded focus:outline-none focus:ring focus:ring-none focus:border-amber-300/70 text-stone-300"
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
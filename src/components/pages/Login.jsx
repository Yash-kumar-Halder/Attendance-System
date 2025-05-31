import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../hooks/index.js";
import { setUser } from "@/Redux/Slices/User/user.js";
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
        // Handle login logic here
        const response = await axios.post(
            "http://localhost:8000/api/v1/auth/login",
            data
        );
        // Handle the response as needed
        if (response.data) {
            // Redirect or perform other actions on successful login
            
            dispatch(setUser(response.data.user));
            navigate("/home");
        } else {
            console.error("Login failed:", response.data.message);
        }

    }

    return (
        <div>
            <div className="flex items-center justify-center h-screen bg-gray-200">
                <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                    <form>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">Email</label>
                            <input
                                name="email"
                                onChange={handleChange}
                                value={data.email}
                                type="email"
                                id="email"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">Password</label>
                            <input
                                name="password"
                                onChange={handleChange}
                                value={data.password}
                                type="password"
                                id="password"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <button
                            onClick={loginHandler}
                            type="submit"
                            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-200"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
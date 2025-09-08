import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../hooks/index.js";
import { loginSuccess } from "@/Redux/Slices/User/user.js";
import { toast } from 'sonner';
import { Toaster } from '../ui/sonner';

const Signup = () => {

    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    const navigate = useNavigate();
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        phoneNo : "",
        role: "teacher",
        department: "",
        semester: "",
        regNo: "",

    })      

    // useEffect(() => {
    //     console.log(data)
    // }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value
        });
    }

    const validateForm = () => {
        const { name, email, password, phoneNo, role, department, semester, regNo } = data;

        if (!name || !email || !password || !phoneNo) {
            return {
                success: false,
                error: "All fields are required",
            };
        }

        if (role !== "teacher" && !department) {
            return {
                success: false,
                error: "Department required for students",
            };
        }
        if (role !== "teacher" && !semester) {
            return {
                success: false,
                error: "Semester required for students",
            };
        }
        if (role !== "teacher" && !regNo) {
            return {
                success: false,
                error: "Registration number is required for students",
            };
        }

        return {
            success: true,
        };
    };
    

    const handleSelectChange = (type, value) => {
        setData((prev) => ({
            ...prev,
            [type]: value
        }));
    }
    

    const signupHandler = async (e) => {
        e.preventDefault();
        console.log(data)

        try {
            const response = await axios.post("/auth/register", data, {
                withCredentials: true,
            });

            const user = response.data.user;
            const accessToken = response.data.accessToken;

            if (response.data.success) {
                dispatch(
                    loginSuccess({
                        name: user.name,
                        email: user.email,
                        regNo: user.regNo,
                        role: user.role,
                        department: user.department,
                        semester: user.semester,
                        accessToken: response.data.accessToken,
                    })
                );

                localStorage.setItem("accessToken", accessToken);

                navigate("/classes");
                toast.success(`Welcome back, ${user.name}`);
            } else {
                throw new Error("Invalid response from server."); // Throws error for unexpected response
            }
        } catch (error) {
            const toastMsg = error.response.data.message;
            toast.error(toastMsg);
            console.error("Login failed:", error); // Logs error to console
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-[var(--bg)]">
            <Toaster />
            <div className="w-full max-w-md p-8 bg-[var(--white-2)] rounded-lg shadow-[#383838] shadow-xl login-card border border-stone-700">
                <h2 className="text-2xl font-bold text-center text-[var(--white-8)] mb-6">Signup</h2>
                <form onSubmit={signupHandler} className="w-full flex flex-col items-center justify-center-center">
                    <div className="mb-4 w-full">
                        <label className="w-full text-sm font-medium text-[var(--white-7)] mb-2" htmlFor="email">Name</label>
                        <input
                            name="name"
                            onChange={handleChange}
                            value={data.name}
                            type="text"
                            id="name"
                            className="w-full px-3 py-2 border ring-stone-500 rounded focus:outline-none focus:ring focus:ring-none focus:border-amber-300/70 placeholder:text-stone-400 text-[var(--white-8)] active:bg-black "
                            placeholder="Enter your name"
                            required
                        />
                    </div>
                    <div className="mb-4 w-full">
                        <label className="w-full text-sm font-medium text-[var(--white-7)] mb-2" htmlFor="email">Email</label>
                        <input
                            name="email"
                            onChange={handleChange}
                            value={data.email}
                            type="email"
                            id="email"
                            className="w-full px-3 py-2 border ring-stone-500 rounded focus:outline-none focus:ring focus:ring-none focus:border-amber-300/70 placeholder:text-stone-400 text-[var(--white-8)] active:bg-black "
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="mb-4 w-full flex items-end gap-3">
                       <div>
                            <label className="w-full text-sm font-medium text-[var(--white-7)] mb-2" htmlFor="number">Phone number</label>
                            <input
                                name="phoneNo"
                                onChange={handleChange}
                                value={data.phoneNo}
                                type="number"
                                id="phoneNo"
                                className="w-full px-3 py-2 border ring-stone-500 rounded focus:outline-none focus:ring focus:ring-none focus:border-amber-300/70 placeholder:text-stone-400 text-[var(--white-8)] active:bg-black "
                                placeholder="Enter your phone number"
                                required
                            />
                       </div>
                        <Select value={data.role} onValueChange={(e) => handleSelectChange("role",e)} >
                            <SelectTrigger className="w-[180px] h-10 rounded-[4px] py-[20px] border border-stone-400 text-[var(--white-8)] placeholder:text-stone-100">
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#111] text-stone-300">
                                <SelectItem value="student">Student</SelectItem>
                                <SelectItem value="teacher">Teacher</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="mb-6 w-full">
                        <label className="w-full text-sm font-medium text-[var(--white-7)] mb-2" htmlFor="password">Password</label>
                        <input
                            name="password"
                            onChange={handleChange}
                            value={data.password}
                            type="password"
                            id="password"
                            className="w-full px-3 py-2 border ring-stone-500 rounded focus:outline-none focus:ring focus:ring-none focus:border-amber-300/70 text-[var(--white-8)]"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    {data.role !== "teacher" && (
                         <div className="mb-4 w-full flex items-end gap-3">
                        <Select onValueChange={(e) => handleSelectChange("department", e)} >
                            <SelectTrigger className="w-[180px] h-10 rounded-[4px] py-[20px] border border-stone-400 text-[var(--white-8)] placeholder:text-stone-100">
                                <SelectValue placeholder="Department" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#111] text-stone-300">
                                <SelectItem value="CST">CST</SelectItem>
                                <SelectItem value="CFS">CFS</SelectItem>
                                <SelectItem value="EE">EE</SelectItem>
                                <SelectItem value="ID">ID</SelectItem>
                                <SelectItem value="MTR">MTR</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select onValueChange={(e) => handleSelectChange("semester", e)}>
                            <SelectTrigger className="w-[180px] h-10 rounded-[4px] py-[20px] border border-stone-400 text-[var(--white-8)] placeholder:text-stone-100 ">
                                <SelectValue placeholder="Semester" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#111] text-stone-300">
                                <SelectItem value="1st">1st</SelectItem>
                                <SelectItem value="2nd">2nd</SelectItem>
                                <SelectItem value="3rd">3rd</SelectItem>
                                <SelectItem value="4th">4th</SelectItem>
                                <SelectItem value="5th">5th</SelectItem>
                                <SelectItem value="6th">6th</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    )}
                    {data.role !== "teacher" && (<div className="mb-4 w-full">
                        <label className="w-full text-sm font-medium text-[var(--white-7)] mb-2" htmlFor="email">Registration number</label>
                        <input
                            name="regNo"
                            onChange={handleChange}
                            value={data.regNo}
                            type="text"
                            id="regNo"
                            className="w-full px-3 py-2 border ring-stone-500 rounded focus:outline-none focus:ring focus:ring-none focus:border-amber-300/70 placeholder:text-stone-400 text-[var(--white-8)] active:bg-black "
                            placeholder="Enter your registration number" />
                    </div>)}
                    
                    <button
                        type="submit"
                        className="w-fit px-8 py-2 text-white font-semibold rounded hover:bg-blue-700 transition duration-200 gradient-btn"
                    >
                        Signup
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Signup
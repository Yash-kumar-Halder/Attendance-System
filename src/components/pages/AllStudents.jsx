import axios from 'axios';
import { Coffee, Ellipsis, GraduationCap, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import CircularLoader from '../MyComponents/CircularLoader.jsx'; // Import CircularLoader
import { toast } from 'sonner'; // Assuming you have sonner for toasts
import { useTeacherRoute } from '@/Utils/authRoute.js';


const AllStudents = () => {
    useTeacherRoute();
    const [allStudents, setAllStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // New state for loading
    const [visibleStudentCount, setVisibleStudentCount] = useState(0); // New state for staggered rendering


    const getValidToken = async () => {
        let token = localStorage.getItem("accessToken");
        try {
            // Try a dummy request to check token validity
            await axios.get("/subject/get", {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            return token;
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                // Refresh token
                try {
                    const refreshResponse = await axios.get(
                        "/auth/refresh-token",
                        { withCredentials: true }
                    );
                    const newToken = refreshResponse.data.accessToken;
                    localStorage.setItem("accessToken", newToken);
                    return newToken;
                } catch (refreshError) {
                    toast.error("Session expired. Please login again.");
                    throw refreshError;
                }
            }
            throw error;
        }
    };

    const fetchAllStudents = async () => {
        try {
            setIsLoading(true); // Set loading to true before fetching
            const token = await getValidToken();
            const response = await axios.post("/user/get-students", {}, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });

            if (response.data.success) {
                const students = response.data.students;
                setAllStudents(students);
                setVisibleStudentCount(0); // Reset for new data load
            }
        } catch (error) {
            console.error("Failed to fetch students", error);
            toast.error("Failed to fetch students");
        } finally {
            setIsLoading(false); // Set loading to false after fetching (success or error)
        }
    };

    useEffect(() => {
        fetchAllStudents();
    }, []);

    // Effect for staggered rendering
    useEffect(() => {
        // Only trigger if not loading, there are students, and not all are visible yet
        if (!isLoading && allStudents.length > 0 && visibleStudentCount < allStudents.length) {
            const timer = setTimeout(() => {
                setVisibleStudentCount((prevCount) => prevCount + 1);
            }, 100); // Adjust delay here (e.g., 100ms per card)
            return () => clearTimeout(timer); // Cleanup on unmount or re-render
        }
        // If loading or no students, ensure visible count is 0 to reset animation
        if (isLoading || allStudents.length === 0) {
            setVisibleStudentCount(0);
        }
    }, [isLoading, allStudents, visibleStudentCount]);

    return (
        <div className='px-[2.5%] py-[1.5%] min-h-[calc(100vh-40px)] bg-[var(--bg)]'>
            <div className='mb-6'>
                <h1 className='text-2xl font-extrabold text-[var(--white-9)]'>Students</h1>
                <span className='flex items-center gap-1 text-xs text-stone-400'><User size="14" />Total Student: {allStudents.length}</span>
            </div>

            {isLoading ? (
                <CircularLoader /> // Show loader when isLoading is true
            ) : (
                allStudents.length > 0 ? (
                    // Render students with staggered fade-in
                    allStudents.slice(0, visibleStudentCount).map((e) => (
                        <div key={e._id} className="w-full h-fit px-5 py-2 mb-3 rounded-md bg-[var(--card)] fade-in-card"> {/* Added fade-in-card class */}
                            <div className="flex justify-between items-start">
                                <div className="w-full">
                                    <div className="flex items-center justify-between pr-5 w-full">
                                        <h2 className="text-[var(--white-8)] text-lg flex items-center gap-1.5 font-extrabold">
                                            {e.name}
                                            <GraduationCap size="15" />
                                        </h2>
                                        <span className="bg-[var(--white-4)] px-3 rounded-t-lg rounded-r-lg text-[var(--white-7)]">
                                            {e.email} {/* Assuming email is a good unique identifier */}
                                        </span>
                                    </div>
                                    <h3 className="text-md text-[var(--white-8)]"></h3>
                                    <div className="text-xs mb-2 mt-2 flex gap-3 ">
                                        <span className="bg-emerald-300 text-xs px-3 rounded-sm py-1">{e.department}</span>
                                        <span className="bg-teal-200 text-xs px-3 rounded-sm py-1">
                                            {e.semester}</span>
                                        <span className="bg-teal-200 text-xs px-3 rounded-sm py-1">
                                            Reg: {e.regNo}</span>
                                    </div>
                                </div>
                                {/* <Ellipsis className="cursor-pointer text-[var(--white-9)]" /> */}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-[var(--white-6)] text-sm">No students found.</p>
                )
            )}
        </div>
    );
};

export default AllStudents;
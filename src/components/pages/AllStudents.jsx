import axios from 'axios';
import { Coffee, Ellipsis, GraduationCap, User } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const AllStudents = () => {

    const [allStudents, setAllSctudents] = useState([]);
    const getValidToken = async () => {
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

    const fetchAllStudents = async () => {
        try {
            const token = await getValidToken();
            const response = await axios.post("http://localhost:8000/api/v1/user/get-students", {}, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });

            if (response.data.success) {
                const students = response.data.students;
                setAllSctudents(students);
            };
        } catch (error) {
            console.error("Failed to fetch subjects", error);
            toast.error("Failed to fetch subjects");
        }
    };
    // const subjects = useAppSelector((state) => state.subject);

    useEffect(() => {
        fetchAllStudents();
    }, []);

    return (
        <div className='px-[2.5%] py-[1.5%] min-h-[calc(100vh-40px)] bg-[var(--bg)]'>
            <div className='mb-6' >
                <h1 className='text-2xl font-extrabold text-[var(--white-9)]'>Students</h1>
                <span className='flex items-center gap-1 text-xs text-stone-400'><User size="14" />Total Student: {allStudents.length}</span>
            </div>
            {allStudents.map((e) => (
                <div key={e._id} className="w-full h-fit px-5 py-2 mb-3 rounded-md bg-[var(--card)]">
                    <div className="flex justify-between items-start">
                        <div className="w-full">
                            <div className="flex items-center justify-between pr-5 w-full">
                                <h2 className="text-[var(--white-8)] text-lg flex items-center gap-1.5 font-extrabold">
                                    {e.name}
                                    <GraduationCap size="15" />
                                </h2>
                                <span className="bg-[var(--white-4)] px-3 rounded-2xl text-[var(--white-7)]">
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
                </div>))}

        </div>
    )
}

export default AllStudents
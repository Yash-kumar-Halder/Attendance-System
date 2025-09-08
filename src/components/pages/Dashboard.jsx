import React, { useEffect, useRef, useState } from 'react'; // Import useState
import CircleProgressBar from '../CircleProgressBar';
import Chart from '../MyComponents/Chart';
import BG1 from "../../assets/Images/bg-1.jpeg";
import BG3 from "../../assets/Images/bg-3.jpeg";
import ChartLine1 from "../../assets/Images/chart-line-1.jpeg";
import { useAppSelector, useAppDispatch } from '@/hooks';
import { getValidToken } from '../../Utils/getValidToken.js';
import axios from 'axios';
import { toast } from 'sonner';
import { setData } from '../../Redux/Slices/User/attendance.js';
import CircularLoader from '../MyComponents/CircularLoader.jsx'; // Import CircularLoader
import { userAuthRoute } from '@/Utils/authRoute';

const Dashboard = () => {
    userAuthRoute();
    const dispatch = useAppDispatch();
    const { attendance, totalClasses } = useAppSelector(state => state.attendance);
    const user = useAppSelector(state => state.user);

    const fetchedAttendance = useRef([]);
    const fetchedTotalClasses = useRef([]);

    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const [contentVisible, setContentVisible] = useState(false); // State for fade-in animation

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true); // Set loading to true at the start of fetch
            setContentVisible(false); // Hide content immediately when loading starts

            const token = await getValidToken();
            if (!token) {
                toast.error("Authentication token not found. Please log in.");
                setIsLoading(false); // Stop loading if no token
                return;
            }

            let dataSuccessfullyUpdated = false;

            // --- Fetch Total Classes Taken ---
            try {
                const totalClassesRes = await axios.post(
                    "/classes/total-class",
                    {},
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true,
                    }
                );
                if (totalClassesRes.data.success) {
                    fetchedTotalClasses.current = [totalClassesRes.data.data];
                    dataSuccessfullyUpdated = true;
                } else {
                    toast.error(totalClassesRes.data.message);
                }
            } catch (error) {
                console.error("Error fetching total classes:", error);
                toast.error(error.response?.data?.message || "Failed to fetch total classes.");
            }

            // --- Fetch User Class History / Attendance (conditionally for students) ---
            if (user.role === "student") {
                try {
                    const userClassesRes = await axios.post(
                        "/classes/history",
                        {},
                        {
                            headers: { Authorization: `Bearer ${token}` },
                            withCredentials: true,
                        }
                    );
                    if (userClassesRes.data.success) {
                        const presentClasses = userClassesRes.data.pastClasses.filter(
                            (cls) => !cls.isCancelled && cls.isPresent
                        );
                        fetchedAttendance.current = presentClasses;
                        dataSuccessfullyUpdated = true;
                    } else {
                        toast.error(userClassesRes.data.message);
                    }
                } catch (error) {
                    console.error("Error fetching student class history:", error);
                    toast.error(error.response?.data?.message || "Failed to fetch student class history.");
                }
            } else {
                fetchedAttendance.current = [];
                dataSuccessfullyUpdated = true;
            }

            if (dataSuccessfullyUpdated) {
                dispatch(setData({
                    attendance: fetchedAttendance.current,
                    totalClasses: fetchedTotalClasses.current,
                }));
            }
            setIsLoading(false); // Set loading to false after all fetches (or at least attempted fetches)
            // A small delay before making content visible for a smoother transition
            setTimeout(() => {
                setContentVisible(true);
            }, 50); // Small delay after loading finishes
        };

        fetchDashboardData();
    }, [dispatch, user.role]);

    const totalClassesValue = totalClasses?.[0]?.totalTaken || 0;
    const presentClassesCount = attendance?.length || 0;

    return (
        <div className='w-[100%] px-[2.5%] py-[1.5%] bg-[var(--bg)] min-h-[calc(100vh-40px)] flex flex-col items-center justify-center'>
            {isLoading ? (
                <CircularLoader />
            ) : (
                <div className={`w-full flex flex-wrap gap-[2%] ${contentVisible ? 'fade-in' : 'opacity-0'}`}>
                    <div className='w-[55%] cursor-pointer transition duration-300 hover:scale-[1.03] overflow-hidden aspect-[3/1.65] bg-[var(--card)] rounded-md my-[1.5%] flex items-center justify-center'>
                            {user.role == "teacher" ? <h1 className='text-2xl text-[var(--white-9)] ' >Thich content only for student</h1> : <CircleProgressBar
                                total={totalClassesValue}
                                present={presentClassesCount}
                                color="text-green-500"
                                baseColor="text-orange-400"
                                label="Present"
                            />}
                    </div>
                    <div className='w-[40%] flex flex-wrap gap-[4%] justify-between aspect-[3/1.8] rounded-md my-[1.5%]'>
                        <div className='w-[48%] h-[48.1%] bg-[var(--card)] rounded-md overflow-hidden'>
                            <img className='w-full h-full' src={BG1} alt="image" />
                        </div>
                        <div className='w-[48%] h-[48.1%] bg-[var(--card)] rounded-md overflow-hidden'>
                            <img className='w-full h-full' src={ChartLine1} alt="img" />
                        </div>
                        <div className='w-[100%] h-[48.1%] bg-[var(--card)] rounded-md'>
                            <Chart />
                        </div>
                    </div>
                    <div className='w-[35%] cursor-pointer aspect-[3/1.8] bg-[var(--card)] rounded-md my-[1.5%] overflow-hidden'>
                        <img className='w-full h-full top-0 object-cover' src={BG3} alt="image" />
                    </div>
                    <div className='w-[60%] aspect-[3/1.4] bg-[var(--card)] rounded-md my-[1.5%]'></div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
import React, { useEffect, useRef } from 'react';
import CircleProgressBar from '../CircleProgressBar';
import Chart from '../MyComponents/Chart';
import BG1 from "../../assets/Images/bg-1.jpeg";
import BG3 from "../../assets/Images/bg-3.jpeg";
import ChartLine1 from "../../assets/Images/chart-line-1.jpeg";
import { useAppSelector, useAppDispatch } from '@/hooks'; // Assuming '@/hooks' correctly exports useAppSelector and useAppDispatch
import { getValidToken } from '@/Utils/getValidToken'; // Your utility to get authentication token
import axios from 'axios';
import { toast } from 'sonner'; // For user feedback

// Import your existing setData action from the specified path
import { setData } from '../../Redux/Slices/User/attendance.js'; // Correct path from your input

const Dashboard = () => {
    const dispatch = useAppDispatch();
    // Destructure attendance and totalClasses from your Redux state
    const { attendance, totalClasses } = useAppSelector(state => state.attendance);
    // Get user details from Redux state to check their role
    const user = useAppSelector(state => state.user);

    // Use refs to temporarily hold the data fetched from APIs before dispatching
    // This ensures we can update the Redux store with both pieces of data simultaneously
    const fetchedAttendance = useRef([]);
    // This ref will store the backend's totalClasses object wrapped in an array,
    // to match your Redux slice's `totalClasses: []` structure.
    const fetchedTotalClasses = useRef([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = await getValidToken();
            if (!token) {
                toast.error("Authentication token not found. Please log in.");
                return;
            }

            let dataSuccessfullyUpdated = false; // Flag to track if any data was fetched successfully

            // --- Fetch Total Classes Taken ---
            // This endpoint provides { totalScheduled, totalCancelled, totalTaken } for the dynamic date range
            try {
                const totalClassesRes = await axios.post(
                    "http://localhost:8000/api/v1/classes/total-class",
                    {},
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true,
                    }
                  );
                if (totalClassesRes.data.success) {
                    // Wrap the backend object in an array to match your slice's `totalClasses: []` structure
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
            // This endpoint provides a list of past class occurrences with attendance status
            if (user.role === "student") {
                try {
                    const userClassesRes = await axios.post(
                        "http://localhost:8000/api/v1/classes/history",
                        {}, // Your class history endpoint might not need a body for a GET-like history fetch
                        {
                            headers: { Authorization: `Bearer ${token}` },
                            withCredentials: true,
                        }
                    );
                    if (userClassesRes.data.success) {
                        // Filter the past classes to get only those where the student was marked as present
                        // and the class was not cancelled.
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
                // If the user is not a student, ensure attendance data is empty for consistency
                fetchedAttendance.current = [];
                dataSuccessfullyUpdated = true; // Mark as updated even if empty, so setData is called
            }

            // Dispatch the `setData` action only if at least one piece of data was successfully fetched
            // This ensures your Redux state is updated with the latest available information.
            if (dataSuccessfullyUpdated) {
                dispatch(setData({
                    attendance: fetchedAttendance.current,
                    totalClasses: fetchedTotalClasses.current,
                }));
            }
        };

        // Call the data fetching function when the component mounts or dependencies change
        fetchDashboardData();
    }, [dispatch, user.role]); // Dependencies: Re-run effect if `dispatch` function or `user.role` changes

    // --- Data for CircleProgressBar ---
    // Access `totalTaken` from the first element of the `totalClasses` array,
    // using optional chaining (`?.`) for safety in case data isn't loaded yet.
    const totalClassesValue = totalClasses?.[0]?.totalTaken || 0;
    // `attendance.length` directly gives the count of present classes
    const presentClassesCount = attendance?.length || 0;

    return (
        <div className='w-[100%] px-[2.5%] py-[1.5%] flex flex-wrap gap-[2%] bg-[var(--bg)]'>
            <div className='w-[55%] cursor-pointer transition duration-300 hover:scale-[1.03] overflow-hidden aspect-[3/1.65] bg-[var(--card)] rounded-md my-[1.5%]'>
                <CircleProgressBar
                    total={totalClassesValue}
                    present={presentClassesCount}
                    color="text-green-500"
                    baseColor="text-orange-400"
                    label="Present"
                />
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
    );
};

export default Dashboard;
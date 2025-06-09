import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Coffee, Ellipsis, NotebookPen, User } from 'lucide-react';
import { getCurrentDay, getCurrentTimeInMinutes } from '../../Utils/timeUtils.js';
import ActiveClassesCard from '../Skeleton/ActiveClassesCard.jsx';
import { Button } from '../ui/button.jsx';
import { toast } from 'sonner';
import CircularLoader from '../MyComponents/CircularLoader.jsx'; // Import the new component
import { useAppSelector } from '@/hooks/index.js';

const Classes = () => {

    // Get the user object from the Redux store
    const user = useAppSelector(state => state.user);
    const isStudent = user?.role === "student"; // A boolean flag for easy checking

    const [activeClasses, setActiveClasses] = useState([]);
    const [upcomingClasses, setUpcomingClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [markedAttendances, setMarkedAttendances] = useState({}); // To store attendance status for active classes
    const [cancelledClasses, setCancelledClasses] = useState({}); // To store cancelled classes for today

    useEffect(() => {
        // Only fetch attendance and cancelled classes if the user is a student
        if (isStudent) {
            fetchScheduleAndAttendanceData();
        } else {
            // If not a student, just fetch schedules, no need for attendance/cancellation checks
            fetchSchedulesOnly();
        }
    }, [isStudent]); // Re-run effect if isStudent changes (though typically it won't after initial load)

    const getValidToken = async () => {
        let token = localStorage.getItem("accessToken");
        try {
            await axios.get("http://localhost:8000/api/v1/subject/get", {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            return token;
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                try {
                    const refreshResponse = await axios.get(
                        "http://localhost:8000/api/v1/auth/refresh-token",
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

    // New function to fetch only schedules (for teachers or other roles)
    const fetchSchedulesOnly = async () => {
        try {
            setIsLoading(true);
            const token = await getValidToken();

            const scheduleRes = await axios.post("http://localhost:8000/api/v1/schedule/get", {}, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });

            if (scheduleRes.data.success) {
                const schedules = scheduleRes.data.scheduleClasses;
                const today = getCurrentDay();
                const currentTime = getCurrentTimeInMinutes();

                const todaySchedules = schedules.filter(s => s.day === today);
                const active = todaySchedules.filter(s => s.startTime <= currentTime && s.endTime >= currentTime);
                const upcoming = todaySchedules.filter(s => s.startTime > currentTime);

                setActiveClasses(active);
                setUpcomingClasses(upcoming);
            }
        } catch (error) {
            console.error("Error fetching schedule data for non-student:", error);
            toast.error("Failed to fetch class data.");
        } finally {
            setIsLoading(false);
        }
    };


    const fetchScheduleAndAttendanceData = async () => {
        try {
            setIsLoading(true);
            const token = await getValidToken();

            // Fetch schedules
            const scheduleRes = await axios.post("http://localhost:8000/api/v1/schedule/get", {}, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });

            if (scheduleRes.data.success) {
                const schedules = scheduleRes.data.scheduleClasses;
                const today = getCurrentDay();
                const currentTime = getCurrentTimeInMinutes();

                const todaySchedules = schedules.filter(s => s.day === today);
                const active = todaySchedules.filter(s => s.startTime <= currentTime && s.endTime >= currentTime);
                const upcoming = todaySchedules.filter(s => s.startTime > currentTime);

                setActiveClasses(active);
                setUpcomingClasses(upcoming);

                // Fetch attendance status for active classes (ONLY if isStudent)
                if (isStudent) {
                    const attendanceChecks = active.map(async (cls) => {
                        try {
                            const attendanceStatusRes = await axios.get(
                                `http://localhost:8000/api/v1/attendance/is-marked?scheduleSlot=${cls._id}`,
                                {
                                    headers: { Authorization: `Bearer ${token}` },
                                    withCredentials: true,
                                }
                            );
                            return { scheduleSlotId: cls._id, isMarked: attendanceStatusRes.data.isMarked };
                        } catch (error) {
                            console.error(`Error checking attendance for ${cls._id}:`, error);
                            return { scheduleSlotId: cls._id, isMarked: false }; // Default to false on error
                        }
                    });
                    const results = await Promise.all(attendanceChecks);
                    const markedMap = results.reduce((acc, curr) => {
                        acc[curr.scheduleSlotId] = curr.isMarked;
                        return acc;
                    }, {});
                    setMarkedAttendances(markedMap);
                }

                // Fetch cancelled classes for today (Can be for both, but we'll conditionally show for student)
                const cancelledClassesRes = await axios.get(
                    "http://localhost:8000/api/v1/classes/cancelled-classes/today",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true,
                    }
                );
                if (cancelledClassesRes.data.success) {
                    const cancelledMap = cancelledClassesRes.data.data.reduce((acc, curr) => {
                        if (curr.scheduleSlot && curr.scheduleSlot._id) {
                            acc[curr.scheduleSlot._id] = true;
                        }
                        return acc;
                    }, {});
                    setCancelledClasses(cancelledMap);
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to fetch class data.");
        } finally {
            setIsLoading(false);
        }
    };

    const formatMinutesToTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const h = hours % 12 || 12;
        const ampm = hours >= 12 ? "PM" : "AM";
        return `${h}:${mins.toString().padStart(2, "0")} ${ampm}`;
    };

    const markAttendance = async (e) => {
        // Ensure only students can mark attendance
        if (!isStudent) {
            toast.error("Only students can mark attendance.");
            return;
        }

        try {
            const token = await getValidToken();
            const response = await axios.post(
                "http://localhost:8000/api/v1/attendance/mark",
                {
                    subjectId: e.subject._id,
                    scheduleSlot: e._id,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );
            toast.success(response.data.message);
            // Update the attendance status locally after successful marking
            setMarkedAttendances(prev => ({ ...prev, [e._id]: true }));
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
                if (error.response.data.message === "Attendance already marked.") {
                    setMarkedAttendances(prev => ({ ...prev, [e._id]: true }));
                }
            } else {
                toast.error("Something went wrong");
            }
            console.error("Error marking attendance", error);
        }
    };

    const currentTime = getCurrentTimeInMinutes();

    const renderCard = (e, type) => {
        if (!e || !e.subject) return null;

        const endTimeFormatted = formatMinutesToTime(e.endTime);
        const startTimeFormatted = formatMinutesToTime(e.startTime);
        const duration = e.endTime - currentTime;

        const isAttendanceMarked = markedAttendances[e._id];
        const isClassCancelled = cancelledClasses[e._id]; // Check if this class slot is cancelled

        return (
            <div key={e._id} className="w-full h-fit px-5 py-2 mb-3 rounded-md bg-[var(--card)]">
                <div className="flex justify-between items-start">
                    <div className="w-full ">
                        <div className="flex items-center justify-between pr-5 w-full">
                            <h2 className="text-[var(--white-8)] text-lg flex items-center gap-1.5 font-extrabold">
                                {e.subject.subject}
                                <NotebookPen size="15" />
                                <span className="bg-emerald-300 text-stone-800 text-xs ml-3 px-3 rounded-2xl py-0.5">
                                    {e.subject.department}
                                </span>
                                <span className="bg-teal-200 text-stone-800 text-xs px-3 rounded-2xl py-0.5">
                                    {e.subject.semester}
                                </span>
                            </h2>
                            <span className="bg-[var(--white-4)] px-3 rounded-2xl text-[var(--white-7)]">
                                {e.subject.code}
                            </span>
                        </div>
                        <div className='flex justify-between items-center pr-5' >
                            <div>
                                <h3 className="text-md text-[var(--white-8)]">Teacher: {e.subject.teacher}</h3>
                                <div className="text-xs mb-1">
                                    {type === "active" ? (
                                        <p className="w-fit px-2 py-0.5 bg-orange-200 rounded-sm text-[var(--black)]">
                                            Ends at <b>{endTimeFormatted}</b> — <b>{duration} min left</b>
                                        </p>
                                    ) : (
                                        <p className="w-fit px-2 py-0.5 bg-emerald-300 rounded-sm text-[var(--black)]">
                                            Starts at <b>{startTimeFormatted}</b>
                                        </p>
                                    )}
                                </div>
                            </div>
                            {/* Conditional rendering based on user role */}
                            {isStudent && type === "active" ? ( // Only show attendance/status for students in active classes
                                isClassCancelled ? (
                                    <span className="text-xs py-1.5 text-white px-3 rounded-md bg-red-600">Cancelled</span>
                                ) : isAttendanceMarked ? (
                                    <span className="text-xs py-1.5 text-white px-3 rounded-md bg-blue-600">Present</span>
                                ) : (
                                    <button
                                        onClick={() => markAttendance(e)}
                                        className="text-xs py-1.5 text-white px-3 rounded-md bg-green-600 hover:bg-green-800 cursor-pointer"
                                    >
                                        Attendance
                                    </button>
                                )
                            ) : (
                                // For teachers or non-active classes, you can show a different button or nothing
                                // For teachers, you might display 'View Roster' or nothing here.
                                // For now, we'll just show 'More Info' for teachers if they are in active classes.
                                type === "active" && user?.role === "teacher" && (
                                    <span className="text-xs py-1.5 text-white px-3 rounded-md bg-gray-600">View Details</span>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className='px-[2.5%] py-[1.5%] min-h-[calc(100vh-40px)] bg-[var(--bg)]'>
            <div>
                <h1 className='text-2xl font-extrabold text-[var(--white-9)]'>Classes</h1>
                <span className='flex items-center gap-1 text-xs text-stone-400'><User size="14" />Total: {activeClasses.length + upcomingClasses.length}</span>
            </div>

            {isLoading ? (
                <CircularLoader />
            ) : (
                <>
                    <h2 className='text-green-400 text-xl font-bold mt-4'>Active Classes</h2>
                    {activeClasses.length > 0 ? (
                        activeClasses.map(e => renderCard(e, "active"))
                    ) : (
                        <p className="text-stone-400 text-sm mt-2">No active classes right now.</p>
                    )}

                    <h2 className='text-teal-400 text-xl font-bold mt-8 mb-3'>Upcoming Classes</h2>
                    {upcomingClasses.length > 0 ? (
                        upcomingClasses.map(e => renderCard(e, "upcoming"))
                    ) : (
                        <p className="text-stone-400 text-sm mt-2">No upcoming classes for today.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default Classes;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Coffee, Ellipsis, NotebookPen, User } from 'lucide-react';
import { getCurrentDay, getCurrentTimeInMinutes } from '../../Utils/timeUtils.js';
import ActiveClassesCard from '../Skeleton/ActiveClassesCard.jsx';
import { Button } from '../ui/button.jsx';
import { toast } from 'sonner';
import CircularLoader from '../MyComponents/CircularLoader.jsx';
import { useAppSelector } from '@/hooks/index.js';

// Import Shadcn Dialog components
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "../ui/dialog.jsx"; // Adjust path as per your project structure

const Classes = () => {
    const user = useAppSelector(state => state.user);
    const isStudent = user?.role === "student";

    const [activeClasses, setActiveClasses] = useState([]);
    const [upcomingClasses, setUpcomingClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [markedAttendances, setMarkedAttendances] = useState({});
    const [cancelledClasses, setCancelledClasses] = useState({});

    // State for the Shadcn Dialog
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogStudents, setDialogStudents] = useState([]);
    const [dialogClassInfo, setDialogClassInfo] = useState(null);
    const [isFetchingStudents, setIsFetchingStudents] = useState(false);

    useEffect(() => {
        if (isStudent) {
            fetchScheduleAndAttendanceData();
        } else {
            fetchSchedulesOnly();
        }
    }, [isStudent]);

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
                            return { scheduleSlotId: cls._id, isMarked: false };
                        }
                    });
                    const results = await Promise.all(attendanceChecks);
                    const markedMap = results.reduce((acc, curr) => {
                        acc[curr.scheduleSlotId] = curr.isMarked;
                        return acc;
                    }, {});
                    setMarkedAttendances(markedMap);
                }

                const cancelledClassesRes = await axios.get(
                    "http://localhost:8000/api/v1/cancelled-classes/today",
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

    // New function to fetch students present in a class
    const fetchPresentStudents = async (scheduleSlotId, subjectName, startTime, endTime) => {
        setIsFetchingStudents(true);
        setDialogClassInfo({ subjectName, startTime, endTime });
        try {
            const token = await getValidToken();
            const today = new Date();
            const todayDateString = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD for the backend query

            const response = await axios.get(
                `http://localhost:8000/api/v1/attendance/present-students?scheduleSlotId=${scheduleSlotId}&date=${todayDateString}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );

            if (response.data.success) {
                setDialogStudents(response.data.data);
                setIsDialogOpen(true); // Open the dialog after fetching data
            } else {
                toast.error(response.data.message || "Failed to fetch student list.");
            }
        } catch (error) {
            console.error("Error fetching present students:", error);
            toast.error("Failed to fetch student list.");
        } finally {
            setIsFetchingStudents(false);
        }
    };

    const currentTime = getCurrentTimeInMinutes();

    const renderCard = (e, type) => {
        if (!e || !e.subject) return null;

        const endTimeFormatted = formatMinutesToTime(e.endTime);
        const startTimeFormatted = formatMinutesToTime(e.startTime);
        const duration = e.endTime - currentTime;

        const isAttendanceMarked = markedAttendances[e._id];
        const isClassCancelled = cancelledClasses[e._id];

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
                            {isStudent && type === "active" ? (
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
                                type === "active" && user?.role === "teacher" && (
                                    <Button
                                        onClick={() => fetchPresentStudents(e._id, e.subject.subject, startTimeFormatted, endTimeFormatted)}
                                        className="text-xs py-1.5 px-3 bg-gray-600 hover:bg-gray-700 cursor-pointer"
                                        disabled={isFetchingStudents}
                                    >
                                        {isFetchingStudents && dialogClassInfo?.subjectName === e.subject.subject ? (
                                            <CircularLoader size="14" />
                                        ) : (
                                            "View Details"
                                        )}
                                    </Button>
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

            {/* Shadcn Dialog for displaying present students */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Students Present in {dialogClassInfo?.subjectName}</DialogTitle>
                        <DialogDescription>
                            Class Time: {dialogClassInfo?.startTime} - {dialogClassInfo?.endTime}
                        </DialogDescription>
                    </DialogHeader>
                    {isFetchingStudents ? (
                        <div className="flex justify-center items-center h-24">
                            <CircularLoader />
                            <p className="ml-2 text-gray-500">Fetching student list...</p>
                        </div>
                    ) : dialogStudents.length > 0 ? (
                        <ul className="list-disc pl-5 max-h-60 overflow-y-auto">
                            {dialogStudents.map(student => (
                                <li key={student._id} className="mb-1 text-gray-800">
                                    <span className="font-semibold">{student.fullName}</span> ({student.email})
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600 italic">No students marked present for this class yet today.</p>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Classes;
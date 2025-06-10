import React, { useEffect, useState } from 'react';
import { getValidToken } from '@/Utils/getValidToken';
import axios from 'axios';
import { NotebookPen, RefreshCcw, Eye } from 'lucide-react';
import { fetchSubjects } from '@/Utils/FetchSubjects';
import { useAppSelector } from '@/hooks';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '../ui/select';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import CircularLoader from '../MyComponents/CircularLoader.jsx'; 
import { userAuthRoute } from '@/Utils/authRoute';

const ClassHistory = () => {
    userAuthRoute();
    const user = useAppSelector((state) => state.user);
    const [pastClasses, setPastClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [filters, setFilters] = useState({
        subject: "", dept: "", sem: "", day: "", type: ""
    });

    const [attendanceDetailDialog, setAttendanceDetailDialog] = useState(false);
    const [presentStudents, setPresentStudents] = useState([]);
    const [currentClassForAttendance, setCurrentClassForAttendance] = useState(null);

    const [visibleCardCount, setVisibleCardCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true); // New state for loading


    const fetchClassHistory = async () => {
        try {
            setIsLoading(true); // Set loading to true before fetching
            const token = await getValidToken();
            const response = await axios.post(
                "/classes/history",
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );
            if (response.data.success) {
                setPastClasses(response.data.pastClasses);
                setVisibleCardCount(0);
            }
        } catch (error) {
            console.error("Error fetching schedule data", error);
            toast.error("Failed to fetch class history.");
        } finally {
            setIsLoading(false); // Set loading to false after fetching (success or error)
        }
    };

    const fetchStudentsPresent = async (scheduleSlotId, date) => {
        try {
            console.log(date)
            const token = await getValidToken();
            const response = await axios.get(
                `/attendance/present-students?scheduleSlotId=${scheduleSlotId}&date=${date}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );
            if (response.data.success) {
                console.log(response.data)
                setPresentStudents(response.data.data);
                setAttendanceDetailDialog(true);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching students present:', error);
            const message = error.response?.data?.message || 'Failed to fetch attendance details.';
            toast.error(message);
        }
    };


    const fetchSubjectsData = async () => {
        try {
            const data = await fetchSubjects(user);
            setSubjects(data);
        } catch (error) {
            console.error('Error fetching subjects', error);
            toast.error("Failed to fetch subjects data.");
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true); // Ensure loading is true when initial data loads
            await Promise.all([fetchSubjectsData(), fetchClassHistory()]);
            // setIsLoading(false); // This will be handled by fetchClassHistory's finally block
        };
        loadData();
    }, []);

    const filteredClasses = pastClasses.filter((cls) => {
        if (user.role === "teacher") {
            const { subject, dept, sem, day, type } = filters;
            return (!subject || cls.subject === subject) &&
                (!dept || cls.department.toLowerCase() === dept.toLowerCase()) &&
                (!sem || cls.semester === sem) &&
                (!day || cls.day.toLowerCase() === day.toLowerCase()) &&
                (!type || (type === "Cancelled" ? cls.isCancelled : !cls.isCancelled));
        }
        return true;
    });

    useEffect(() => {
        if (!isLoading && filteredClasses.length > 0 && visibleCardCount < filteredClasses.length) {
            const timer = setTimeout(() => {
                setVisibleCardCount((prevCount) => prevCount + 1);
            }, 100);
            return () => clearTimeout(timer);
        }
        // If filters change and there are no classes, or if loading, reset visibleCardCount to 0
        if ((!isLoading && filteredClasses.length === 0) || isLoading) {
            setVisibleCardCount(0);
        }
    }, [isLoading, filteredClasses, visibleCardCount]);


    const clearFilter = () => {
        setFilters({ subject: "", dept: "", sem: "", day: "", type: "" });
        setVisibleCardCount(0);
        fetchClassHistory(); // Re-fetch all history to reset filters completely
    };


    const renderCard = (e, idx) => (
        <div key={idx} className="w-full h-fit px-5 py-2 mb-3 rounded-md bg-[var(--card)] fade-in-card">
            <div className="flex justify-between items-start">
                <div className="w-full">
                    <div className="flex items-center justify-between pr-5 w-full">
                        <h2 className="text-[var(--white-7)] text-lg flex items-center gap-2 font-extrabold">
                            {e.subject}
                            <NotebookPen size="15" />
                            <span className="border-emerald-500 border text-emerald-700 text-xs ml-3 px-4 rounded-2xl py-0.5 mr-1">
                                {e.department}
                            </span>
                            <span className="border-fuchsia-600 border text-fuchsia-700 text-xs px-4 rounded-2xl py-0.5">
                                {e.semester}
                            </span>
                        </h2>
                        <div className='flex gap-2'>
                            <span className='text-xs bg-[var(--yg-chips)] border border-[var(--yg-b-chips)] h-fit px-2.5 py-0.5 text-[var(--yg-t-chips)] rounded-full'>{e.day}</span>
                            <span className='text-xs bg-[var(--p-chips)] py-0.5 h-fit px-2 border border-[var(--p-b-chips)] text-[var(--p-t-chips)] rounded-full'>{e.date}</span>
                            <span className="bg-[var(--white-4)] px-4 py-0 text-xs text-center content-center rounded-2xl text-[var(--white-7)] border border-[var(--white-5)] ">
                                {e.code}
                            </span>
                        </div>
                    </div>
                    <div className='flex justify-between items-center pr-5'>
                        <div>
                            <h3 className="text-md text-[var(--white-6)]">Teacher: {e.teacher}</h3>
                            <div className="text-xs flex gap-1.5 mb-1">
                                <p className="w-fit px-2 py-0.5 bg-[var(--o-chips)] border border-[var(--o-b-chips)] rounded-sm text-[var(--o-t-chips)]">
                                    Start at <b>{Math.floor(e.startTime / 60)}:{(e.startTime % 60).toString().padStart(2, '0')}</b> —
                                    <b>{Math.floor(e.endTime / 60)}:{(e.endTime % 60).toString().padStart(2, '0')}</b>
                                </p>
                                <p className="w-fit px-2 py-0.5 bg-[var(--b-chips)] rounded-sm text-[var(--white-7)] font-semibold border border-[var(--b-b-chips)] ">
                                    Duration <b>
                                        {Math.floor((e.endTime - e.startTime) / 60) > 0 && `${Math.floor((e.endTime - e.startTime) / 60)}h `}
                                        {(e.endTime - e.startTime) % 60 !== 0 && `${(e.endTime - e.startTime) % 60}m`}
                                    </b>
                                </p>
                            </div>
                        </div>

                        {user.role === "teacher" ? (
                            <button
                                onClick={() => {
                                    setCurrentClassForAttendance(e);
                                    fetchStudentsPresent(e.scheduleSlotId, e.date);
                                }}
                                className="text-xs py-1.5 text-white px-3 rounded-md bg-teal-800 hover:bg-blue-700 cursor-pointer flex items-center gap-1"
                            >
                                <Eye size={12} /> View Details
                            </button>
                        ) : (
                            <span className={`text-xs font-bold px-3 py-1 rounded-md ${e.isCancelled
                                ? "bg-gray-500 text-white"
                                : e.isPresent
                                    ? "bg-green-500 text-white"
                                    : "bg-red-500 text-white"
                                }`}>
                                {e.isCancelled ? "Cancelled" : e.isPresent ? "Present" : "Absent"}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    
    return (
        <div className='w-[100%] px-[2.5%] py-[1.5%]'>
            <h1 className='text-xl text-[var(--white-8)] font-extrabold'>Class History</h1>
            <p className='text-[var(--white-6)] mb-6'>It will show last one month classes history</p>

            {user.role === "teacher" && (
                <div className="filter-container rounded-sm w-full flex items-center gap-3">
                    <Select onValueChange={(value) => { setFilters(prev => ({ ...prev, day: value })); setVisibleCardCount(0); }} value={filters.day}>
                        <SelectTrigger className="w-[120px] h-6 rounded-[4px] bg-[var(--white-2)] border text-stone-400 text-sm">
                            <SelectValue placeholder="Day" />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--white-1)] text-stone-400">
                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                                <SelectItem key={day} value={day.toLowerCase()}>{day}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select onValueChange={(value) => { setFilters(prev => ({ ...prev, dept: value })); setVisibleCardCount(0); }} value={filters.dept}>
                        <SelectTrigger className="w-[80px] h-6 rounded-[4px] bg-[var(--white-2)] border text-stone-400 text-sm">
                            <SelectValue placeholder="Dept" />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--white-1)] text-stone-400">
                            {["CST", "CFS", "EE", "ID", "MTR"].map(dept => (
                                <SelectItem key={dept} value={dept.toLowerCase()}>{dept}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select onValueChange={(value) => { setFilters(prev => ({ ...prev, sem: value })); setVisibleCardCount(0); }} value={filters.sem}>
                        <SelectTrigger className="w-[80px] h-6 rounded-[4px] bg-[var(--white-2)] border text-stone-400 text-sm">
                            <SelectValue placeholder="Sem" />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--white-1)] text-stone-400">
                            {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map(sem => (
                                <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select onValueChange={(value) => { setFilters(prev => ({ ...prev, subject: value })); setVisibleCardCount(0); }} value={filters.subject}>
                        <SelectTrigger className="w-[80px] h-6 rounded-[4px] bg-[var(--white-2)] border text-stone-400 text-sm">
                            <SelectValue placeholder="Subject" />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--white-1)] text-stone-400">
                            {subjects.map(subject => (
                                <SelectItem key={subject._id} value={subject.subject}>
                                    {subject.subject}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select onValueChange={(value) => { setFilters(prev => ({ ...prev, type: value })); setVisibleCardCount(0); }} value={filters.type}>
                        <SelectTrigger className="w-[80px] h-6 rounded-[4px] bg-[var(--white-2)] border text-stone-400 text-sm">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--white-1)] text-stone-400">
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                            <SelectItem value="Attend">Attend</SelectItem>
                        </SelectContent>
                    </Select>
                    <RefreshCcw
                        size="26"
                        className='cursor-pointer text-[var(--white-7)] p-1.5 rounded-full hover:bg-[var(--white-4)]'
                        onClick={clearFilter}
                    />
                </div>
            )}

            <div className='mt-10'>
                {isLoading ? (
                    <CircularLoader /> // Show loader when isLoading is true
                ) : (
                    filteredClasses.length > 0 ? (
                        filteredClasses.slice(0, visibleCardCount).map((e, idx) => renderCard(e, idx))
                    ) : (
                        <p className="text-[var(--white-6)] text-sm">No class history found matching your criteria.</p>
                    )
                )}
                {/* {console.log( filteredClasses )} */}
                {/* Attendance Details Dialog */}
                <AlertDialog open={attendanceDetailDialog} onOpenChange={setAttendanceDetailDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Students Present in Class</AlertDialogTitle>
                            {currentClassForAttendance && (
                                <AlertDialogDescription>
                                    <span>Subject: <b>{currentClassForAttendance.subject}</b></span>
                                    <span>Date: <b>{currentClassForAttendance.date}</b></span>
                                    <span>Time: <b>{Math.floor(currentClassForAttendance.startTime / 60)}:{(currentClassForAttendance.startTime % 60).toString().padStart(2, '0')} - {Math.floor(currentClassForAttendance.endTime / 60)}:{(currentClassForAttendance.endTime % 60).toString().padStart(2, '0')}</b></span>
                                </AlertDialogDescription>
                            )}
                        </AlertDialogHeader>
                        <div className="max-h-[300px] overflow-y-auto">
                            {presentStudents.length > 0 ? (
                                <ul className="list-disc pl-5">
                                    {presentStudents.map((student, index) => (
                                        <li key={index} className="text-gray-700">
                                            {student.fullName} ({student.email})
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-600">No students were marked present for this class.</p>
                            )}
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogAction onClick={() => setAttendanceDetailDialog(false)}>
                                Close
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
};

export default ClassHistory;
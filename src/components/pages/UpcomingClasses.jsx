import React, { useEffect, useState } from 'react';
import { getValidToken } from '@/Utils/getValidToken';
import axios from 'axios';
import { Ellipsis, NotebookPen, PenIcon, RefreshCcw } from 'lucide-react';
import { fetchSubjects } from '@/Utils/FetchSubjects';
import { useAppSelector } from '@/hooks';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import CircularLoader from '../MyComponents/CircularLoader.jsx'; // Assuming this path is correct
import { userAuthRoute } from '@/Utils/authRoute';
// If using CSS Modules, uncomment the line below:
// import styles from './UpcomingClasses.module.css';

const UpcomingClasses = () => {
    userAuthRoute();
    const user = useAppSelector((state) => state.user);
    const [cancelledScheduleDialog, setCancelledScheduleDialog] = useState(false);
    const [upcomingClasses, setUpcomingClasses] = useState([]);
    const [cancelItem, setCancelItem] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [filters, setFilters] = useState({ subject: '', dept: '', sem: '', day: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [visibleCardCount, setVisibleCardCount] = useState(0); // New state for staggered rendering

    /**
     * Fetches the upcoming classes from the backend API.
     * Sets loading state, retrieves token, makes the API call, and updates upcomingClasses state.
     * Resets visibleCardCount for animation on new data fetch.
     */
    const fetchUpcomingClasses = async () => {
        try {
            setIsLoading(true);
            const token = await getValidToken();
            const response = await axios.get('/classes/upcoming', {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            if (response.data.success) {
                setUpcomingClasses(response.data.upcomingClasses);
                setVisibleCardCount(0); // Reset for new data load
            }
        } catch (error) {
            console.error('Error fetching upcoming classes', error);
            toast.error("Failed to fetch upcoming classes.");
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Fetches all available subjects from the backend.
     * Updates the subjects state.
     */
    const fetchSubjectsData = async () => {
        try {
            const data = await fetchSubjects(user);
            setSubjects(data);
        } catch (error) {
            console.error('Error fetching subjects', error);
            toast.error("Failed to fetch subjects data.");
        }
    };

    /**
     * Initial data load on component mount.
     * Fetches both subjects and upcoming classes concurrently.
     */
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await Promise.all([fetchSubjectsData(), fetchUpcomingClasses()]);
        };
        loadData();
    }, []);

    /**
     * Filters the upcoming classes based on the selected filter criteria.
     */
    const filteredClasses = upcomingClasses.filter((cls) => {
        if (user.role !== 'teacher') return true;
        const { subject, dept, sem, day } = filters;
        return (
            (!subject || cls.subject === subject) &&
            (!dept || cls.department.toLowerCase() === dept.toLowerCase()) &&
            (!sem || cls.semester === sem) &&
            (!day || cls.day.toLowerCase() === day.toLowerCase())
        );
    });

    /**
     * Effect for staggered rendering of class cards.
     * Increments `visibleCardCount` over time to reveal cards one by one.
     */
    useEffect(() => {
        if (!isLoading && filteredClasses.length > 0 && visibleCardCount < filteredClasses.length) {
            const timer = setTimeout(() => {
                setVisibleCardCount((prevCount) => prevCount + 1);
            }, 100); // Adjust delay here (e.g., 100ms per card)
            return () => clearTimeout(timer); // Cleanup on unmount or re-render
        }
        // If loading starts or no filtered classes, reset visibleCardCount to 0
        if ((!isLoading && filteredClasses.length === 0) || isLoading) {
            setVisibleCardCount(0);
        }
    }, [isLoading, filteredClasses, visibleCardCount]);


    /**
     * Handles the cancellation of a subject.
     * Makes an API call to cancel the class and updates the local state.
     * @param {object} data - The class object to be cancelled.
     */
    const handleCancelSubject = async (data) => {
        try {
            const token = await getValidToken();
            const response = await axios.post(
                `/classes/cancel-classes`,
                {
                    scheduleSlotId: data.scheduleSlotId,
                    date: data.date,
                    reason: "Cancelled by teacher",
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );

            if (response.data.success) {
                toast.success(response.data.message);

                setUpcomingClasses((prev) =>
                    prev.map((item) => {
                        if (
                            item.scheduleSlotId === data.scheduleSlotId &&
                            item.date === data.date
                        ) {
                            return { ...item, isCancelled: true, reason: "Cancelled by teacher" };
                        }
                        return item;
                    })
                );
            }
        } catch (error) {
            console.error("Failed to cancel the class Error:", error);
            const message = error.response?.data?.message || "Failed to cancel the class";
            toast.error(message);
        }
    };

    /**
     * Clears all applied filters and resets the visible card count.
     */
    const clearFilter = () => {
        setFilters({ subject: '', dept: '', sem: '', day: '' });
        setVisibleCardCount(0); // Reset animation when filters clear
    };

    /**
     * Helper function to format minutes (e.g., 630 for 10:30 AM) into a time string (e.g., "10:30 AM").
     * @param {number} minutes - Total minutes from midnight.
     * @returns {string} Formatted time string.
     */
    const formatMinutesToTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const h = hours % 12 || 12; // Convert 24hr to 12hr format, 0 becomes 12
        const ampm = hours >= 12 ? "PM" : "AM";
        return `${h}:${mins.toString().padStart(2, "0")} ${ampm}`;
    };

    /**
     * Renders a single upcoming class card.
     * @param {object} e - The class object.
     * @param {number} idx - The index for staggered animation.
     */
    const renderCard = (e, idx) => (
        <div
            key={idx}
            className={`w-full h-fit px-5 py-2 mb-3 rounded-md bg-[var(--card)] fade-in-card`}
            style={{ animationDelay: `${idx * 50}ms` }} // Apply staggered animation delay
        >
            <div className="flex justify-between items-start">
                <div className="w-full">
                    <div className="flex items-center justify-between pr-5 w-full">
                        <h2 className="text-[var(--white-8)] text-lg flex items-center gap-1.5 font-extrabold">
                            {e.subject}
                            <NotebookPen size={15} />
                            <span className="border-emerald-500 border text-emerald-700 text-xs ml-3 px-4 rounded-2xl py-0.5 mr-1">
                                {e.department}
                            </span>
                            <span className="border-fuchsia-600 border text-fuchsia-700 text-xs px-4 rounded-2xl py-0.5">
                                {e.semester}
                            </span>
                        </h2>
                        <div className="flex gap-2">
                            <span className="text-xs bg-[var(--yg-chips)] border border-[var(--yg-b-chips)] h-fit px-2.5 py-0.5 text-[var(--yg-t-chips)] rounded-full">{e.day}</span>
                            {/* Display date in DD-MM-YYYY format and time in HH:MM AM/PM */}
                            <span className="text-xs bg-[var(--p-chips)] py-0.5 h-fit px-2 border border-[var(--p-b-chips)] text-[var(--p-t-chips)] rounded-full">
                                {new Date(e.date).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                {' '} {/* Add a space between date and time */}
                                {formatMinutesToTime(e.startTime)} - {formatMinutesToTime(e.endTime)}
                            </span>
                            <span className="bg-[var(--white-4)] px-4 py-0 text-xs text-center content-center rounded-2xl text-[var(--white-7)] border border-[var(--white-5)]">
                                {e.code}
                            </span>
                            {!e.isCancelled && user.role === "teacher" && (
                                <button
                                    onClick={() => {
                                        setCancelledScheduleDialog(true);
                                        setCancelItem(e);
                                    }}
                                    className="text-red-500 rounded-md border bg-[var(--p-chips)] border-red-600 hover:bg-red-500 hover:text-white cursor-pointer text-xs px-2 "
                                >
                                    Cancel Class
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between items-center pr-5">
                        <div>
                            <h3 className="text-md text-[var(--white-6)] mb-1 flex items-center gap-1">Teacher: {e.teacher}<PenIcon size={12} /></h3>
                            <div className="text-xs flex gap-1.5 mb-1">
                                {/* The duration span remains as is */}
                                <p className="w-fit px-2 py-0.5 bg-[var(--b-chips)] rounded-sm text-[var(--white-7)] font-semibold border border-[var(--b-b-chips)]">
                                    Duration{' '}
                                    <b>
                                        {Math.floor((e.endTime - e.startTime) / 60) > 0 &&
                                            `${Math.floor((e.endTime - e.startTime) / 60)}h `}
                                        {(e.endTime - e.startTime) % 60 !== 0 && `${(e.endTime - e.startTime) % 60}m`}
                                    </b>
                                </p>
                            </div>
                        </div>
                        {e.isCancelled ? (
                            <span className="text-xs py-1.5 px-3 rounded-md bg-red-600 text-white">Cancelled</span>
                        ) : (
                            <span className="text-xs py-1.5 px-3 rounded-md bg-[var(--b-chips)] border border-[var(--b-b-chips)] text-white">Upcoming</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-[100%] px-[2.5%] py-[1.5%]">
            <h1 className="text-xl text-[var(--white-8)] font-extrabold">Upcoming Classes</h1>
            <p className="text-[var(--white-6)] mb-6">All your upcoming scheduled classes are listed here</p>

            {user.role === 'teacher' && (
                <div className="filter-container rounded-sm w-full flex items-center gap-3">
                    <Select
                        value={filters.day}
                        onValueChange={(value) => { setFilters((prev) => ({ ...prev, day: value })); setVisibleCardCount(0); }}
                    >
                        <SelectTrigger className="w-[120px] h-6 rounded-[4px] bg-[var(--white-2)] border border-[var(--white-4)] text-[var(--white-7)] text-sm">
                            <SelectValue placeholder="Day" />
                        </SelectTrigger>
                        <SelectContent className=" bg-[var(--white-9)] border-0 text-stone-400">
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                                <SelectItem key={day} value={day.toLowerCase()}>
                                    {day}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={filters.dept}
                        onValueChange={(value) => { setFilters((prev) => ({ ...prev, dept: value })); setVisibleCardCount(0); }}
                    >
                        <SelectTrigger className="w-[80px] h-6 rounded-[4px] bg-[var(--white-2)] border border-[var(--white-4)] text-[var(--white-7)] text-sm">
                            <SelectValue placeholder="Dept" />
                        </SelectTrigger>
                        <SelectContent className=" bg-[var(--white-9)] border-0 text-stone-400">
                            {['CST', 'CFS', 'EE', 'ID', 'MTR'].map((dept) => (
                                <SelectItem key={dept} value={dept.toLowerCase()}>
                                    {dept}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={filters.sem}
                        onValueChange={(value) => { setFilters((prev) => ({ ...prev, sem: value })); setVisibleCardCount(0); }}
                    >
                        <SelectTrigger className="w-[80px] h-6 rounded-[4px] bg-[var(--white-2)] border border-[var(--white-4)] text-[var(--white-7)] text-sm">
                            <SelectValue placeholder="Sem" />
                        </SelectTrigger>
                        <SelectContent className=" bg-[var(--white-9)] border-0 text-stone-400">
                            {['1st', '2nd', '3rd', '4th', '5th', '6th'].map((sem) => (
                                <SelectItem key={sem} value={sem}>
                                    {sem}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={filters.subject}
                        onValueChange={(value) => { setFilters((prev) => ({ ...prev, subject: value })); setVisibleCardCount(0); }}
                    >
                        <SelectTrigger className="min-w-16 transition-all duration-300 h-6 rounded-[4px] bg-[var(--white-2)] border border-[var(--white-4)] text-[var(--white-7)] text-sm ">
                            <SelectValue placeholder="Subject" />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--white-9)] border-0 text-stone-400 w-120 ">
                            {subjects.map((subject) => (
                                <SelectItem key={subject._id} value={subject.subject}>
                                    <span className='text-nowrap truncate '>{subject.subject}</span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <RefreshCcw
                        size="26"
                        className="cursor-pointer text-[var(--white-7)] p-1.5 rounded-full hover:bg-[var(--white-4)]"
                        onClick={clearFilter}
                    />
                </div>
            )}

            <div className="mt-10">
                {isLoading ? (
                    <CircularLoader />
                ) : (
                    filteredClasses.length > 0 ? (
                        filteredClasses.slice(0, visibleCardCount).map((e, idx) => renderCard(e, idx))
                    ) : (
                        <p className="text-[var(--white-6)] text-sm">No upcoming classes found</p>
                    )
                )}
                <AlertDialog open={cancelledScheduleDialog} onOpenChange={setCancelledScheduleDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently cancel your schedule.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="cursor-pointer" >Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700 cursor-pointer"
                                onClick={() => {
                                    console.log(cancelItem)
                                    if (cancelItem) {
                                        handleCancelSubject(cancelItem);
                                    }
                                    setCancelledScheduleDialog(false);
                                }}
                            >
                                Apply
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
};

export default UpcomingClasses;

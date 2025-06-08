import React, { useEffect, useState } from 'react';
import { getValidToken } from '@/Utils/getValidToken';
import axios from 'axios';
import { Ellipsis, NotebookPen, RefreshCcw } from 'lucide-react';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { toast } from 'sonner';

const UpcomingClasses = () => {
    const user = useAppSelector((state) => state.user);
    const [cancelledScheduleDialog, setCancelledScheduleDialog] = useState(false);
    const [upcomingClasses, setUpcomingClasses] = useState([]);
    const [cancelItem, setCancelItem] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [filters, setFilters] = useState({ subject: '', dept: '', sem: '', day: '' });

    const fetchUpcomingClasses = async () => {
        try {
            const token = await getValidToken();
            const response = await axios.get('http://localhost:8000/api/v1/classes/upcoming', {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            if (response.data.success) {
                setUpcomingClasses(response.data.upcomingClasses);
            }
        } catch (error) {
            console.error('Error fetching upcoming classes', error);
        }
    };

    const fetchSubjectsData = async () => {
        const data = await fetchSubjects(user);
        setSubjects(data);
    };

    useEffect(() => {
        fetchSubjectsData();
        fetchUpcomingClasses();
    }, []);

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

    const handleCancelSubject = async (data) => {
        try {
            const token = await getValidToken();
            const response = await axios.post(
                `http://localhost:8000/api/v1/classes/cancel-class`,
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

    const clearFilter = () => {
        setFilters({ subject: '', dept: '', sem: '', day: '' });
    };

    const renderCard = (e, idx) => (
        <div key={idx} className="w-full h-fit px-5 py-2 mb-3 rounded-md bg-[var(--card)]">
            <div className="flex justify-between items-start">
                <div className="w-full">
                    <div className="flex items-center justify-between pr-5 w-full">
                        <h2 className="text-[var(--white-8)] text-lg flex items-center gap-1.5 font-extrabold">
                            {e.subject}
                            <NotebookPen size={15} />
                            <span className="bg-emerald-300 text-stone-800 text-xs ml-3 px-3 rounded-2xl py-0.5">
                                {e.department}
                            </span>
                            <span className="bg-teal-200 text-stone-800 text-xs px-3 rounded-2xl py-0.5">
                                {e.semester}
                            </span>
                        </h2>
                        <div className="flex gap-2">
                            <span className="text-xs bg-amber-100 h-fit px-1.5 rounded-full">{e.day}</span>
                            <span className="text-xs bg-amber-100 h-fit px-1.5 rounded-full">{e.date}</span>
                            <span className="bg-[var(--white-4)]  h-fit text-center content-center px-3 py-0.5 text-xs rounded-full text-[var(--white-7)]">
                                {e.code}
                            </span>
                            {!e.isCancelled && (
                                        <button
                                            onClick={() => {
                                                setCancelledScheduleDialog(true);
                                                setCancelItem(e);
                                            }}
                                            className="text-teal-700 rounded-md border border-orange-200 hover:bg-red-500 hover:text-white cursor-pointer text-xs px-2 "
                                        >
                                            Cancel Class
                                        </button>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between items-center pr-5">
                        <div>
                            <h3 className="text-md text-[var(--white-8)]">Teacher: {e.teacher}</h3>
                            <div className="text-xs flex gap-1.5 mb-1">
                                <p className="w-fit px-2 py-0.5 bg-orange-100 rounded-sm text-[var(--black)]">
                                    Starts at{' '}
                                    <b>
                                        {Math.floor(e.startTime / 60)}:{(e.startTime % 60).toString().padStart(2, '0')}
                                    </b>{' '}
                                    —{' '}
                                    <b>
                                        {Math.floor(e.endTime / 60)}:{(e.endTime % 60).toString().padStart(2, '0')}
                                    </b>
                                </p>
                                <p className="w-fit px-2 py-0.5 bg-emerald-100 rounded-sm text-[var(--black)]">
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
                            <span className="text-xs py-1.5 px-3 rounded-md bg-blue-600 text-white">Upcoming</span>
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
                        onValueChange={(value) => setFilters((prev) => ({ ...prev, day: value }))}
                    >
                        <SelectTrigger className="w-[120px] h-6 rounded-[4px] bg-[var(--white-2)] border text-stone-400 text-sm">
                            <SelectValue placeholder="Day" />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--white-1)] text-stone-400">
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                                <SelectItem key={day} value={day.toLowerCase()}>
                                    {day}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={filters.dept}
                        onValueChange={(value) => setFilters((prev) => ({ ...prev, dept: value }))}
                    >
                        <SelectTrigger className="w-[80px] h-6 rounded-[4px] bg-[var(--white-2)] border text-stone-400 text-sm">
                            <SelectValue placeholder="Dept" />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--white-1)] text-stone-400">
                            {['CST', 'CFS', 'EE', 'ID', 'MTR'].map((dept) => (
                                <SelectItem key={dept} value={dept.toLowerCase()}>
                                    {dept}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={filters.sem}
                        onValueChange={(value) => setFilters((prev) => ({ ...prev, sem: value }))}
                    >
                        <SelectTrigger className="w-[80px] h-6 rounded-[4px] bg-[var(--white-2)] border text-stone-400 text-sm">
                            <SelectValue placeholder="Sem" />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--white-1)] text-stone-400">
                            {['1st', '2nd', '3rd', '4th', '5th', '6th'].map((sem) => (
                                <SelectItem key={sem} value={sem}>
                                    {sem}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={filters.subject}
                        onValueChange={(value) => setFilters((prev) => ({ ...prev, subject: value }))}
                    >
                        <SelectTrigger className="w-[80px] h-6 rounded-[4px] bg-[var(--white-2)] border text-stone-400 text-sm">
                            <SelectValue placeholder="Subject" />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--white-1)] text-stone-400">
                            {subjects.map((subject) => (
                                <SelectItem key={subject._id} value={subject.subject}>
                                    {subject.subject}
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
                {/* {console.log(filteredClasses)} */}
                {filteredClasses.length > 0 ? (
                    filteredClasses.map((e, idx) => renderCard(e, idx))
                ) : (
                    <p className="text-[var(--white-6)] text-sm">No upcoming classes found</p>
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

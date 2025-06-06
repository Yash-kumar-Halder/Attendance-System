import React, { useEffect, useState } from 'react'
import { BookOpen, RefreshCcw, User } from 'lucide-react'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { toast } from 'sonner'
import axios from 'axios'
import { useAppSelector } from "../../hooks/index.js"

const ScheduleClasses = () => {

    const user = useAppSelector((state) => state.user);
    const [allSchedules, setAllSchedules] = useState([]);
    const [filters, setFilters] = useState({
        day: "",
        subject: "",
        department: "",
        semester: "",
    });

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

    const fetchScheduleSubjects = async () => {
    try {
        const token = await getValidToken();
        let response;

        if (user.role === "student") {
            response = await axios.post(
                "http://localhost:8000/api/v1/shedule/student/get",
                {}, // No need to send user
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );
        } else {
            response = await axios.post(
                "http://localhost:8000/api/v1/shedule/get",
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );
        }

        if (response.data.success) {
            const filtered = filterSchedule(response.data.scheduleClasses, filters);
            const sorted = sortScheduleByCurrentDay(filtered);
            setAllSchedules(sorted);
        }
    } catch (error) {
        console.error("Failed to fetch subjects", error);
        toast.error("Failed to fetch subjects");
    }
};


    useEffect(() => {
        if (user?.role) {
            fetchScheduleSubjects();
        }
    }, [filters, user?.role]);


    const filterSchedule = (classes, filters) => {
        return classes.filter((item) => {
            const matchDay = filters.day ? item.day === filters.day : true;
            const matchSubject = filters.subject
                ? item.subject.subject.toLowerCase().includes(filters.subject.toLowerCase())
                : true;
            const matchDepartment = filters.department
                ? item.subject.department === filters.department
                : true;
            const matchSemester = filters.semester
                ? item.subject.semester === filters.semester
                : true;

            return matchDay && matchSubject && matchDepartment && matchSemester;
        });
    };

    const sortScheduleByCurrentDay = (classes) => {
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const today = new Date().getDay(); // Sunday=0, Monday=1, ...
        const todayName = days[(today + 6) % 7]; // convert to your format (e.g., Monday=0)

        // Reorder days so today comes first
        const reorderedDays = [
            ...days.slice(days.indexOf(todayName)),
            ...days.slice(0, days.indexOf(todayName)),
        ];

        // Sort first by day priority, then by startTime
        return classes.sort((a, b) => {
            const dayCompare =
                reorderedDays.indexOf(a.day) - reorderedDays.indexOf(b.day);

            if (dayCompare === 0) {
                return a.startTime - b.startTime;
            }
            return dayCompare;
        });
    };


    const handleSelectChange = (type, value) => {
        setFilters((prev) => ({
            ...prev,
            [type]: value
        }));
    }

    const scheduleClassesHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:8000/api/v1/shedule/set",
                data
            );
            if (response.data.success) {
                dispatch(setUser(response.data.user));
            } else {
                toast.error(response.data?.message || "Schedule failed");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
            console.error("Signup error:", error);
        }
    }

    const formatTime = (number) => {
        const hour = Math.floor(number / 60);
        const minute = number % 60;
        return `${hour}:${minute.toString().padStart(2, '0')}`;
    };

    const refreshFilterData = () => {
        setFilters({
            day: "",
            subject: "",
            department: "",
            semester: "",
        })
    }


    return (
        <div className='w-[100%] px-[2.5%] py-[1.5%] ' >
            {user.role === "teacher" && (<><h1 className='text-xl text-[var(--white-8)] font-extrabold' >Schedule Your Classes</h1>
                <span className='flex items-center gap-1 text-xs text-[var(--white-6)] ' ><User size="14" />Total classes: 122</span>
                <form className='mb-8 ' onSubmit={scheduleClassesHandler} >
                    <h3 className=' mt-12 font-semibold text-[var(--white-7)]' >Select detailes</h3>

                    {/* Schedule class details panel */}
                    <div className='w-fit ' >
                        <div className="filter-container rounded-sm w-full flex items-center gap-3 ">
                            <Select value={filters.day} onValueChange={(e) => handleSelectChange("day", e)} >
                                <SelectTrigger className="cursor-pointer hover:border-amber-500 w-[120px] h-6 rounded-[4px] bg-[var(--white-2)] border border-[var(--white-6)] text-stone-400 text-sm placeholder:text-stone-100">
                                    <SelectValue className="h-5" placeholder="Day" />
                                </SelectTrigger>
                                <SelectContent className="bg-[var(--white-1)] text-stone-300">
                                    <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="Monday">Monday</SelectItem>
                                    <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="Tuesday">Tuesday</SelectItem>
                                    <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="Wednesday">Wednesday</SelectItem>
                                    <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="Thrursday">Thrursday</SelectItem>
                                    <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="Friday">Friday</SelectItem>
                                    <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="Saturday">Saturday</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={filters.department} onValueChange={(e) => handleSelectChange("department", e)} >
                                <SelectTrigger className="cursor-pointer hover:border-amber-500 w-[80px] h-6 rounded-[4px] bg-[var(--white-2)] border border-[var(--white-6)] text-stone-400 text-sm placeholder:text-stone-100">
                                    <SelectValue className="h-5" placeholder="Dept" />
                                </SelectTrigger>
                                <SelectContent className="bg-[var(--white-1)] text-stone-300">
                                    <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="CST">CST</SelectItem>
                                    <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="CFS">CFS</SelectItem>
                                    <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="EE">EE</SelectItem>
                                    <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="iIDd">ID</SelectItem>
                                    <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="MTR">MTR</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={filters.subject} onValueChange={(e) => handleSelectChange("subject", e)} >
                                <SelectTrigger className="cursor-pointer hover:border-amber-500 w-[80px] h-6 rounded-[4px] bg-[var(--white-2)] border border-[var(--white-6)] text-stone-400 text-sm placeholder:text-stone-100">
                                    <SelectValue className="h-5" placeholder="Subject" />
                                </SelectTrigger>
                                <SelectContent className="bg-[var(--white-1)] text-stone-300">
                                    <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="Java">Java</SelectItem>
                                    <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="software engin">Software Engin</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={filters.semester} onValueChange={(e) => handleSelectChange("semester", e)} >
                                <SelectTrigger className="cursor-pointer hover:border-amber-500 w-[80px] h-6 rounded-[4px] bg-[var(--white-2)] border border-[var(--white-6)] text-stone-400 text-sm placeholder:text-stone-100">
                                    <SelectValue className="h-5" placeholder="Sem" />
                                </SelectTrigger>
                                <SelectContent className="bg-[var(--white-1)] text-stone-300">
                                    <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="1st">1st</SelectItem>
                                    <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="2nd">2nd</SelectItem>
                                    <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="3rd">3rd</SelectItem>
                                    <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="4th">4th</SelectItem>
                                    <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="5th">5th</SelectItem>
                                    <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="6th">6th</SelectItem>
                                </SelectContent>
                            </Select>
                            <RefreshCcw onClick={refreshFilterData} size="26" className='cursor-pointer text-[var(--white-7)] p-1.5 rounded-full hover:bg-[var(--white-4)] ' />
                        </div>
                        <div className="filter-container rounded-sm w-full flex items-center gap-3 mt-2">
                        </div>
                    </div>


                    <Button type="submit" className="mt-6 cursor-pointer active:scale-95 bg-emerald-600 hover:bg-emerald-400" >Schedule class</Button>
                </form></>) }

            <div >
                <h1 className='text-lg font-bold mb-4' >Scheduled Classes</h1>
                {allSchedules.map((e) => (
                    <div
                        key={e._id}
                        className="w-full h-24 px-5 py-2 rounded-md bg-[var(--card)] mb-3"
                    >
                        <div className="flex justify-between items-start">
                            <div className="w-full">
                                <div className="flex justify-between pr-5 w-full">
                                    <h2 className="text-[var(--white-8)] text-lg leading-3 mt-1.5 flex items-center gap-1.5 font-extrabold">
                                        {e.subject.subject}
                                        <BookOpen size="15" />
                                    </h2>
                                    <span className="bg-[var(--white-4)] px-3 rounded-2xl text-[var(--white-7)]">
                                        {e.subject.code}
                                    </span>
                                </div>
                                <h3 className="text-md text-[var(--white-8)]">
                                    Teacher: {e.subject.teacher}
                                </h3>
                                <div className="flex gap-2 text-xs mt-1">
                                    <span className="bg-emerald-300 px-3 rounded-2xl py-0.5">
                                        {e.subject.department}
                                    </span>
                                    <span className="bg-teal-200 px-3 rounded-2xl py-0.5">
                                        {e.subject.semester}
                                    </span>
                                    <span className="bg-indigo-200 px-3 rounded-2xl py-0.5">
                                        {e.day}
                                    </span>
                                    <span className="bg-orange-300 px-3 rounded-2xl py-0.5">
                                        {formatTime(e.startTime)} - {formatTime(e.endTime)}
                                    </span>
                                </div>
                            </div>

                            {/* <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Ellipsis className="cursor-pointer text-[var(--white-9)]" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setScheduleItem(e._id);
                                            setOpenScheduleDialog(true);
                                        }}
                                        className="text-teal-500 hover:bg-teal-100 cursor-pointer"
                                    >
                                        Schedule
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Billing</DropdownMenuItem>
                                    <DropdownMenuItem>Team</DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="text-red-500 cursor-pointer hover:bg-red-200"
                                        onClick={() => {
                                            setDeleteItem(e._id);
                                            setOpenDeleteDialog(true);
                                        }}
                                    >
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu> */}
                        </div>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default ScheduleClasses
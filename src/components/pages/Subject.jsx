import React, { useEffect, useState } from 'react';
import { Coffee, Ellipsis, User } from 'lucide-react';
import { Button } from '../ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '../ui/alert-dialog';
import { toast } from 'sonner';
import axios from 'axios';
import { useAppSelector, useAppDispatch } from "../../hooks/index.js";
import { setSubjects } from '@/Redux/Slices/Application/subjects';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import SubjectCard from '../Skeleton/SubjectCard';

const Subject = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);
    const reduxSubjects = useAppSelector((state) => state.subject.subjects || []);

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
    const [deleteItem, setDeleteItem] = useState("");
    const [scheduleItem, setScheduleItem] = useState("");
    const [isSkeleton, setIsSkeleton] = useState(true)
    const [data, setData] = useState({
        subject: "",
        code: "",
        teacher: "",
        department: "",
        semester: "",
    });
    const [scheduleData, setScheduleData] = useState({
        subject: "",
        day: "",
        startTime: "",
        endTime: ""
    });

    // Utility function to get token, refresh if needed
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

    // Fetch subjects
    const fetchSubjects = async () => {
        try {
            setIsSkeleton(true);
            const token = await getValidToken();
            let response;
            if (user.role === "student") {
                response = await axios.get("http://localhost:8000/api/v1/subject/student/get", {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                });
            } else {
                response = await axios.get("http://localhost:8000/api/v1/subject/get", {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                });
            }

            if (response.data.success) {
                dispatch(setSubjects(response.data.subjects));
                setIsSkeleton(false);
            }
        } catch (error) {
            console.error("Failed to fetch subjects", error);
            toast.error("Failed to fetch subjects");
            setIsSkeleton(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleScheduleSelectChange = (field, value) => {
        setScheduleData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };


    const handleSelectChange = (type, value) => {
        setData((prev) => ({
            ...prev,
            [type]: value,
        }));
    };

    const subjectHandler = async (e) => {
        e.preventDefault();
        try {
            const token = await getValidToken();
            await axios.post(
                "http://localhost:8000/api/v1/subject/set",
                data,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );

            toast.success("Subject added successfully!");
            setData({
                subject: "",
                code: "",
                teacher: "",
                department: "",
                semester: "",
            });
            fetchSubjects();
        } catch (error) {
            console.error("Add subject error", error);
            toast.error(error?.response?.data?.message || "Something went wrong while adding subject");
        }
    };

    const handleDeleteSubject = async (id) => {
        try {
            const token = await getValidToken();
            const response = await axios.delete(
                `http://localhost:8000/api/v1/subject/delete/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );

            if (response.data.success) {
                toast.success(response.data.message);
                fetchSubjects();
            }
        } catch (error) {
            console.error("Delete Error:", error);
            toast.error("Failed to delete subject");
        }
    };

    const handleScheduleSubject = async (id) => {
        try {
            const updatedData = {
                ...scheduleData,
                subject: scheduleItem,
            };

            setScheduleData(updatedData); // ✅ still update the UI

            const token = await getValidToken();
            const response = await axios.post(
                `http://localhost:8000/api/v1/shedule/set`,
                updatedData, // ✅ send correct data
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );

            if (response.data.success) {
                toast.success(response.data.message);
            }
        } catch (error) {
            console.error("Schedule Error:", error);
            toast.error("Failed to schedule subject");
        }
    };


    const timeOptions = Array.from({ length: 8 }, (_, hourIndex) => {
        const hour = 10 + hourIndex;
        return Array.from({ length: 6 }, (_, minIndex) => {
            const minute = minIndex * 10;
            if (hour === 17 && minute > 0) return null; // Only allow 17:00
            const timeValue = `${hour}:${minute.toString().padStart(2, '0')}`;
            return (
                <SelectItem
                    key={`${hour}-${minute}`}
                    className="cursor-pointer hover:bg-[var(--white-2)] text-[var(--white-6)]"
                    value={timeValue}
                >
                    {timeValue}
                </SelectItem>
            );
        }).filter(Boolean);
    }).flat();

    return (
        <div className="w-[100%] px-[2.5%] py-[1.5%]">
            {user.role === "teacher" && (<><h1 className="text-xl text-[var(--white-8)] font-extrabold">Schedule Your Classes</h1>
                <span className="flex items-center gap-1 text-xs text-[var(--white-6)]">
                    <User size="14" />
                    Total classes: 122
                </span>

                <form onSubmit={subjectHandler} className='mb-8'>
                    <h3 className="mt-12 font-semibold text-[var(--white-7)]">Select detailes</h3>
                    <div className="w-fit">
                        <div className="filter-container rounded-sm w-full flex items-center gap-3">
                            <div className="mb-4 w-full">
                                <label
                                    className="w-full text-sm font-medium text-[var(--white-7)] mb-2"
                                    htmlFor="subject"
                                >
                                    Subject name
                                </label>
                                <input
                                    name="subject"
                                    onChange={handleChange}
                                    value={data.subject}
                                    type="text"
                                    id="subject"
                                    className="w-full bg-[var(--white-2)] px-3 py-2 border border-[var(--white-5)] rounded focus:outline-none focus:ring focus:ring-none focus:border-[var(--white-4)] placeholder:text-[var(--white-6)] text-[var(--white-8)] active:bg-[var(--white-1)]"
                                    placeholder="Enter subject name"
                                    required
                                />
                            </div>
                            <div className="mb-4 w-full">
                                <label
                                    className="w-full text-sm font-medium text-[var(--white-7)] mb-2"
                                    htmlFor="code"
                                >
                                    Subject code
                                </label>
                                <input
                                    name="code"
                                    onChange={handleChange}
                                    value={data.code}
                                    type="text"
                                    id="code"
                                    className="w-full bg-[var(--white-2)] px-3 py-2 border border-[var(--white-5)] rounded focus:outline-none focus:ring focus:ring-none focus:border-[var(--white-4)] placeholder:text-[var(--white-6)] text-[var(--white-8)] active:bg-[var(--white-1)]"
                                    placeholder="Enter subject code"
                                    required
                                />
                            </div>
                            <div className="mb-4 w-full">
                                <label
                                    className="w-full text-sm font-medium text-[var(--white-7)] mb-2"
                                    htmlFor="teacher"
                                >
                                    Teacher
                                </label>
                                <input
                                    name="teacher"
                                    onChange={handleChange}
                                    value={data.teacher}
                                    type="text"
                                    id="teacher"
                                    className="w-full bg-[var(--white-2)] px-3 py-2 border border-[var(--white-5)] rounded focus:outline-none focus:ring focus:ring-none focus:border-[var(--white-4)] placeholder:text-[var(--white-6)] text-[var(--white-8)] active:bg-[var(--white-1)]"
                                    placeholder="Enter teacher's name"
                                    required
                                />
                            </div>

                            <Select
                                value={data.department}
                                onValueChange={(e) => handleSelectChange("department", e)}
                            >
                                <SelectTrigger className="cursor-pointer hover:border-amber-500 w-[300px] h-10 mt-1.5 rounded-[4px] bg-[var(--white-2)] border border-[var(--white-6)] text-stone-400 text-sm placeholder:text-stone-100">
                                    <SelectValue className="h-5" placeholder="Dept" />
                                </SelectTrigger>
                                <SelectContent className="bg-[var(--white-1)] text-stone-300">
                                    <SelectItem value="CST">CST</SelectItem>
                                    <SelectItem value="CFS">CFS</SelectItem>
                                    <SelectItem value="EE">EE</SelectItem>
                                    <SelectItem value="ID">ID</SelectItem>
                                    <SelectItem value="MTR">MTR</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={data.semester}
                                onValueChange={(e) => handleSelectChange("semester", e)}
                            >
                                <SelectTrigger className="cursor-pointer hover:border-amber-500 w-[250px] h-10 mt-1.5 rounded-[4px] bg-[var(--white-2)] border border-[var(--white-6)] text-stone-400 text-sm placeholder:text-stone-100">
                                    <SelectValue className="h-5" placeholder="Sem" />
                                </SelectTrigger>
                                <SelectContent className="bg-[var(--white-1)] text-stone-300">
                                    <SelectItem value="1st">1st</SelectItem>
                                    <SelectItem value="2nd">2nd</SelectItem>
                                    <SelectItem value="3rd">3rd</SelectItem>
                                    <SelectItem value="4th">4th</SelectItem>
                                    <SelectItem value="5th">5th</SelectItem>
                                    <SelectItem value="6th">6th</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="mt-6 cursor-pointer active:scale-95 bg-emerald-600 hover:bg-emerald-400"
                    >
                        Add class
                    </Button>
                </form></>)}

            <div>
                <h1 className="text-lg font-bold mb-4">All Classes</h1>
                <div className="flex flex-col gap-4">
                    <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your schedule.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={() => {
                                        handleDeleteSubject(deleteItem);
                                        setOpenDeleteDialog(false);
                                    }}
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog open={openScheduleDialog} onOpenChange={setOpenScheduleDialog}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Schedule your class</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action can be changeble. <br /> you can change it later after schedule.
                                </AlertDialogDescription>
                                <div className='flex  gap-5 items-center mb-6 ' >
                                    <Select value={scheduleData.day}
                                        onValueChange={(e) => handleScheduleSelectChange("day", e)}>
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
                                    <div className='flex gap-3 items-center' >
                                        <Select
                                            value={scheduleData.start}
                                            onValueChange={(value) => handleScheduleSelectChange('startTime', value)}
                                        >
                                            <SelectTrigger className="cursor-pointer hover:border-amber-500 w-[90px] h-6 rounded-[4px] bg-[var(--white-2)] border border-[var(--white-6)] text-stone-400 text-sm placeholder:text-stone-100">
                                                <SelectValue className="h-5" placeholder="Start Time" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[var(--white-1)] text-stone-300 max-h-60 overflow-y-auto">
                                                {timeOptions}
                                            </SelectContent>
                                        </Select>

                                        <span className='text-[var(--white-7)] text-sm ' >To</span>

                                        {/* End Time Selector */}
                                        <Select
                                            value={scheduleData.end}
                                            onValueChange={(value) => handleScheduleSelectChange('endTime', value)}
                                        >
                                            <SelectTrigger className="cursor-pointer hover:border-amber-500 w-[90px] h-6 rounded-[4px] bg-[var(--white-2)] border border-[var(--white-6)] text-stone-400 text-sm placeholder:text-stone-100">
                                                <SelectValue className="h-5" placeholder="End Time" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[var(--white-1)] text-stone-300 max-h-60 overflow-y-auto">
                                                {timeOptions}
                                            </SelectContent>
                                        </Select>



                                        {/* <Select
                                            value={scheduleData.end}
                                            onValueChange={(value) => handleScheduleSelectChange('end', value)}
                                        >
                                            <SelectTrigger className="cursor-pointer hover:border-amber-500 w-[90px] h-6 rounded-[4px] bg-[var(--white-2)] border border-[var(--white-6)] text-stone-400 text-sm placeholder:text-stone-100">
                                                <SelectValue className="h-5" placeholder="End" />
                                            </SelectTrigger>

                                            <SelectContent className="bg-[var(--white-1)] text-stone-300 max-h-60 overflow-y-auto">
                                                {Array.from({ length: 8 }, (_, hourIndex) => {
                                                    const hour = 10 + hourIndex;
                                                    return Array.from({ length: 6 }, (_, minIndex) => {
                                                        const minute = minIndex * 10;
                                                        if (hour === 17 && minute > 0) return null; // Only allow 17:00
                                                        const timeValue = `${hour}:${minute.toString().padStart(2, '0')}`;
                                                        return (
                                                            <SelectItem
                                                                key={timeValue}
                                                                className="cursor-pointer hover:bg-[var(--white-2)] text-[var(--white-6)]"
                                                                value={timeValue}
                                                            >
                                                                {timeValue}
                                                            </SelectItem>
                                                        );
                                                    }).filter(Boolean);
                                                }).flat()}
                                            </SelectContent>
                                        </Select> */}
                                    </div>
                                </div>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => {
                                    setOpenScheduleDialog(false)
                                }}
                                    className="cursor-pointer"
                                >Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-red-600 cursor-pointer hover:bg-red-700"
                                    onClick={() => {
                                        handleScheduleSubject(scheduleItem);
                                        setOpenDeleteDialog(false);
                                    }}
                                >
                                    Apply
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    {reduxSubjects.length === 0 && <h1>No subject added...</h1>}

                    {reduxSubjects.map((e) => (
                        <div
                            key={e._id + "-" + Date.now()}
                            className="w-full h-24 px-5 py-2 rounded-md bg-[var(--card)]"
                        >
                            <div className="flex justify-between items-start">
                                <div className="w-full">
                                    <div className="flex justify-between pr-5 w-full">
                                        <h2 className="text-[var(--white-8)] text-lg leading-3 mt-1.5 flex items-center gap-1.5 font-extrabold">
                                            {e.subject}
                                            <Coffee size="15" />
                                        </h2>
                                        <span className="bg-[var(--white-4)] px-3 rounded-2xl text-[var(--white-7)]">
                                            {e.code}
                                        </span>
                                    </div>
                                    <h3 className="text-md text-[var(--white-8)]">Teacher: {e.teacher}</h3>
                                    <div className="flex gap-2 text-xs">
                                        <span className="bg-emerald-300 px-3 rounded-2xl py-0.5">{e.department}</span>
                                        <span className="bg-teal-200 px-3 rounded-2xl py-0.5">{e.semester}</span>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Ellipsis className="cursor-pointer text-[var(--white-9)]" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => {
                                                setScheduleItem(e._id);
                                                setOpenScheduleDialog(true);
                                            }}
                                            className="text-teal-500 hover:bg-teal-100 cursor-pointer">Schedule</DropdownMenuItem>
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
                                </DropdownMenu>
                            </div>
                        </div>
                    ))}

                    {isSkeleton && (
                        <>
                            <SubjectCard />
                            <SubjectCard />
                            <SubjectCard />
                            <SubjectCard />
                            <SubjectCard />
                        </>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Subject;

import React, { useEffect, useState } from 'react'
import { Coffee, Ellipsis, RefreshCcw, Search, User } from 'lucide-react'
import { Button } from '../ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { toast } from 'sonner'
import axios from 'axios'
import { useAppDispatch, useAppSelector } from '@/hooks'

const ScheduleClasses = () => {

    const [data, setData] = useState({
        day: "",
        department: "",
        semester: "",
        subject: "6839bbb770351b99dcacf77d",
        startTime: "",
        endTime: ""
    })

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
            const token = await getValidToken();
            const response = await axios.post("http://localhost:8000/api/v1/shedule/get", {},{
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });

            if (response.data.success) {
                console.log(response.data)
            }
        } catch (error) {
            console.error("Failed to fetch subjects", error);
            toast.error("Failed to fetch subjects");
        }
    };
    // const subjects = useAppSelector((state) => state.subject);

    useEffect(() => {
        fetchSubjects();
    }, []);


    const handleSelectChange = (type, value) => {
        setData((prev) => ({
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


    return (
        <div className='w-[100%] px-[2.5%] py-[1.5%] ' >
            <h1 className='text-xl text-[var(--white-8)] font-extrabold' >Schedule Your Classes</h1>
            <span className='flex items-center gap-1 text-xs text-[var(--white-6)] ' ><User size="14" />Total classes: 122</span>
            <form onSubmit={scheduleClassesHandler} >
                <h3 className=' mt-12 font-semibold text-[var(--white-7)]' >Select detailes</h3>

                {/* Schedule class details panel */}
                <div className='w-fit ' >
                    <div className="filter-container rounded-sm w-full flex items-center gap-3 ">
                        <Select value={data.role} onValueChange={(e) => handleSelectChange("day", e)} >
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
                        <Select value={data.role} onValueChange={(e) => handleSelectChange("dept", e)} >
                            <SelectTrigger className="cursor-pointer hover:border-amber-500 w-[80px] h-6 rounded-[4px] bg-[var(--white-2)] border border-[var(--white-6)] text-stone-400 text-sm placeholder:text-stone-100">
                                <SelectValue className="h-5" placeholder="Dept" />
                            </SelectTrigger>
                            <SelectContent className="bg-[var(--white-1)] text-stone-300">
                                <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="cst">CST</SelectItem>
                                <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="cfs">CFS</SelectItem>
                                <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="ee">EE</SelectItem>
                                <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="id">ID</SelectItem>
                                <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="mtr">MTR</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={data.role} onValueChange={(e) => handleSelectChange("subject", e)} >
                            <SelectTrigger className="cursor-pointer hover:border-amber-500 w-[80px] h-6 rounded-[4px] bg-[var(--white-2)] border border-[var(--white-6)] text-stone-400 text-sm placeholder:text-stone-100">
                                <SelectValue className="h-5" placeholder="Subject" />
                            </SelectTrigger>
                            <SelectContent className="bg-[var(--white-1)] text-stone-300">
                                <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="Java">Java</SelectItem>
                                <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="software engin">Software Engin</SelectItem>
                                {/* <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="3rd">3rd</SelectItem>
                                <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="4th">4th</SelectItem>
                                <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="5th">5th</SelectItem>
                                <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="6th">6th</SelectItem> */}
                            </SelectContent>
                        </Select>
                        <Select value={data.role} onValueChange={(e) => handleSelectChange("Sem", e)} >
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
                        <Select value={data.role} onValueChange={(e) => handleSelectChange("startTime", e)} >
                            <SelectTrigger className="cursor-pointer hover:border-amber-500 w-[90px] h-6 rounded-[4px] bg-[var(--white-2)] border border-[var(--white-6)] text-stone-400 text-sm placeholder:text-stone-100">
                                <SelectValue className="h-5" placeholder="Start" />
                            </SelectTrigger>
                            <SelectContent className="bg-[var(--white-1)] text-stone-300 max-h-60 overflow-y-auto">
                                {Array.from({ length: 8 }, (_, hourIndex) => {
                                    const hour = 10 + hourIndex;
                                    return Array.from({ length: 6 }, (_, minIndex) => {
                                        const minute = minIndex * 10;
                                        if (hour === 17 && minute > 0) return null; // Only include 17:00, not 17:10 or more
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
                                    });
                                })}
                            </SelectContent>
                        </Select>

                        <span className='text-[var(--white-7)] text-sm ' >To</span>

                        <Select value={data.role} onValueChange={(e) => handleSelectChange("endTime", e)}>
                            <SelectTrigger className="cursor-pointer hover:border-amber-500 w-[90px] h-6 rounded-[4px] bg-[var(--white-2)] border border-[var(--white-6)] text-stone-400 text-sm placeholder:text-stone-100">
                                <SelectValue className="h-5" placeholder="End" />
                            </SelectTrigger>
                            <SelectContent className="bg-[var(--white-1)] text-stone-300 max-h-60 overflow-y-auto">
                                {Array.from({ length: 8 }, (_, hourIndex) => {
                                    const hour = 10 + hourIndex;
                                    return Array.from({ length: 6 }, (_, minIndex) => {
                                        const minute = minIndex * 10;
                                        if (hour === 17 && minute > 0) return null; // Only include 17:00, not 17:10 or more
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
                                    });
                                })}
                            </SelectContent>
                        </Select>
                        <RefreshCcw size="26" className='cursor-pointer text-[var(--white-7)] p-1.5 rounded-full hover:bg-[var(--white-4)] ' />
                        <Search size="26" className='cursor-pointer text-[var(--white-8)] p-1 rounded-full hover:bg-[var(--white-4)] ' />
                    </div>
                    <div className="filter-container rounded-sm w-full flex items-center gap-3 mt-2">
                    </div>
                </div>


                <Button type="submit" className="mt-6 cursor-pointer active:scale-95 bg-emerald-600 hover:bg-emerald-400" >Schedule class</Button>
            </form>

            <div className='mt-8 ' >
                <h1 className='text-lg font-bold mb-4' >Scheduled Classes</h1>
                <div className='w-full h-24 px-5 py-2 rounded-md bg-[var(--white-1)]' >
                    <div className='flex justify-between' >
                        <h2 className='text-[var(--white-8)] flex items-center gap-1.5 font-extrabold' >OPPS USING JAVA <Coffee size="15" /> </h2>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Ellipsis className='cursor-pointer' />
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure you want to delete this schedule?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your
                                        schedule and remove data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className='outline-0 cursor-pointer active:scale-90 ring-0 focus:ring-0' >Cancel</AlertDialogCancel>
                                    <AlertDialogAction className="bg-red-600 active:scale-90 cursor-pointer hover:bg-red-700" >Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ScheduleClasses
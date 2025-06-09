import React, { useEffect, useState } from 'react';
import { getValidToken } from '@/Utils/getValidToken';
import axios from 'axios';
import { NotebookPen, RefreshCcw } from 'lucide-react';
import { fetchSubjects } from '@/Utils/FetchSubjects';
import { useAppSelector } from '@/hooks';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '../ui/select';

const ClassHistory = () => {
    const user = useAppSelector((state) => state.user);
    const [pastClasses, setPastClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [filters, setFilters] = useState({
        subject: "", dept: "", sem: "", day: "", type: ""
    });

    const fetchClassHistory = async () => {
        try {
            const token = await getValidToken();
            const response = await axios.post(
                "http://localhost:8000/api/v1/classes/history",
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );
            if (response.data.success) {
                setPastClasses(response.data.pastClasses);
            }
        } catch (error) {
            console.error("Error fetching schedule data", error);
        }
    };

    const fetchSubjectsData = async () => {
        const data = await fetchSubjects(user);
        setSubjects(data);
    };

    useEffect(() => {
        fetchSubjectsData();
        fetchClassHistory();
    }, []);

    const filteredClasses = pastClasses.filter((cls) => {
        if (user.role !== "teacher") return true;
        const { subject, dept, sem, day, type } = filters;
        return (!subject || cls.subject === subject) &&
            (!dept || cls.department.toLowerCase() === dept.toLowerCase()) &&
            (!sem || cls.semester === sem) &&
            (!day || cls.day.toLowerCase() === day.toLowerCase()) &&
            (!type || (type === "Cancelled" ? cls.isCancelled : !cls.isCancelled));
    });

    const renderCard = (e, idx) => (
        <div key={idx} className="w-full h-fit px-5 py-2 mb-3 rounded-md bg-[var(--card)]">
            <div className="flex justify-between items-start">
                <div className="w-full">
                    <div className="flex items-center justify-between pr-5 w-full">
                        <h2 className="text-[var(--white-8)] text-lg flex items-center gap-1.5 font-extrabold">
                            {e.subject}
                            <NotebookPen size="15" />
                            <span className="bg-emerald-300 text-stone-800 text-xs ml-3 px-3 rounded-2xl py-0.5">
                                {e.department}
                            </span>
                            <span className="bg-teal-200 text-stone-800 text-xs px-3 rounded-2xl py-0.5">
                                {e.semester}
                            </span>
                        </h2>
                        <div className='flex gap-2'>
                            <span className='text-xs bg-amber-100 h-fit px-1.5 rounded-full'>{e.day}</span>
                            <span className='text-xs bg-amber-100 h-fit px-1.5 rounded-full'>{e.date}</span>
                            <span className="bg-[var(--white-4)] px-2.5 py-0 text-xs rounded-2xl text-[var(--white-7)]">
                                {e.code}
                            </span>
                        </div>
                    </div>
                    <div className='flex justify-between items-center pr-5'>
                        <div>
                            <h3 className="text-md text-[var(--white-8)]">Teacher: {e.teacher}</h3>
                            <div className="text-xs flex gap-1.5 mb-1">
                                <p className="w-fit px-2 py-0.5 bg-orange-100 rounded-sm text-[var(--black)]">
                                    Start at <b>{Math.floor(e.startTime / 60)}:{(e.startTime % 60).toString().padStart(2, '0')}</b> —
                                    <b>{Math.floor(e.endTime / 60)}:{(e.endTime % 60).toString().padStart(2, '0')}</b>
                                </p>
                                <p className="w-fit px-2 py-0.5 bg-emerald-100 rounded-sm text-[var(--black)]">
                                    Duration <b>
                                        {Math.floor((e.endTime - e.startTime) / 60) > 0 && `${Math.floor((e.endTime - e.startTime) / 60)}h `}
                                        {(e.endTime - e.startTime) % 60 !== 0 && `${(e.endTime - e.startTime) % 60}m`}
                                    </b>
                                </p>
                            </div>
                        </div>

                        {user.role === "teacher" ? (
                            <button className="text-xs py-1.5 text-white px-3 rounded-md bg-green-600 hover:bg-green-800 cursor-pointer">
                                {e.isCancelled ? "Cancelled" : "Attend"}
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
                    <Select onValueChange={(value) => setFilters(prev => ({ ...prev, day: value }))}>
                        <SelectTrigger className="w-[120px] h-6 rounded-[4px] bg-[var(--white-2)] border text-stone-400 text-sm">
                            <SelectValue placeholder="Day" />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--white-1)] text-stone-400">
                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(day => (
                                <SelectItem key={day} value={day.toLowerCase()}>{day}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select onValueChange={(value) => setFilters(prev => ({ ...prev, dept: value }))}>
                        <SelectTrigger className="w-[80px] h-6 rounded-[4px] bg-[var(--white-2)] border text-stone-400 text-sm">
                            <SelectValue placeholder="Dept" />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--white-1)] text-stone-400">
                            {["CST", "CFS", "EE", "ID", "MTR"].map(dept => (
                                <SelectItem key={dept} value={dept.toLowerCase()}>{dept}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select onValueChange={(value) => setFilters(prev => ({ ...prev, sem: value }))}>
                        <SelectTrigger className="w-[80px] h-6 rounded-[4px] bg-[var(--white-2)] border text-stone-400 text-sm">
                            <SelectValue placeholder="Sem" />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--white-1)] text-stone-400">
                            {["1st", "2nd", "3rd", "4th", "5th", "6th"].map(sem => (
                                <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select onValueChange={(value) => setFilters(prev => ({ ...prev, subject: value }))}>
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
                    <Select onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
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
                        onClick={() => setFilters({ subject: "", dept: "", sem: "", day: "", type: "" })}
                    />
                </div>
            )}

            <div className='mt-10'>
                {filteredClasses.map((e, idx) => renderCard(e, idx))}
            </div>
        </div>
    );
};

export default ClassHistory;

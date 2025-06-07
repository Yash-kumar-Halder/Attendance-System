import React, { useEffect, useState } from 'react';
import { BookOpen, RefreshCcw, User } from 'lucide-react';
import { Button } from '../ui/button';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '../ui/select';
import { toast } from 'sonner';
import axios from 'axios';
import { useAppSelector } from '../../hooks/index.js';
import ScheduleCard from '../Skeleton/ScheduleCard';

const ScheduleClasses = () => {
    const user = useAppSelector((state) => state.user);
    const [allSchedules, setAllSchedules] = useState([]);
    const [isSkeleton, setIsSkeleton] = useState(false);

    const [filters, setFilters] = useState({
        day: '',
        subject: '',
        department: '',
        semester: '',
    });

    const getValidToken = async () => {
        let token = localStorage.getItem('accessToken');
        try {
            await axios.get('http://localhost:8000/api/v1/subject/get', {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            return token;
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                try {
                    const refreshResponse = await axios.get(
                        'http://localhost:8000/api/v1/auth/refresh-token',
                        { withCredentials: true }
                    );
                    const newToken = refreshResponse.data.accessToken;
                    localStorage.setItem('accessToken', newToken);
                    return newToken;
                } catch (refreshError) {
                    toast.error('Session expired. Please login again.');
                    throw refreshError;
                }
            }
            throw error;
        }
    };

    const fetchScheduleSubjects = async () => {
        try {
            setIsSkeleton(true);
            const token = await getValidToken();
            const url =
                user.role === 'student'
                    ? 'http://localhost:8000/api/v1/shedule/student/get'
                    : 'http://localhost:8000/api/v1/shedule/get';

            const response = await axios.post(url, {}, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });

            if (response.data.success) {
                const filtered = filterSchedule(response.data.scheduleClasses, filters);
                const sorted = sortScheduleByCurrentDay(filtered);
                setAllSchedules(sorted);
            } else {
                toast.error(response.data.message || 'Failed to fetch schedule');
            }
        } catch (error) {
            console.error('Fetch schedule error:', error);
            toast.error('Failed to fetch subjects');
        } finally {
            setIsSkeleton(false);
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
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayIndex = (new Date().getDay() + 6) % 7;
        const todayName = days[todayIndex];

        const reorderedDays = [...days.slice(days.indexOf(todayName)), ...days.slice(0, days.indexOf(todayName))];

        return classes.sort((a, b) => {
            const dayCompare = reorderedDays.indexOf(a.day) - reorderedDays.indexOf(b.day);
            return dayCompare === 0 ? a.startTime - b.startTime : dayCompare;
        });
    };

    const handleSelectChange = (type, value) => {
        setFilters((prev) => ({ ...prev, [type]: value }));
    };

    const scheduleClassesHandler = async (e) => {
        e.preventDefault();
        const data = {}; // <-- replace with actual form data
        try {
            const response = await axios.post(
                'http://localhost:8000/api/v1/shedule/set',
                data
            );
            if (!response.data.success) {
                toast.error(response.data?.message || 'Schedule failed');
            } else {
                toast.success('Class scheduled successfully');
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something went wrong');
            console.error('Schedule error:', error);
        }
    };

    const formatTime = (number) => {
        const hour = Math.floor(number / 60);
        const minute = number % 60;
        return `${hour}:${minute.toString().padStart(2, '0')}`;
    };

    const refreshFilterData = () => {
        setFilters({ day: '', subject: '', department: '', semester: '' });
    };

    return (
        <div className='w-full px-[2.5%] py-[1.5%]'>
            {user.role === 'teacher' && (
                <>
                    <h1 className='text-xl text-[var(--white-8)] font-extrabold'>Schedule Your Classes</h1>
                    <span className='flex items-center gap-1 text-xs text-[var(--white-6)]'>
                        <User size='14' />Total classes: {allSchedules.length}
                    </span>
                    <form className='mb-8' onSubmit={scheduleClassesHandler}>
                        <h3 className='mt-12 font-semibold text-[var(--white-7)]'>Select details</h3>
                        <div className='w-fit flex gap-3 items-center'>
                            {['day', 'department', 'subject', 'semester'].map((key) => (
                                <Select
                                    key={key}
                                    value={filters[key]}
                                    onValueChange={(value) => handleSelectChange(key, value)}
                                >
                                    <SelectTrigger className='w-[100px] h-6 rounded-[4px] bg-[var(--white-2)] border text-stone-400 text-sm'>
                                        <SelectValue placeholder={key.charAt(0).toUpperCase() + key.slice(1)} />
                                    </SelectTrigger>
                                    <SelectContent className='bg-[var(--white-1)] text-stone-300'>
                                        {key === 'day' &&
                                            ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d) => (
                                                <SelectItem key={d} value={d}>{d}</SelectItem>
                                            ))}
                                        {key === 'department' &&
                                            ['CST', 'CFS', 'EE', 'ID', 'MTR'].map((d) => (
                                                <SelectItem key={d} value={d}>{d}</SelectItem>
                                            ))}
                                        {key === 'subject' &&
                                            ['Java', 'Software Engin'].map((s) => (
                                                <SelectItem key={s} value={s}>{s}</SelectItem>
                                            ))}
                                        {key === 'semester' &&
                                            ['1st', '2nd', '3rd', '4th', '5th', '6th'].map((s) => (
                                                <SelectItem key={s} value={s}>{s}</SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            ))}
                            <RefreshCcw
                                onClick={refreshFilterData}
                                size='26'
                                className='cursor-pointer text-[var(--white-7)] p-1.5 rounded-full hover:bg-[var(--white-4)]'
                            />
                        </div>
                        <Button type='submit' className='mt-6 bg-emerald-600 hover:bg-emerald-400'>
                            Schedule class
                        </Button>
                    </form>
                </>
            )}

            <div>
                <h1 className='text-lg font-bold mb-4'>Scheduled Classes</h1>
                {isSkeleton ? (
                    <>
                        <ScheduleCard />
                        <ScheduleCard />
                        <ScheduleCard />
                        <ScheduleCard />
                        <ScheduleCard />
                    </>
                ) : (
                    allSchedules.map((e) => {
                        const subject = e.subject;

                        return (
                            <div
                                key={e._id}
                                className='w-full h-24 px-5 py-2 rounded-md bg-[var(--card)] mb-3 fade-in-65'
                            >
                                <div className='flex justify-between items-start'>
                                    <div className='w-full'>
                                        <div className='flex justify-between pr-5'>
                                            <h2 className='text-[var(--white-8)] text-lg mt-1.5 flex items-center gap-1.5 font-extrabold'>
                                                <BookOpen size='15' />
                                                {subject ? subject.subject : <span className='text-[var(--white-5)]'>No Subject</span>}
                                            </h2>
                                            <span className='bg-[var(--white-4)] px-3 rounded-2xl text-[var(--white-7)] h-fit '>
                                                {subject ? subject.code : 'N/A'}
                                            </span>
                                        </div>
                                        <h3 className='text-md text-[var(--white-8)]'>
                                            Teacher: {subject ? subject.teacher : 'Unknown'}
                                        </h3>
                                        <div className='flex gap-2 text-xs mt-1'>
                                            <span className='bg-emerald-300 px-3 rounded-2xl py-0.5'>
                                                {subject ? subject.department : 'N/A'}
                                            </span>
                                            <span className='bg-teal-200 px-3 rounded-2xl py-0.5'>
                                                {subject ? subject.semester : 'N/A'}
                                            </span>
                                            <span className='bg-indigo-200 px-3 rounded-2xl py-0.5'>{e.day}</span>
                                            <span className='bg-orange-300 px-3 rounded-2xl py-0.5'>
                                                {formatTime(e.startTime)} - {formatTime(e.endTime)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ScheduleClasses;

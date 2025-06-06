import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Coffee, Ellipsis, User } from 'lucide-react';
import { getCurrentDay, getCurrentTimeInMinutes } from '../../Utils/timeUtils.js';

const Classes = () => {
    const [activeClasses, setActiveClasses] = useState([]);
    const [upcomingClasses, setUpcomingClasses] = useState([]);
    const [allSchedules, setAllSchedules] = useState([]);

    useEffect(() => {
        fetchScheduleData();
    }, []);

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

    const fetchScheduleData = async () => {
        try {
            const token = await getValidToken();
            const res = await await axios.post("http://localhost:8000/api/v1/shedule/get", {}, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });

            if (res.data.success) {
                const schedules = res.data.scheduleClasses;
                const today = getCurrentDay();
                const currentTime = getCurrentTimeInMinutes();

                const todaySchedules = schedules.filter(s => s.day === today);
                const active = todaySchedules.filter(s => s.startTime <= currentTime && s.endTime >= currentTime);
                const upcoming = todaySchedules.filter(s => s.startTime > currentTime);

                setAllSchedules(schedules);
                setActiveClasses(active);
                setUpcomingClasses(upcoming);
            }
        } catch (error) {
            console.error("Error fetching schedule data", error);
        }
    };

    const formatMinutesToTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const h = hours % 12 || 12;
        const ampm = hours >= 12 ? "PM" : "AM";
        return `${h}:${mins.toString().padStart(2, "0")} ${ampm}`;
    };

    const currentTime = getCurrentTimeInMinutes();

    const renderCard = (e, type) => {
        const endTimeFormatted = formatMinutesToTime(e.endTime);
        const startTimeFormatted = formatMinutesToTime(e.startTime);
        const duration = e.endTime - currentTime;

        return (
            <div key={e._id} className="w-full h-fit px-5 py-2 mb-3 rounded-md bg-[var(--card)]">
                <div className="flex justify-between items-start">
                    <div className="w-full">
                        <div className="flex items-center justify-between pr-5 w-full">
                            <h2 className="text-[var(--white-8)] text-lg flex items-center gap-1.5 font-extrabold">
                                {e.subject.subject}
                                <Coffee size="15" />
                                <span className="bg-emerald-300 text-xs ml-3 px-3 rounded-2xl py-0.5">{e.subject.department}</span>
                                <span className="bg-teal-200 text-xs px-3 rounded-2xl py-0.5">{e.subject.semester}</span>
                            </h2>
                            <span className="bg-[var(--white-4)] px-3 rounded-2xl text-[var(--white-7)]">
                                {e.subject.code}
                            </span>
                        </div>
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
                    <Ellipsis className="cursor-pointer text-[var(--white-9)]" />
                </div>
            </div>
        );
    };


    return (
        <div className='px-[2.5%] py-[1.5%] min-h-[calc(100vh-40px)] bg-[var(--bg)]'>
            <div>
                <h1 className='text-2xl font-extrabold text-[var(--white-9)]'>Classes</h1>
                <span className='flex items-center gap-1 text-xs text-stone-400'><User size="14" />Total: {allSchedules.length}</span>
            </div>

            <h2 className='text-green-400 text-xl font-bold mt-4'>Active Classes</h2>
            {activeClasses.length > 0 ? (
                activeClasses.map(e => renderCard(e, "active"))
            ) : (
                <p className="text-stone-400 text-sm mt-2">No active classes right now.</p>
            )}

            <h2 className='text-teal-400 text-xl font-bold mt-4'>Upcoming Classes</h2>
            {upcomingClasses.length > 0 ? (
                upcomingClasses.map(e => renderCard(e, "upcoming"))
            ) : (
                <p className="text-stone-400 text-sm mt-2">No upcoming classes for today.</p>
            )}

        </div>
    );
};

export default Classes;

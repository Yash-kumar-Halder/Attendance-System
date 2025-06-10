import React, { useEffect, useState } from "react";
import { Ellipsis, Coffee } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import CircularLoader from "../MyComponents/CircularLoader.jsx"; // adjust path

const SubjectsList = ({ reduxSubjects, user }) => {
    const [visibleSubjects, setVisibleSubjects] = useState([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const filteredSubjects = reduxSubjects; // or apply any filters here

    useEffect(() => {
        if (filteredSubjects.length === 0) {
            setLoading(true);
            return;
        }

        const interval = setInterval(() => {
            setVisibleSubjects((prev) => {
                const next = [...prev, filteredSubjects[prev.length]];
                if (next.length === filteredSubjects.length) {
                    clearInterval(interval);
                    setLoading(false);
                }
                return next;
            });
        }, 150); // 150ms delay between each item

        return () => clearInterval(interval);
    }, [filteredSubjects]);

    return (
        <div className="w-full flex flex-col gap-3">
            {reduxSubjects.length === 0 && !loading && <h1>No subject added...</h1>}

            {loading && <CircularLoader />}

            {visibleSubjects.map((e) => (
                <div
                    key={e._id}
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
                            <h3 className="text-md text-[var(--white-8)]">
                                Teacher: {e.teacher}
                            </h3>
                            <div className="flex gap-2 text-xs">
                                <span className="bg-emerald-300 px-3 rounded-2xl py-0.5">{e.department}</span>
                                <span className="bg-teal-200 px-3 rounded-2xl py-0.5">{e.semester}</span>
                            </div>
                        </div>

                        {user.role !== "student" && (
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Ellipsis className="cursor-pointer text-[var(--white-9)]" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setScheduleItem(e._id);
                                            setOpenScheduleDialog(true);
                                        }}
                                        className="cursor-pointer"
                                    >
                                        Set Schedule
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setOpenSubjectScheduleDialog(true);
                                            fetchSubjectSchedule(e._id);
                                        }}
                                        className="cursor-pointer"
                                    >
                                        View Schedule
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setDeleteItem(e._id);
                                            setOpenDeleteDialog(true);
                                        }}
                                        className="text-red-500 cursor-pointer"
                                    >
                                        Delete Subject
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SubjectsList;

import React, { useEffect, useState } from 'react'
import { Coffee, Ellipsis, User } from 'lucide-react'
import { Button } from '../ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { toast } from 'sonner'
import axios from 'axios'
import { useAppSelector, useAppDispatch } from "../../hooks/index.js";
import { setSubjects } from '@/Redux/Slices/Application/subjects'



const Subject = () => {

    const dispatch = useAppDispatch();
    const allSubjects = useAppSelector((state) => state.subject?.subjects || []);
    const [subjects, setLocalSubjects] = useState([]);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                // ✅ Get token from localStorage
                const token = localStorage.getItem("accessToken");

                const response = await axios.get("http://localhost:8000/api/v1/subject/get", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // ✅ Axios auto-parses JSON response
                const data = response.data;
                // Optional: check if `data.subjects` or similar structure
                dispatch(setSubjects(data.subjects));
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        fetchSubjects();
    }, [dispatch]);

    useEffect(() => {
        setLocalSubjects(allSubjects);
    }, [allSubjects]);

    // sync local state with Redux state
    // useEffect(() => {
    //     setSubjectsState(allSubjects);
    //     console.log(subjects)
    // }, [allSubjects]);

    const [data, setData] = useState({
        subject: "",
        code: "",
        teacher: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value
        });
    }

    const subjectHandler = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("accessToken"); // get token from storage

        try {
            const response = await axios.post(
                "http://localhost:8000/api/v1/subject/set",
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
                const subjectsResponse = await axios.get(
                    "http://localhost:8000/api/v1/subject/get",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log(subjectsResponse.data.subjects)
                dispatch(setSubjects(subjectsResponse.data.subjects));
            } else {
                toast.error(response.data?.message || "Schedule failed");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
            console.error("Schedule error:", error);
        }
    };


    return (
        <div className='w-[100%] px-[2.5%] py-[1.5%] ' >
            <h1 className='text-xl text-[var(--white-8)] font-extrabold' >Schedule Your Classes</h1>
            <span className='flex items-center gap-1 text-xs text-[var(--white-6)] ' ><User size="14" />Total classes: 122</span>
            <form onSubmit={subjectHandler} >
                <h3 className=' mt-12 font-semibold text-[var(--white-7)]' >Select detailes</h3>

                <div className='w-fit ' >
                    <div className="filter-container rounded-sm w-full flex items-center gap-3 ">
                        <div className="mb-4 w-full">
                            <label className="w-full text-sm font-medium text-[var(--white-7)] mb-2" htmlFor="subject">Subject name</label>
                            <input
                                name="subject"
                                onChange={handleChange}
                                value={data.subject}
                                type="text"
                                id="subject"
                                className="w-full px-3 py-2 border border-[var(--white-5)] rounded focus:outline-none focus:ring focus:ring-none focus:border-[var(--white-4)] placeholder:text-[var(--white-6)] text-[var(--white-8)] active:bg-[var(--white-1)] "
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div className="mb-4 w-full">
                            <label className="w-full text-sm font-medium text-[var(--white-7)] mb-2" htmlFor="code">Subject code</label>
                            <input
                                name="code"
                                onChange={handleChange}
                                value={data.code}
                                type="text"
                                id="code"
                                className="w-full px-3 py-2 border border-[var(--white-5)] rounded focus:outline-none focus:ring focus:ring-none focus:border-[var(--white-4)] placeholder:text-[var(--white-6)] text-[var(--white-8)] active:bg-[var(--white-1)] "
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div className="mb-4 w-full">
                            <label className="w-full text-sm font-medium text-[var(--white-7)] mb-2" htmlFor="teacher">Teacher</label>
                            <input
                                name="teacher"
                                onChange={handleChange}
                                value={data.teacher}
                                type="text"
                                id="teacher"
                                className="w-full px-3 py-2 border border-[var(--white-5)] rounded focus:outline-none focus:ring focus:ring-none focus:border-[var(--white-4)] placeholder:text-[var(--white-6)] text-[var(--white-8)] active:bg-[var(--white-1)] "
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    </div>
                    <div className="filter-container rounded-sm w-full flex items-center gap-3 mt-2">
                    </div>
                </div>


                <Button type="submit" className="mt-6 cursor-pointer active:scale-95 bg-emerald-600 hover:bg-emerald-400" >Add class</Button>
            </form>

            <div className='mt-8 ' >
                <h1 className='text-lg font-bold mb-4' >All Classes</h1>
                <div className='flex flex-col gap-4 ' >
                    {subjects.map((e) => (
                        <div key={e._id} className='w-full h-24 px-5 py-2 rounded-md bg-[var(--white-1)]' >
                            <div className='flex justify-between' >
                                <div>
                                    <h2 className='text-[var(--white-8)] flex items-center gap-1.5 font-extrabold' >{e.subject}<Coffee size="15" /> <span>{e.code}</span> </h2>
                                    <h3>Teacher: {e.teacher}</h3>
                                </div>
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
                    ))}
                </div>
                
            </div>
        </div>
    )
}

export default Subject
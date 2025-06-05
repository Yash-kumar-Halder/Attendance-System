import React, { useEffect, useState } from 'react'
import { Coffee, Ellipsis, User } from 'lucide-react'
import { Button } from '../ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { toast } from 'sonner'
import axios from 'axios'
import { useAppSelector, useAppDispatch } from "../../hooks/index.js";
import { setSubjects } from '@/Redux/Slices/Application/subjects'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { refreshTokenAndRetry } from '@/Utils/RefreshTokenAndRetry'



const Subject = () => {

    const dispatch = useAppDispatch();
    const reduxSubjects = useAppSelector((state) => state.subject.subjects || []); // from redux
    const [subjects, setSubjectsLocal] = useState([]);

    const [buttonState, setButtonState] = useState(true);
    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/v1/subject/get",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    }
                );
                if (response.data.success === true) {
                    dispatch(setSubjects(response.data.subjects));
                    setSubjectsLocal(reduxSubjects);
                    console.log(response.data);
                }
            } catch (error) {
                if (error.response?.status === 401 || error.response?.status === 403) {
                    try {
                        const newToken = await axios.get("http://localhost:8000/api/v1/auth/refresh-token", { withCredentials: true })
                        console.log("Data: ", newToken.data.accessToken);
                        localStorage.setItem("accessToken", newToken.data.accessToken);
                        const response = await axios.get("http://localhost:8000/api/v1/subject/get", { withCredentials: true });
                        console.log("Catch error: ", response.data);
                    } catch (error) {
                        console.log("Error:", error)
                    }
                }
                console.log("User Effect error: ", error);
            }
        }
        fetchData();
    }, [])

    useEffect(() => {
        // Whenever reduxSubjects updates, update local state
        setSubjectsLocal(reduxSubjects);
    }, [reduxSubjects]);



    // sync local state with Redux state
    // useEffect(() => {
    //     setSubjectsState(allSubjects);
    //     console.log(subjects)
    // }, [allSubjects]);

    const [data, setData] = useState({
        subject: "",
        code: "",
        teacher: "",
        department: "",
        semester: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value
        });
    }

    const handleSelectChange = (type, value) => {
        setData((prev) => ({
            ...prev,
            [type]: value
        }));
    }

    const subjectHandler = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("accessToken");

        try {
            await axios.post(
                "http://localhost:8000/api/v1/subject/set",
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            // ✅ Refetch the subjects list after adding new subject
            const response = await axios.get(
                "http://localhost:8000/api/v1/subject/get",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            if (response.data.success === true) {
                dispatch(setSubjects(response.data.subjects));
                toast.success("Subject added successfully!");
            }

            // ✅ Optionally reset form
            setData({
                subject: "",
                code: "",
                teacher: "",
                department: "",
                semester: ""
            });

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Something went wrong");
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
                                className="w-full bg-[var(--white-2)] px-3 py-2 border border-[var(--white-5)] rounded focus:outline-none focus:ring focus:ring-none focus:border-[var(--white-4)] placeholder:text-[var(--white-6)] text-[var(--white-8)] active:bg-[var(--white-1)] "
                                placeholder="Enter subject name"
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
                                className="w-full bg-[var(--white-2)] px-3 py-2 border border-[var(--white-5)] rounded focus:outline-none focus:ring focus:ring-none focus:border-[var(--white-4)] placeholder:text-[var(--white-6)] text-[var(--white-8)] active:bg-[var(--white-1)] "
                                placeholder="Enter subject code"
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
                                className="w-full bg-[var(--white-2)] px-3 py-2 border border-[var(--white-5)] rounded focus:outline-none focus:ring focus:ring-none focus:border-[var(--white-4)] placeholder:text-[var(--white-6)] text-[var(--white-8)] active:bg-[var(--white-1)] "
                                placeholder="Enter teacher's name"
                                required
                            />
                        </div>
                        {/* Here  */}
                        <Select value={data.role} onValueChange={(e) => handleSelectChange("department", e)}>
                            <SelectTrigger className="cursor-pointer hover:border-amber-500 w-[300px] h-10 mt-1.5 rounded-[4px] bg-[var(--white-2)] border border-[var(--white-6)] text-stone-400 text-sm placeholder:text-stone-100">
                                <SelectValue className="h-5" placeholder="Dept" />
                            </SelectTrigger>
                            <SelectContent className="bg-[var(--white-1)] text-stone-300">
                                <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="CST">CST</SelectItem>
                                <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="CFS">CFS</SelectItem>
                                <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="EE">EE</SelectItem>
                                <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="ID">ID</SelectItem>
                                <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="MTR">MTR</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={data.role} onValueChange={(e) => handleSelectChange("semester", e)} >
                            <SelectTrigger className="cursor-pointer hover:border-amber-500 w-[250px] h-10 mt-1.5 rounded-[4px] bg-[var(--white-2)] border border-[var(--white-6)] text-stone-400 text-sm placeholder:text-stone-100">
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

                    </div>
                    <div className="filter-container rounded-sm w-full flex items-center gap-3 mt-2">
                    </div>
                </div>
                <Button type="submit" className="mt-6 cursor-pointer active:scale-95 bg-emerald-600 hover:bg-emerald-400" >Add class</Button>
            </form>
            {/* <div className='bg-green-400 px-3 py-1 w-fit rounded-md cursor-pointer' onClick={test}  >Dummy</div> */}

            <div className='mt-8 ' >
                <h1 className='text-lg font-bold mb-4' >All Classes</h1>
                <div className='flex flex-col gap-4 ' >
                    {subjects.map((e) => (
                        <div key={e._id} className='w-full h-24 px-5 py-2 rounded-md bg-[var(--card)]' >
                            <div className='flex justify-between' >
                                <div className='w-full' >
                                    <div className='flex justify-between pr-5 w-full' >
                                        <h2 className='text-[var(--white-8)] text-lg leading-3 mt-1.5 flex items-center gap-1.5 font-extrabold' >{e.subject}<Coffee size="15" />  </h2><span className='bg-[var(--white-4)] px-3 rounded-2xl text-[var(--white-7)] ' >{e.code}</span>
                                    </div>
                                    <h3 className='text-md text-[var(--white-8)] ' >Teacher: {e.teacher}</h3>
                                    <div className='flex gap-2 text-xs' >
                                        <span className='bg-emerald-300 px-3 rounded-2xl py-0.5' >{e.department}</span>
                                        <span className='bg-teal-200 px-3 rounded-2xl py-0.5'>{e.semester}</span>
                                    </div>
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Ellipsis className='cursor-pointer text-[var(--white-9)] ' />
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
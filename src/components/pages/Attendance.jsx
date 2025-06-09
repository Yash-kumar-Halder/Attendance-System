import React, { useEffect, useState } from 'react'
import CircleProgressBar from '../CircleProgressBar'
import { getValidToken } from '@/Utils/getValidToken';
import axios from 'axios';
import { useAppDispatch } from '@/hooks';
import { setData } from '@/Redux/Slices/User/attendance';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [totalClasses, setTotalClasses] = useState([])
  
  const dispatch = useAppDispatch();

  const fetchData = async () => {
    try {
      const token = await getValidToken();
      const response = await axios.post(
        "http://localhost:8000/api/v1/attendance/attendance",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      const attendanceData = response.data.data;
      setAttendance(attendanceData);
      const totalClass = await axios.post(
        "http://localhost:8000/api/v1/classes/total-class",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      const totalClassesData = totalClass.data.data;
      setTotalClasses(totalClassesData);
      dispatch(setData({ attendance: attendanceData, totalClasses: totalClassesData }));
    } catch (error) {
      console.error("Failed to fetch subjects", error);
      toast.error("Failed to fetch subjects");
    }
  }

  useEffect(() => {
    fetchData();
  
  }, [])
  


  return (
    <div className='w-[100%] px-[2.5%] py-[1.5%]' >
      <h1 className='text-xl text-[var(--white-8)] font-extrabold mb-6 ' >Attendance</h1>
      <div className="flex gap-4 ">
        <div className='bg-[var(--card)] rounded-md w-[50%] py-4 ' >
          <CircleProgressBar 
            total={totalClasses.totalTaken}
          present={attendance.length}
            color="text-green-500"
            baseColor="text-orange-400"
            label="Present" />
        </div>
        <div className='bg-[var(--card)] rounded-md w-[50%] ' ></div>
      </div>
    </div>
  )
}

export default Attendance
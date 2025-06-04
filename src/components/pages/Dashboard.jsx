import React from 'react'
import CircleProgressBar from '../CircleProgressBar'
import Chart from '../MyComponents/Chart'
import BG1 from "../../assets/Images/bg-1.jpeg";
import BG3 from "../../assets/Images/bg-3.jpeg";
import ChartLine1 from "../../assets/Images/chart-line-1.jpeg";

const Dashboard = () => {
  return (
      <div className='w-[100%] px-[2.5%] py-[1.5%] flex flex-wrap gap-[2%] bg-[var(--bg)]  ' >
          <div className='w-[55%] cursor-pointer transition duration-300 hover:scale-[1.03] overflow-hidden aspect-[3/1.65] bg-[var(--card)] rounded-md my-[1.5%]  ' >
              <CircleProgressBar
                  value={75}
                  color="text-green-500"
                  baseColor="text-orange-400"
                  label="Present"
              />

          </div>
          <div className='w-[40%]  flex flex-wrap gap-[4%] justify-between aspect-[3/1.8] rounded-md my-[1.5%]  ' >
              <div className='w-[48%] h-[48.1%] bg-[var(--card)] rounded-md overflow-hidden ' > 
                <img className='w-full h-full ' src={BG1} alt="image" />
              </div>
              <div className='w-[48%] h-[48.1%] bg-[var(--card)] rounded-md overflow-hidden' >
                  <img className='w-full h-full '  src={ChartLine1} alt="img" />
                 </div>
              <div className='w-[100%] h-[48.1%] bg-[var(--card)] rounded-md ' ><Chart /> </div>
          </div>
          <div className='w-[35%] cursor-pointer aspect-[3/1.8] bg-[var(--card)] rounded-md my-[1.5%]  overflow-hidden' >
              <img className='w-full h-full top-0 object-cover ' src={BG3} alt="image" /> </div>
          <div className='w-[60%] aspect-[3/1.4] bg-[var(--card)] rounded-md my-[1.5%]  ' ></div>
      </div>
  )
}

export default Dashboard
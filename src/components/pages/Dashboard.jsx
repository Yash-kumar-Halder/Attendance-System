import React from 'react'
import CircleProgressBar from '../CircleProgressBar'

const Dashboard = () => {
  return (
      <div className='w-[100%] px-[2.5%] py-[1.5%] flex flex-wrap gap-[2%] bg-[var(--bg)]  ' >
          <div className='w-[40%] overflow-hidden aspect-[3/1.8] bg-[var(--card)] rounded-md my-[1.5%]  ' >
              <CircleProgressBar
                  value={75}
                  color="text-green-500"
                  baseColor="text-orange-400"
                  label="Present"
              />

          </div>
          <div className='w-[27%] aspect-[3/1.8] bg-[var(--card)] rounded-md my-[1.5%]  ' >

          </div>
          <div className='w-[27%] aspect-[3/1.8] bg-[var(--card)] rounded-md my-[1.5%]  ' ></div>
          <div className='w-[60%] aspect-[3/1.4] bg-[var(--card)] rounded-md my-[1.5%]  ' ></div>
          <div className='w-[36%] aspect-[3/1.4] bg-[var(--card)] rounded-md my-[1.5%]  ' ></div>
      </div>
  )
}

export default Dashboard
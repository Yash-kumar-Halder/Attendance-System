import React from 'react'

const DashboardSkeleton = () => {
  return (
      <div className='w-full px-[2.5%] py-[1.5%] flex flex-wrap gap-[2%] animate-pulse'>
          {/* Skeleton Cards */}
          <div className='w-[40%] aspect-[3/1.8] bg-[var(--card-skeleton)] rounded-md my-[1.5%]' ></div>
          <div className='w-[27%] aspect-[3/1.8] bg-[var(--card-skeleton)] rounded-md my-[1.5%]' ></div>
          <div className='w-[27%] aspect-[3/1.8] bg-[var(--card-skeleton)] rounded-md my-[1.5%]' ></div>
          <div className='w-[60%] aspect-[3/1.4] bg-[var(--card-skeleton)] rounded-md my-[1.5%]' ></div>
          <div className='w-[36%] aspect-[3/1.4] bg-[var(--card-skeleton)] rounded-md my-[1.5%]' ></div>
      </div>
  )
}

export default DashboardSkeleton
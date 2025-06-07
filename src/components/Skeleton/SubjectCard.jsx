import React from 'react'

const SubjectCard = () => {
  return (
      <div className="w-full h-24 px-5 py-2 rounded-md bg-[var(--card)] animate-pulse">
          <div className="flex justify-between items-start">
              <div className="w-full">
                  <div className="flex justify-between pr-5 w-full">
                      <div className="h-4 w-32 bg-[var(--white-3)] rounded-md mt-1.5" />
                      <div className="h-4 w-16 bg-[var(--white-3)] rounded-2xl" />
                  </div>
                  <div className="h-4 w-40 bg-[var(--white-3)] rounded-md mt-2" />
                  <div className="flex gap-2 text-xs mt-3">
                      <div className="h-4 w-20 bg-emerald-200 rounded-2xl" />
                      <div className="h-4 w-20 bg-teal-200 rounded-2xl" />
                  </div>
              </div>
              <div className="h-5 w-5 bg-[var(--white-3)] rounded-full mt-1.5" />
          </div>
      </div>
  )
}

export default SubjectCard
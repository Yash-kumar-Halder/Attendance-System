import React from 'react'

const ActiveClassesCard = () => {
  return (
      <div className="w-full h-fit px-5 py-2 mb-3 rounded-md bg-[var(--card)] animate-pulse">
          <div className="flex justify-between items-start">
              <div className="w-full">
                  <div className="flex items-center justify-between pr-5 w-full">
                      <div className="flex items-center gap-2">
                          <div className="h-4 w-28 bg-[var(--white-3)] rounded-md" />
                          <div className="h-4 w-16 bg-emerald-200 rounded-2xl" />
                          <div className="h-4 w-16 bg-teal-200 rounded-2xl" />
                      </div>
                      <div className="h-4 w-14 bg-[var(--white-3)] rounded-2xl" />
                  </div>

                  <div className="h-4 w-40 bg-[var(--white-3)] rounded-md mt-2" />

                  <div className="mt-2">
                      <div className="h-4 w-48 bg-orange-200 rounded-md" />
                  </div>
              </div>
          </div>
      </div>

  )
}

export default ActiveClassesCard
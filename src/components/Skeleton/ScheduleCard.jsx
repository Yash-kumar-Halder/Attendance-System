const ScheduleCard = () => {
  return (
      <div className="w-full h-24 px-5 py-2 rounded-md bg-[var(--card)] mb-3 animate-pulse">
          <div className="flex justify-between items-start">
              <div className="w-full">
                  <div className="flex justify-between pr-5 w-full">
                      <div className="h-4 w-20 bg-[var(--white-6)] rounded-md mt-1.5" />
                      <div className="h-4 w-12 bg-[var(--white-5)] rounded-2xl" />
                  </div>
                  <div className="h-3 w-40 bg-[var(--white-5)] rounded-md mt-2" />
                  <div className="flex gap-2 text-xs mt-3">
                      <div className="h-5 w-10 bg-emerald-200 rounded-2xl" />
                      <div className="h-5 w-10 bg-teal-200 rounded-2xl" />
                      <div className="h-5 w-18 bg-indigo-200 rounded-2xl" />
                      <div className="h-5 w-24 bg-orange-200 rounded-2xl" />
                  </div>
              </div>
          </div>
      </div>

  )
}

export default ScheduleCard
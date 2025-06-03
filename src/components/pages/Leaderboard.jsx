import { RefreshCcw, Search, User } from 'lucide-react'
import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
"use client"
import { Bar, BarChart } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

const Leaderboard = () => {

    const chartData = [
        { month: "January", desktop: 186, mobile: 80 },
        { month: "February", desktop: 305, mobile: 200 },
        { month: "March", desktop: 237, mobile: 120 },
        { month: "April", desktop: 73, mobile: 190 },
        { month: "May", desktop: 209, mobile: 130 },
        { month: "June", desktop: 214, mobile: 140 },
    ]
    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "#2563eb",
        },
        mobile: {
            label: "Mobile",
            color: "#60a5fa",
        },
    };

    return (
        <div className='w-[100%] px-[2.5%] py-[1.5%]' >
            <h1 className='text-xl text-[var(--white-8)] font-extrabold' >Leaderboard</h1>
            <span className='flex items-center gap-1 text-xs text-[var(--white-6)] ' ><User size="14" />Total student: 165</span>

            <h3 className=' mt-5 font-semibold text-[var(--white-7)] ' >Filter</h3>
            <div className="filter-container rounded-sm w-full flex items-center gap-3 ">
                <Select >
                    <SelectTrigger className="cursor-pointer hover:border-amber-500 w-[120px] h-6 rounded-[4px] bg-[var(--white-2)] border border-[var(--white-6)] text-stone-400 text-sm placeholder:text-stone-100">
                        <SelectValue className="h-5" placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--white-1)] text-stone-300">
                        <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="monday">Monday</SelectItem>
                        <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="tuesday">Tuesday</SelectItem>
                        <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="wednesday">Wednesday</SelectItem>
                        <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="thrursday">Thrursday</SelectItem>
                        <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="friday">Friday</SelectItem>
                        <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="saturday">Saturday</SelectItem>
                    </SelectContent>
                </Select>
                <Select >
                    <SelectTrigger className="cursor-pointer hover:border-amber-500 w-[80px] h-6 rounded-[4px] bg-[var(--white-2)] border border-[var(--white-6)] text-stone-400 text-sm placeholder:text-stone-100">
                        <SelectValue className="h-5" placeholder="Dept" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--white-1)] text-stone-300">
                        <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="cst">CST</SelectItem>
                        <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="cfs">CFS</SelectItem>
                        <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="ee">EE</SelectItem>
                        <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="id">ID</SelectItem>
                        <SelectItem className="cursor-pointer hover:bg[var(--white-2)] text-[var(--white-6)] " value="mtr">MTR</SelectItem>
                    </SelectContent>
                </Select>
                <Select >
                    <SelectTrigger className="cursor-pointer hover:border-amber-500 w-[80px] h-6 rounded-[4px] bg-[var(--white-2)] border border-[var(--white-6)] text-stone-400 text-sm placeholder:text-stone-100">
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
                <Select >
                    <SelectTrigger className="cursor-pointer hover:border-amber-500 w-[80px] h-6 rounded-[4px] bg-[var(--white-2)] border border-[var(--white-6)] text-stone-400 text-sm placeholder:text-stone-100">
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
                <RefreshCcw size="26" className='cursor-pointer text-[var(--white-7)] p-1.5 rounded-full hover:bg-[var(--white-4)] ' />
                <Search size="26" className='cursor-pointer text-[var(--white-8)] p-1 rounded-full hover:bg-[var(--white-4)] ' />
            </div>

            {/* Chart card  */}

            {/* <div className='cursor-pointer chart w-[35%] bg-[var(--white-1)] hover:bg-[var(--white-2)] border border-[var(--white-5)] hover:border-blue-300 mt-12 rounded-md' >
              <ChartContainer config={chartConfig} className="min-h-[10px] w-full cursor-pointer">
                  <BarChart className='cursor-pointer' accessibilityLayer data={chartData}>
                      <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                      <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                  </BarChart>
              </ChartContainer>
          </div> */}
            <div className='mt-10 flex flex-col gap-4' >
                <div className='w-90% min-h-16  bg-[var(--white-1)] px-3 py-2 pb-3 rounded-md flex items-center justify-between' >
                    <div>
                        <h2 className='text-[var(--white-8)] font-semibold  ' >Yash Kumar Halder</h2>

                        <span className='text-xs text-[var(--white-7)]' >Reg: D232404772</span>
                        <div className='text-xs text-[var(--white-6)] flex items-center gap-3 leading-3' >
                            <span>Dept: CST</span>
                            <span>Sem: 4th</span>
                        </div>
                    </div>
                    <div className='flex flex-col  text-sm font-semibold mr-3' >
                        <span className='text-orange-600 font-extrabold ' >Total: 130</span>
                        <span className='text-green-600' >Score: 106</span>
                    </div>
                </div>
                <div className='w-90% min-h-16  bg-[var(--white-1)] px-3 py-2 pb-3 rounded-md flex items-center justify-between' >
                    <div>
                        <h2 className='text-[var(--white-8)] font-semibold  ' >Yash Kumar Halder</h2>

                        <span className='text-xs text-[var(--white-7)]' >Reg: D232404772</span>
                        <div className='text-xs text-[var(--white-6)] flex items-center gap-3 leading-3' >
                            <span>Dept: CST</span>
                            <span>Sem: 4th</span>
                        </div>
                    </div>
                    <div className='flex flex-col  text-sm font-semibold mr-3' >
                        <span className='text-orange-600 font-extrabold ' >Total: 130</span>
                        <span className='text-green-600' >Score: 106</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Leaderboard
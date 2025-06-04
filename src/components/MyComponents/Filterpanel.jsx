import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { RefreshCcw, Search } from 'lucide-react'

const Filterpanel = () => {
    return (
        <div>
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
        </div>
    )
}

export default Filterpanel
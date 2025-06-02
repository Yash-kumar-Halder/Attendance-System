import { Coffee, Ellipsis, PencilLine, RefreshCcw, Search, User } from 'lucide-react'
import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'

const Classes = () => {
    return (
        <div className='px-[3.5%] min-h-[calc(100vh-40px)] pt-5 bg-[var(--bg)] ' >
            <div>
                <h1 className='text-3xl font-extrabold text-[var(--white-9)] ' >Classes</h1>
                <span className='flex items-center gap-1 text-xs text-stone-400' ><User size="14" />Total: 165</span>
            </div>

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

            <h2 className='text-green-400 text-xl font-bold mt-4' >Active Classes</h2>
            <div className="filter-container mt-2 px-4 py-1.5 h-15 rounded-sm w-full bg-[var(--active-card)]">
                <div className='flex justify-between' >
                    <h2 className='text-[var(--white-8)] flex items-center gap-1.5 font-extrabold' >OPPS USING JAVA <Coffee size="15" /> </h2>
                    <DropdownMenu>
                        <DropdownMenuTrigger><Ellipsis className='cursor-pointer' /></DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Billing</DropdownMenuItem>
                            <DropdownMenuItem>Team</DropdownMenuItem>
                            <DropdownMenuItem>Subscription</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <h6 className='text-xs text-stone-400 flex items-center gap-2' ><PencilLine size="12" />Anupam Samanta</h6>
            </div>
            <h2 className='text-teal-400 text-xl font-bold mt-4' >Upcomming Classes</h2>
            <div className="filter-container mt-2 px-4 py-1.5 h-15 rounded-sm w-full bg-[var(--active-card)]">
                <div className='flex justify-between' >
                    <h2 className='text-[var(--white-8)] flex items-center gap-1.5 font-extrabold' >OPPS USING JAVA <Coffee size="15" /> </h2>
                    <Dialog>
                        <DialogTrigger><Ellipsis className='cursor-pointer' /></DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Are you absolutely sure?</DialogTitle>
                                <DialogDescription>
                                    This action cannot be undone. This will permanently delete your account
                                    and remove your data from our servers.
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </div>
                <h6 className='text-xs text-stone-400 flex items-center gap-2' ><PencilLine size="12" />Anupam Samanta</h6>
            </div>
        </div>
    )
}

export default Classes
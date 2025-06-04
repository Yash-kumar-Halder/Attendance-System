import { Coffee, Ellipsis, PencilLine, RefreshCcw, Search, User } from 'lucide-react'
import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import Filterpanel from '../MyComponents/Filterpanel'

const Classes = () => {
    return (
        <div className=' px-[2.5%] py-[1.5%] min-h-[calc(100vh-40px)] bg-[var(--bg)] ' >
            <div>
                <h1 className='text-2xl font-extrabold text-[var(--white-9)] ' >Classes</h1>
                <span className='flex items-center gap-1 text-xs text-stone-400' ><User size="14" />Total: 165</span>
            </div>

            <h3 className=' mt-5 font-semibold text-[var(--white-7)] ' >Filter</h3>
            <Filterpanel />

            <h2 className='text-green-400 text-xl font-bold mt-4' >Active Classes</h2>
            <div className="filter-container mt-2 px-4 py-3 h-20 rounded-sm w-full bg-[var(--active-card)]">
                <div className='flex justify-between' >
                    <h2 className='text-[var(--white-8)] flex items-center gap-1.5 font-extrabold' >OPPS USING JAVA <Coffee size="15" /> </h2>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Ellipsis className='cursor-pointer' />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    account and remove your data from our servers.
                                    <div className="flex gap-2 items-center mt-4">
                                        <h2 className='text-xl' >Class</h2>
                                        <Button className='bg-green-600 cursor-pointer py-0 text-sm px-2 h-6' >Active</Button>
                                    </div>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className='outline-0 ring-0 focus:ring-0' >Cancel</AlertDialogCancel>
                                <AlertDialogAction>Apply</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
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
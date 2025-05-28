import { useState } from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarTrigger } from '../ui/sidebar';
import { Link } from 'react-router-dom';
import { CalendarRange, ChevronUp, LayoutDashboard, Settings, User2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import AppSidebar from '../AppSidebar';

const LandingPage = () => {

    const [user, setUser] = useState(true)
    const [collapsed, setCollapsed] = useState(false);

    const handleSidebarToggle = () => {
        setCollapsed(!collapsed);
    }


    return (

        <>
            {user ?

                //  If user is logged in, show the dashboard
                (
                    <div className='w-full min-h-screen bg-[var(--bg-primary)] flex  justify-center ' >
                        {/* Sidebar */}
                        {/* <div className='w-fit' >
                            <SidebarProvider>
                                <AppSidebar />
                                <div className='text-[var(--text-primary)] z-10 '>
                                    <SidebarTrigger className='hover:bg-[var(--sidebar-trigger)]  cursor-pointer fixed top-2' />
                                </div>
                            </SidebarProvider>
                        </div>

                        <div className='w-[60%] h-[50vh] bg-gray-500 ' ></div> */}
                    </div>
                )

                :

                //  If user is not logged in, show the landing page
                (<div className='w-full min-h-screen bg-[var(--bg-primary)] flex  justify-center ' >
                    <div className='flex flex-col items-center justify-start text-center mt-[35vh]' >
                        <h1 className='text-[5vw] text-coolHeading tracking-wide leading-[4.5vw] text-[var(--text-heading)] ' >Smart Attendance System <br /> Powered by
                            [
                            <span className='text-headline font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-normal ' > Face Recognition </span>
                            ] Technology</h1>
                        {/* Home image showcase */}
                        <div className='w-[55vw] h-[45vh] bg-amber-300/30 mt-[10vh] rounded-md '></div>
                    </div>
                </div>)}
        </>
    )
}

export default LandingPage
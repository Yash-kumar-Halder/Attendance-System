import { useState } from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarTrigger } from '../ui/sidebar';
import { Link } from 'react-router-dom';
import { CalendarRange, ChevronUp, LayoutDashboard, Settings, User2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';


const LandingPage = () => {

    const [user, setUser] = useState(true)
    const [collapsed, setCollapsed] = useState(false);

    const handleSidebarToggle = () => {
        setCollapsed(!collapsed);
    }


    return (

        <>
            {/* If user is not logged in, show the landing page */}
            <div className='w-full min-h-screen bg-[var(--bg))] flex  justify-center ' >
                <div className='flex flex-col items-center justify-start text-center mt-[35vh]' >
                    <h1 className='text-[5vw] text-coolHeading tracking-wide leading-[4.5vw] text-[var(--white-9)] ' >Smart Attendance System <br /> Powered by
                        [
                        <span className='text-headline font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-normal ' > Face Recognition </span>
                        ] Technology</h1>
                    {/* Home image showcase */}
                    <div className="w-[70vw] aspect-[2/1] bg-amber-300/30 mt-[10vh] rounded-md"></div>
                </div>
            </div>

        </>
    )
}

export default LandingPage
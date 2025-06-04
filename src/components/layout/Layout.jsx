import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar'
import { AppSidebar } from '../app-sidebar'
import { useAppSelector, useAppDispatch } from "../../hooks/index.js"
import { Toaster } from '../ui/sonner'
import { toggleCollapse } from '@/Redux/Slices/Application/sidebar'




const Layout = () => {

    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);
    const theme = useAppSelector((state) => state.theme);
    const collapse = useAppSelector((state) => state.sidebar.collapse);

    // const dispatch = useAppDispatch();
    const location = useLocation();
    const noSidebarRoutes = ["/", "/login", "/signup"];
    const showSidebar = !noSidebarRoutes.includes(location.pathname);


    const [isSidebarActive, setIsSidebarActive] = useState(true);
    const handleSidebarToggle = () => {
        dispatch(toggleCollapse());
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key.toLowerCase() === "b") {
                e.preventDefault();
                handleSidebarToggle();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);
    
    



    return (

        <div data-theme={useAppSelector((state) => state.theme.theme)} className='bg-[#0e0e0e] ' >
            <Toaster />
            <SidebarProvider open={collapse} >
                {showSidebar && <AppSidebar />}
                <main className='w-full bg-[var(--bg)] ' >
                   { showSidebar && <SidebarTrigger onClick={handleSidebarToggle} className='cursor-pointer fixed z-30 text-[var(--white-7)] ml-0.5 top-1.5 hover:bg-[var(--white-3)] hover:text-[var(--white-9)]  ' />}
                    <Header isSidebarActive={isSidebarActive} />
                    <Outlet />
                </main>
            </SidebarProvider>
        </div>
    )
}

export default Layout
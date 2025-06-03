import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar'
import { AppSidebar } from '../app-sidebar'
import { useAppSelector, useAppDispatch } from "../../hooks/index.js"
import { Toaster } from '../ui/sonner'




const Layout = () => {

    const user = useAppSelector((state) => state.user);
    const theme = useAppSelector((state) => state.theme);
    // const dispatch = useAppDispatch();
    const location = useLocation();
    const noSidebarRoutes = ["/", "/login", "/signup"];
    const showSidebar = !noSidebarRoutes.includes(location.pathname);


    const [isSidebarActive, setIsSidebarActive] = useState(true);
    const handleSidebarToggle = () => {
        setIsSidebarActive(!isSidebarActive);
    }

    useEffect(() => {
    }, [theme]);



    return (

        <div data-theme={useAppSelector((state) => state.theme.theme)} className='bg-[#0e0e0e] ' >
            <Toaster />
            <SidebarProvider>
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
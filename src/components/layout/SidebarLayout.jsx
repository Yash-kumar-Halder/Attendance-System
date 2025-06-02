import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar'
import { AppSidebar } from '../app-sidebar'
import { useAppSelector, useAppDispatch } from "../../hooks/index.js"
import { Toaster } from '../ui/sonner'




const SidebarLayout = () => {

  const user = useAppSelector((state) => state.user);
  const theme = useAppSelector((state) => state.theme);
  // const dispatch = useAppDispatch();

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
         <AppSidebar />
        <main className='w-full' >

          <SidebarTrigger onClick={handleSidebarToggle} className='cursor-pointer fixed z-30 text-[var(--white-9)] ml-0.5 top-1.5' />
          <Header isSidebarActive={isSidebarActive} />

          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  )
}

export default SidebarLayout
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar'
import { AppSidebar } from '../app-sidebar'
import DashboardSkeleton from '../Skeleton'
import CircleProgressBar from '../CircleProgressBar'
// import { ChartContainer } from '../ui/chart'
// import { Bar, BarChart } from 'recharts'
// import { ChartConfig} from "@/components/ui/chart"
import { useAppSelector, useAppDispatch } from "../../hooks/index.js"
import { setUser } from "../../Redux/Slices/User/user.js"



const Layout = () => {

    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();


    const [isSidebarActive, setIsSidebarActive] = useState(true);

    const handleSidebarToggle = () => {
        setIsSidebarActive(!isSidebarActive);
    }


    // const chartData = [
    //     { month: "January", desktop: 186, mobile: 80 },
    //     { month: "February", desktop: 305, mobile: 200 },
    //     { month: "March", desktop: 237, mobile: 120 },
    //     { month: "April", desktop: 73, mobile: 190 },
    //     { month: "May", desktop: 209, mobile: 130 },
    //     { month: "June", desktop: 214, mobile: 140 },
    // ]
      


    return (
        // <div data-theme={isDarkMode ? "dark" : "light"} className='bg-[var(--bg-primary)] ' >
        //     <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        //     <Outlet />
        //     <Footer />
        // </div>

        <div className='bg-[#0e0e0e] ' >
            <SidebarProvider>
                <AppSidebar />
                <main className='w-full  h-[200vh]' >
                    {/* <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} isSidebarActive={isSidebarActive} /> */}
                    <SidebarTrigger onClick={handleSidebarToggle} className='cursor-pointer fixed z-30 text-white ml-0.5 top-1.5' />
                    <Header isSidebarActive={isSidebarActive} />

                    <div className='w-[100%] px-[2.5%] py-[1.5%] flex flex-wrap gap-[2%] ' >
                        <div className='w-[40%] overflow-hidden aspect-[3/1.8] bg-gray-700 rounded-md my-[1.5%]  ' >
                            <CircleProgressBar
                                value={75}
                                color="text-green-500"
                                baseColor="text-orange-400"
                                label="Present"
                            />

                        </div>
                        <div className='w-[27%] aspect-[3/1.8] bg-gray-700 rounded-md my-[1.5%]  ' >
                            
                        </div>
                        <div className='w-[27%] aspect-[3/1.8] bg-gray-700 rounded-md my-[1.5%]  ' ></div>
                        <div className='w-[60%] aspect-[3/1.4] bg-gray-700 rounded-md my-[1.5%]  ' ></div>
                        <div className='w-[36%] aspect-[3/1.4] bg-gray-700 rounded-md my-[1.5%]  ' ></div>
                    </div>
                <Outlet />
                </main>
            </SidebarProvider>
        </div>
    )
}

export default Layout
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
} from "@/components/ui/sidebar"
import { ArrowDown01, CalendarCheck2, Flame, LayoutDashboard, NotebookTabs, Radiation, Sun, Users } from "lucide-react"
import { useAppSelector } from "../hooks/index.js"
import { Link, NavLink } from "react-router-dom";
import { Settings, ChartColumnBig } from "lucide-react";

export function AppSidebar() {

    const user = useAppSelector((state) => state.user);
    console.log(user)

    const sidebarGroups = {
        teacher: [
            {
                name: "Dashboard",
                icon: <LayoutDashboard size={20} />,
                link: "/home"
            },
            {
                name: "Active Classes",
                icon: <Radiation size={20} />,
                link: "/admin/dashboard"
            },
            {
                name: "LeaderBoard",
                icon: <ChartColumnBig size={20} />,
                link: "/admin/users"
            },
            {
                name: "Filter",
                icon: <ArrowDown01 size={20} />,
                link: "/admin/users"
            },
            {
                name: "Users",
                icon: <Users size={20} />,
                link: "/admin/users"
            },
            {
                name: "Shedule Classes",
                icon: <CalendarCheck2 size={20} />,
                link: "/admin/users"
            },
            {
                name: "Subjects",
                icon: <NotebookTabs size={20} />,
                link: "/admin/users"
            },
        ],
        student: [
            {
                name: "Profile",
                icon: <Sun size={20} />,
                link: "/user/profile"
            },
            {
                name: "Settings",
                icon: <Settings size={20} />,
                link: "/user/settings"
            }
        ]
    }

    return (
        <Sidebar collapsible="icon" >
            <SidebarHeader className='bg-gray-600 h-10 py-0 px-1' >
                <SidebarContent>
                    <SidebarMenu className='h-10 flex justify-center' >
                        <SidebarMenuButton className='hover:bg-transparent content-center py-0 flex items-center' >
                            <a href="#" className="flex h-10 gap-2.5 items-center text-[#ef50f5] " >
                                <Flame className="stroke-[2]" size='20' />
                                <h2 className="text-headline font-medium bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-wider text-nowrap " >{user.user}</h2>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenu>
                </SidebarContent>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup />
                <SidebarGroupContent>
                    <SidebarMenu>
                        {sidebarGroups[user.role]?.map((item, index) => (
                            <NavLink
                                key={index}
                                to={item.link}
                                className={({ isActive }) =>
                                    `${isActive ? "text-amber-300" : "text-stone-400"} flex items-center gap-2 text-nowrap`
                                }
                          >
                                <SidebarMenuButton className='hover:bg-stone-800 hover:text-amber-200 hover:font-semibold cursor-pointer' >
                                    <span className="font-light ml-0.5" >{item.icon}</span>
                                    <span className="text-[16px] font-medium">{item.name}</span>
                                </SidebarMenuButton>
                            </NavLink>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}

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
import { useAppDispatch, useAppSelector } from "../hooks/index.js"
import { Link, NavLink } from "react-router-dom";
import { Settings, ChartColumnBig } from "lucide-react";

export function AppSidebar() {

    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);

    const sidebarGroups = {
        teacher: [
            {
                name: "Dashboard",
                icon: <LayoutDashboard size={18} />,
                link: "/dashboard"
            },
            {
                name: "Active Classes",
                icon: <Radiation size={18} />,
                link: "/classes"
            },
            {
                name: "LeaderBoard",
                icon: <ChartColumnBig size={18} />,
                link: "/leaderboard"
            },
            {
                name: "Filter",
                icon: <ArrowDown01 size={18} />,
                link: "/admin/users"
            },
            {
                name: "Users",
                icon: <Users size={18} />,
                link: "/admin/users"
            },
            {
                name: "Shedule Classes",
                icon: <CalendarCheck2 size={18} />,
                link: "/schedule-classes"
            },
            {
                name: "Subjects",
                icon: <NotebookTabs size={18} />,
                link: "/add-subject"
            },
        ],
        student: [
            {
                name: "Profile",
                icon: <Sun size={18} />,
                link: "/user/profile"
            },
            {
                name: "Settings",
                icon: <Settings size={18} />,
                link: "/user/settings"
            }
        ]
    }

    return (
        <Sidebar collapsible="icon" >
            <SidebarHeader className='bg-[var(--bg-primary)] h-10 py-0 px-1 border-b border-[var(--white-3)] shadow-xs ' >
                <SidebarContent>
                    <SidebarMenu className='h-10 flex justify-center' >
                        <SidebarMenuButton className='hover:bg-transparent content-center py-0 flex items-center' >
                            <a href="#" className="flex h-6 gap-2.5 items-center text-[#ef50f5] " >
                                <Flame className="stroke-[2]" size='20' />
                                <h2 className="text-headline font-medium bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-wider text-nowrap uppercase" >{user.user}</h2>
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
                                    `${isActive ? "text-amber-500 hover:bg-[var(--sidebar-link-a-bg)] font-semibold hover:font-extrabold hover:text-amber-6  00" : "text-[var(--white-7)] hover:font-semibold hover:text-[var(--white-9)] hover:bg-[var(--white-4)]"} flex items-center gap-2 text-nowrap rounded-md mx-1 px-0.5 `
                                }
                            >
                                <SidebarMenuButton className='cursor-pointer rounded-lg' >
                                    <span className="" >{item.icon}</span>
                                    <p className="text-[16px]">{item.name}</p>
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

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
import { Flame, LayoutDashboard, Sun } from "lucide-react"
import { useAppSelector } from "../hooks/index.js"

export function AppSidebar() {

    const user = useAppSelector((state) => state.user);

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
                        <SidebarMenuButton className='hover:bg-gray-700 cursor-pointer' >
                            <a href="#" className="flex items-center gap-3 text-gray-300" >
                                <LayoutDashboard size='24' />
                                <span className="text-[22px]" >Hello</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenu>
                </SidebarGroupContent>
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}

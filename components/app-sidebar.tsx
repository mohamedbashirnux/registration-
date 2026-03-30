"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, UsersIcon, CalendarIcon, UserIcon } from "lucide-react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  // This is sample data.
  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: (
          <LayoutDashboardIcon />
        ),
        isActive: pathname === "/dashboard",
      },
      {
        title: "Students",
        url: "/dashboard/students",
        icon: (
          <UsersIcon />
        ),
        isActive: pathname === "/dashboard/students",
      },
      {
        title: "Seminars",
        url: "/dashboard/seminars",
        icon: (
          <CalendarIcon />
        ),
        isActive: pathname === "/dashboard/seminars",
      },
      {
        title: "Users",
        url: "/dashboard/users",
        icon: (
          <UserIcon />
        ),
        isActive: pathname === "/dashboard/users",
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex h-16 items-center justify-center px-4">
          <img 
            src="/images/Xirfadhub PNG-01 (1).png" 
            alt="Logo" 
            className="h-60 w-auto object-coin"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

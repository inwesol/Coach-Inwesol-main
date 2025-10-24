'use client'

import * as React from 'react'
import { Command, Frame, Map, PieChart, Users } from 'lucide-react'

import { NavProjects } from '@/components/nav-projects'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { User } from '@clerk/nextjs/server'

const data = {
  projects: [
    {
      name: 'Clients',
      url: '/clients',
      icon: Users
    }
    // {
    //   name: 'Dashboard',
    //   url: '/dashboard',
    //   icon: Frame
    // },
    // {
    //   name: 'Client',
    //   url: '/client',
    //   icon: Frame
    // },
    // {
    //   name: 'Mapped',
    //   url: '/mapped',
    //   icon: Frame
    // }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant='inset' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <a href='#'>
                <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                  <Command className='size-4' />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>Inwesol</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}

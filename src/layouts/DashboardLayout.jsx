import { Outlet } from 'react-router-dom'
import { AppSidebar } from '@/components/dashboard/app-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-h-svh max-h-svh overflow-hidden">
        <DashboardHeader />
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

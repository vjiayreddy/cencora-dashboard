import { LayoutDashboard, ScanLine, Settings } from 'lucide-react'

export const navItems = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
    end: true,
  },
  {
    title: 'Scan Sessions',
    href: '/dashboard/sessions',
    icon: ScanLine,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export function getNavLabel(pathname) {
  if (pathname === '/dashboard' || pathname === '/dashboard/') {
    return 'Overview'
  }
  const match = navItems.find(
    (item) => item.href !== '/dashboard' && pathname.startsWith(item.href),
  )
  return match?.title ?? 'Dashboard'
}

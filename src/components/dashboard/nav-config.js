import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
} from 'lucide-react'

export const navItems = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
    end: true,
  },
  {
    title: 'Orders',
    href: '/dashboard/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Customers',
    href: '/dashboard/customers',
    icon: Users,
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
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

import { cn } from '@/lib/utils'

/**
 * NavBar — DESIGN.md: nav-bar
 */
export function NavBar({ className, children, ...props }) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex items-center gap-md border-b border-border bg-card p-md text-body-sm text-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </header>
  )
}

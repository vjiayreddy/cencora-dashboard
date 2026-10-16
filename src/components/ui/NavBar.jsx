import { cn } from '../../lib/cn'

/**
 * NavBar — DESIGN.md: nav-bar
 */
export function NavBar({ className, children, ...props }) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex items-center gap-md bg-canvas p-md text-ink text-body-sm',
        className,
      )}
      {...props}
    >
      {children}
    </header>
  )
}

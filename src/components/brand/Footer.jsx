import { cn } from '@/lib/utils'

/**
 * Footer — DESIGN.md: footer
 */
export function Footer({ className, children, ...props }) {
  return (
    <footer
      className={cn(
        'border-t border-border bg-canvas-soft p-xxl text-caption text-ink-secondary',
        className,
      )}
      {...props}
    >
      {children}
    </footer>
  )
}

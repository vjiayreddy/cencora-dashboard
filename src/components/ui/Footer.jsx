import { cn } from '../../lib/cn'

/**
 * Footer — DESIGN.md: footer
 */
export function Footer({ className, children, ...props }) {
  return (
    <footer
      className={cn(
        'bg-canvas-soft p-xxl text-ink-secondary text-caption',
        className,
      )}
      {...props}
    >
      {children}
    </footer>
  )
}

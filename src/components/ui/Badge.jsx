import { cn } from '../../lib/cn'

/**
 * Badge — DESIGN.md: badge-pill
 */
export function Badge({ className, children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-surface px-xs py-xxs text-eyebrow text-primary',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

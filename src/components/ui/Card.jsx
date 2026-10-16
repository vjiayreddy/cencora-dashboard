import { cn } from '../../lib/cn'

/**
 * Card — DESIGN.md: feature-card | feature-card-elevated
 */
export function Card({ elevated = false, className, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-lg bg-surface p-lg text-ink text-body-md',
        elevated ? 'shadow-soft' : 'border border-hairline',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

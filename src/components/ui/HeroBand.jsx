import { cn } from '../../lib/cn'

/**
 * HeroBand — DESIGN.md: hero-band (dark indigo "night" band)
 */
export function HeroBand({ className, children, ...props }) {
  return (
    <section
      className={cn(
        'w-full bg-secondary p-xxl text-on-primary text-display-1',
        className,
      )}
      {...props}
    >
      {children}
    </section>
  )
}

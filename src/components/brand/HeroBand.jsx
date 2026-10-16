import { cn } from '@/lib/utils'

/**
 * HeroBand — DESIGN.md: hero-band (indigo night band; uses --night, not shadcn secondary)
 */
export function HeroBand({ className, children, ...props }) {
  return (
    <section
      className={cn(
        'w-full bg-night p-xxl text-on-primary text-display-1',
        className,
      )}
      {...props}
    >
      {children}
    </section>
  )
}

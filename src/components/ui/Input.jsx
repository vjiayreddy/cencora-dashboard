import { cn } from '../../lib/cn'

/**
 * Input — DESIGN.md: text-input
 */
export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'w-full rounded-xs border border-[#dddddd] bg-surface px-[6px] py-[6px]',
        'text-body-sm text-ink placeholder:text-ink-faint',
        'outline-none focus:shadow-soft',
        className,
      )}
      {...props}
    />
  )
}

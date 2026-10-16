import { cn } from '../../lib/cn'

const variants = {
  primary:
    'bg-primary text-on-primary rounded-full px-md py-xs text-button active:bg-primary-active active:scale-90',
  secondary:
    'bg-surface text-ink rounded-full px-md py-xs text-button shadow-soft active:scale-90',
  utility:
    'bg-surface text-ink rounded-md border border-hairline px-[14px] py-xxs text-button active:scale-95',
  icon: 'inline-flex size-10 items-center justify-center rounded-full bg-black/5 text-ink active:scale-90',
}

/**
 * Button — DESIGN.md: button-primary | button-secondary | button-utility | button-icon-circular
 */
export function Button({
  variant = 'primary',
  className,
  type = 'button',
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-xs transition-transform duration-100',
        'disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

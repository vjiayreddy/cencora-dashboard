import { format } from 'date-fns'

export function formatSessionDate(date) {
  return format(date, 'MMM d, yyyy')
}

export function formatSessionTime(date) {
  return format(date, 'h:mm a')
}

export function scanTypeBadgeClass(type) {
  switch (type) {
    case 'Capture':
      return 'border-emerald-200 bg-emerald-100 text-emerald-800'
    case 'Overage':
      return 'border-sky-200 bg-sky-100 text-sky-800'
    case 'Damage':
      return 'border-red-200 bg-red-100 text-red-800'
    default:
      return 'border-border bg-muted text-muted-foreground'
  }
}

export function statusBadgeClass(status) {
  switch (status) {
    case 'New':
      return 'border-border bg-muted text-foreground'
    case 'Vendor Responded & Reviewing':
      return 'border-sky-200 bg-sky-100 text-sky-800'
    case 'MODs Investigating':
      return 'border-amber-200 bg-amber-100 text-amber-900'
    case 'Awaiting DC Response':
      return 'border-orange-200 bg-orange-100 text-orange-900'
    case 'Awaiting Buyer Response':
      return 'border-violet-200 bg-violet-100 text-violet-800'
    default:
      return 'border-border bg-muted text-muted-foreground'
  }
}

export function resolvedBadgeClass(value) {
  switch (value) {
    case 'Okept':
      return 'border-emerald-200 bg-emerald-100 text-emerald-800'
    case 'Oreturn':
      return 'border-sky-200 bg-sky-100 text-sky-800'
    case 'Dreturn':
      return 'border-red-200 bg-red-100 text-red-800'
    case 'SCredited':
      return 'border-teal-200 bg-teal-100 text-teal-800'
    case 'SDenied':
      return 'border-rose-200 bg-rose-100 text-rose-800'
    default:
      return 'border-border bg-muted text-muted-foreground'
  }
}

import { format } from 'date-fns'

export function formatSessionDate(date) {
  return format(date, 'MMM d, yyyy')
}

export function formatSessionTime(date) {
  return format(date, 'h:mm a')
}

/** Format GS1 YYMMDD expiry strings for display (e.g. 270715 → Jul 15, 2027). */
export function formatGtinExpiry(yymmdd) {
  const raw = String(yymmdd ?? '').trim()
  if (!/^\d{6}$/.test(raw)) return raw || '—'

  const yy = Number(raw.slice(0, 2))
  const mm = Number(raw.slice(2, 4))
  const dd = Number(raw.slice(4, 6))
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return raw

  const date = new Date(Date.UTC(2000 + yy, mm - 1, dd))
  if (
    Number.isNaN(date.getTime()) ||
    date.getUTCFullYear() !== 2000 + yy ||
    date.getUTCMonth() !== mm - 1 ||
    date.getUTCDate() !== dd
  ) {
    return raw
  }

  return format(date, 'MMM d, yyyy')
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

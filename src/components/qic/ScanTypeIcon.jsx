import { AlertCircle, CheckCircle, XCircle } from 'lucide-react'

export function ScanTypeIcon({ type, className = 'size-3.5' }) {
  if (type === 'Capture') return <CheckCircle className={className} />
  if (type === 'Overage') return <AlertCircle className={className} />
  if (type === 'Damage') return <XCircle className={className} />
  return null
}

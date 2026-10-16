import { format } from 'date-fns'
import { resolvedOptions } from '@/data/scanSessions'

function csvEscape(value) {
  const str = value == null ? '' : String(value)
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function resolvedLabel(value) {
  return resolvedOptions.find((o) => o.value === value)?.label ?? value ?? ''
}

/**
 * Download a Blob/URL as a named file via temporary anchor.
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export async function downloadImageFile(url, filename) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to download image (${response.status})`)
  }
  const blob = await response.blob()
  downloadBlob(blob, filename)
}

export function exportSessionsCsv(sessions, trackingData) {
  const headers = [
    'Session ID',
    'Supplier',
    'Location',
    'User',
    'Scan Type',
    'PO No',
    'CII-V or CV',
    'Recorded Date',
    'Qty Affected',
    'Status',
    'Resolved',
    'Follow Up 1',
    'Follow Up 2',
    'Follow Up 3',
  ]

  const rows = sessions.map((s) => {
    const t = trackingData[s.id] || {}
    return [
      s.sessionId,
      s.supplierName,
      s.location,
      s.user,
      s.scanType,
      s.poNo,
      s.isCD ? 'Yes' : 'No',
      format(s.recordedDate, 'yyyy-MM-dd HH:mm:ss'),
      s.noOfCodes,
      t.status ?? s.status,
      resolvedLabel(t.resolved ?? s.resolved),
      t.followUp1 || '',
      t.followUp2 || '',
      t.followUp3 || '',
    ]
  })

  const csv = [headers, ...rows]
    .map((row) => row.map(csvEscape).join(','))
    .join('\n')

  const stamp = format(new Date(), 'yyyyMMdd-HHmmss')
  downloadBlob(
    new Blob([csv], { type: 'text/csv;charset=utf-8' }),
    `qic-scan-sessions-${stamp}.csv`,
  )
}

/** Generate a lightweight VNF text file for the session (mock format). */
export function downloadVnfFile(session) {
  const lines = [
    'VNF EXPORT',
    `Session: ${session.sessionId}`,
    `PO: ${session.poNo}`,
    `Supplier: ${session.supplierName}`,
    `Location: ${session.location}`,
    `Scan Type: ${session.scanType}`,
    `Codes: ${session.noOfCodes}`,
    '',
    'GTIN|SERIAL|LOT|EXPIRY|QTY',
    ...session.items.map(
      (item) =>
        `${item.gtin}|${item.serial}|${item.lot}|${item.expiry}|${item.qty}`,
    ),
  ]
  downloadBlob(
    new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' }),
    `${session.sessionId}.vnf.txt`,
  )
}

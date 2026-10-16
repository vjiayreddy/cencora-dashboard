import { locations, scanSessions } from '@/data/scanSessions'

const TRACKING_KEY = 'qic.tracking.v1'
const EMAIL_KEY = 'qic.emailSettings.v1'

function toDateInput(value) {
  if (!value) return ''
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

export function buildDefaultTrackingMap(sessions = scanSessions) {
  return Object.fromEntries(
    sessions.map((s) => [
      s.id,
      {
        status: s.status || 'New',
        followUp1: toDateInput(s.followUp1),
        followUp2: toDateInput(s.followUp2),
        followUp3: toDateInput(s.followUp3),
        resolved: s.resolved || '',
      },
    ]),
  )
}

export function loadTrackingData() {
  try {
    const raw = localStorage.getItem(TRACKING_KEY)
    if (!raw) return buildDefaultTrackingMap()
    const parsed = JSON.parse(raw)
    const defaults = buildDefaultTrackingMap()
    return { ...defaults, ...parsed }
  } catch {
    return buildDefaultTrackingMap()
  }
}

export function saveTrackingData(trackingMap) {
  localStorage.setItem(TRACKING_KEY, JSON.stringify(trackingMap))
}

export function saveSessionTracking(sessionId, patch, currentMap) {
  const next = {
    ...currentMap,
    [sessionId]: { ...currentMap[sessionId], ...patch },
  }
  saveTrackingData(next)
  return next
}

export const DYNAMIC_VARIABLES = [
  { key: '{{session.sessionId}}', label: 'Session ID' },
  { key: '{{session.poNo}}', label: 'PO Number' },
  { key: '{{session.supplierName}}', label: 'Supplier Name' },
  { key: '{{session.location}}', label: 'Location' },
  { key: '{{session.scanType}}', label: 'Scan Type' },
  { key: '{{session.noOfCodes}}', label: 'Quantity Affected' },
  { key: '{{session.user}}', label: 'User' },
]

export function defaultEmailSettings() {
  return {
    to: ['supplier.contact@example.com'],
    cc: ['quality.team@example.com', 'manager@example.com'],
    bcc: ['audit.records@example.com'],
    subject:
      'Follow Up: QIC Scan Session {{session.sessionId}} - PO {{session.poNo}}',
    body: `Hi,

This is a follow-up regarding the QIC scan session detailed below:

Session ID: {{session.sessionId}}
PO Number: {{session.poNo}}
Supplier: {{session.supplierName}}
Location: {{session.location}}
Scan Type: {{session.scanType}}
Quantity Affected: {{session.noOfCodes}}

Please review and provide your response at your earliest convenience.

Thank you,
{{session.user}}`,
  }
}

export function buildDefaultEmailSettingsMap() {
  return Object.fromEntries(
    locations.map((loc) => [loc, defaultEmailSettings()]),
  )
}

export function loadEmailSettings() {
  try {
    const raw = localStorage.getItem(EMAIL_KEY)
    if (!raw) return buildDefaultEmailSettingsMap()
    const parsed = JSON.parse(raw)
    const defaults = buildDefaultEmailSettingsMap()
    const merged = { ...defaults }
    for (const loc of locations) {
      if (parsed[loc]) {
        merged[loc] = { ...defaults[loc], ...parsed[loc] }
      }
    }
    return merged
  } catch {
    return buildDefaultEmailSettingsMap()
  }
}

export function saveEmailSettings(settingsMap) {
  localStorage.setItem(EMAIL_KEY, JSON.stringify(settingsMap))
}

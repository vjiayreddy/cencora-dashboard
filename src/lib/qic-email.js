import { loadEmailSettings } from '@/lib/qic-storage'

export function interpolateTemplate(template, session) {
  if (!template) return ''
  return template
    .replaceAll('{{session.sessionId}}', session.sessionId ?? '')
    .replaceAll('{{session.poNo}}', session.poNo ?? '')
    .replaceAll('{{session.supplierName}}', session.supplierName ?? '')
    .replaceAll('{{session.location}}', session.location ?? '')
    .replaceAll('{{session.scanType}}', session.scanType ?? '')
    .replaceAll('{{session.noOfCodes}}', String(session.noOfCodes ?? ''))
    .replaceAll('{{session.user}}', session.user ?? '')
}

export function buildMailtoForSession(session) {
  const settingsMap = loadEmailSettings()
  const settings =
    settingsMap[session.location] ||
    Object.values(settingsMap)[0] || {
      to: [],
      cc: [],
      bcc: [],
      subject: '',
      body: '',
    }

  const subject = interpolateTemplate(settings.subject, session)
  const body = interpolateTemplate(settings.body, session)
  const params = new URLSearchParams()
  if (settings.cc?.length) params.set('cc', settings.cc.join(','))
  if (settings.bcc?.length) params.set('bcc', settings.bcc.join(','))
  params.set('subject', subject)
  params.set('body', body)

  const to = (settings.to || []).join(',')
  return `mailto:${to}?${params.toString()}`
}

export function openSessionEmail(session) {
  window.location.href = buildMailtoForSession(session)
}

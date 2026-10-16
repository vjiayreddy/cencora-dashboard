import { useState } from 'react'
import { Mail } from 'lucide-react'
import { toast } from 'sonner'
import { locations } from '@/data/scanSessions'
import { EmailChips } from '@/components/qic/EmailChips'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  DYNAMIC_VARIABLES,
  loadEmailSettings,
  saveEmailSettings,
} from '@/lib/qic-storage'

export default function SettingsPage() {
  const [selectedLocation, setSelectedLocation] = useState(locations[0])
  const [emailSettings, setEmailSettings] = useState(() => loadEmailSettings())

  const current = emailSettings[selectedLocation]

  function updateField(field, value) {
    setEmailSettings((prev) => ({
      ...prev,
      [selectedLocation]: {
        ...prev[selectedLocation],
        [field]: value,
      },
    }))
  }

  function handleSave() {
    saveEmailSettings(emailSettings)
    toast.success(`Email settings saved for ${selectedLocation}`)
  }

  function renderBodyPreview() {
    const parts = current.body.split(/({{[^}]+}})/g)
    return parts.map((part, idx) => {
      if (/^{{[^}]+}}$/.test(part)) {
        return (
          <code
            key={idx}
            className="rounded bg-sky-100 px-1.5 py-0.5 font-mono text-xs text-sky-800"
          >
            {part}
          </code>
        )
      }
      return <span key={idx}>{part}</span>
    })
  }

  return (
    <div className="mx-auto flex h-full w-full max-w-4xl flex-col gap-6 overflow-y-auto p-4 md:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure per-location follow-up email templates used from Scan Sessions.
        </p>
      </div>

      <div className="flex items-center gap-2 border-b pb-2 text-sm font-medium text-primary">
        <Mail className="size-4" />
        Email Settings
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <select
          id="location"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="flex h-9 w-full max-w-sm rounded-lg border border-input bg-transparent px-3 text-sm"
        >
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Follow-up email</CardTitle>
          <CardDescription>
            Templates are stored in this browser and used when you click Send Email
            on a session at this location.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <EmailChips
            label="To"
            emails={current.to}
            onChange={(val) => updateField('to', val)}
          />
          <EmailChips
            label="CC"
            emails={current.cc}
            onChange={(val) => updateField('cc', val)}
          />
          <EmailChips
            label="BCC"
            emails={current.bcc}
            onChange={(val) => updateField('bcc', val)}
          />

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={current.subject}
              onChange={(e) => updateField('subject', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Body</Label>
            <Textarea
              id="body"
              rows={12}
              value={current.body}
              onChange={(e) => updateField('body', e.target.value)}
              className="font-mono text-sm"
            />
            <div className="rounded-lg border bg-muted/40 p-4">
              <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Preview (dynamic variables highlighted)
              </p>
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {renderBodyPreview()}
              </div>
            </div>
          </div>

          <div className="space-y-3 border-t pt-4">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Available Dynamic Variables
            </p>
            <div className="flex flex-wrap gap-2">
              {DYNAMIC_VARIABLES.map((v) => (
                <button
                  key={v.key}
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-lg border bg-sky-50 px-2.5 py-1.5 text-xs hover:bg-sky-100"
                  title={`Insert ${v.key} into body`}
                  onClick={() =>
                    updateField('body', `${current.body}${current.body.endsWith('\n') || !current.body ? '' : '\n'}${v.key}`)
                  }
                >
                  <code className="font-mono text-sky-800">{v.key}</code>
                  <span className="text-muted-foreground">— {v.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="button" onClick={handleSave}>
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

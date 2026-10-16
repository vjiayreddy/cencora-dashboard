import { useState } from 'react'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function EmailChips({ emails, onChange, label }) {
  const [input, setInput] = useState('')

  function addEmail() {
    const trimmed = input.trim().replace(/,$/, '')
    if (trimmed && !emails.includes(trimmed)) {
      onChange([...emails, trimmed])
    }
    setInput('')
  }

  function removeEmail(index) {
    onChange(emails.filter((_, i) => i !== index))
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addEmail()
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex min-h-10 flex-wrap items-center gap-2 rounded-lg border border-input bg-background p-2">
        {emails.map((email, idx) => (
          <Badge key={`${email}-${idx}`} variant="secondary" className="gap-1 pr-1">
            {email}
            <button
              type="button"
              onClick={() => removeEmail(idx)}
              className="rounded-full p-0.5 hover:bg-muted"
              aria-label={`Remove ${email}`}
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}
        <Input
          type="email"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addEmail}
          placeholder="Type email and press Enter"
          className="h-7 min-w-[200px] flex-1 border-0 shadow-none focus-visible:ring-0"
        />
      </div>
    </div>
  )
}

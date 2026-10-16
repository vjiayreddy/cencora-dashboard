import { Download, Mail, FileDown } from 'lucide-react'
import { toast } from 'sonner'
import { resolvedOptions, statusOptions } from '@/data/scanSessions'
import { openSessionEmail } from '@/lib/qic-email'
import { downloadImageFile, downloadVnfFile } from '@/lib/qic-export'
import { saveSessionTracking } from '@/lib/qic-storage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function SessionDetailPanel({
  session,
  tracking,
  onTrackingChange,
  setTrackingData,
}) {
  const t = tracking || {
    status: 'New',
    followUp1: '',
    followUp2: '',
    followUp3: '',
    resolved: '',
  }

  function updateField(field, value) {
    onTrackingChange(session.id, field, value)
  }

  function handleSave(e) {
    e.stopPropagation()
    setTrackingData((prev) => {
      const next = saveSessionTracking(session.id, t, prev)
      toast.success(`Tracking saved for ${session.sessionId}`)
      return next
    })
  }

  async function handleImageDownload(e, url, name) {
    e.stopPropagation()
    try {
      await downloadImageFile(url, name)
      toast.success(`Downloaded ${name}`)
    } catch {
      toast.error('Could not download image')
    }
  }

  function handleVnf(e) {
    e.stopPropagation()
    downloadVnfFile(session)
    toast.success(`VNF exported for ${session.sessionId}`)
  }

  function handleEmail(e) {
    e.stopPropagation()
    openSessionEmail(session)
  }

  return (
    <div
      className="space-y-4 border-t bg-muted/30 p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="grid gap-3 rounded-lg border bg-background p-4 sm:grid-cols-2 lg:grid-cols-6">
        <div className="space-y-1.5">
          <Label htmlFor={`status-${session.id}`}>Status</Label>
          <select
            id={`status-${session.id}`}
            value={t.status}
            onChange={(e) => updateField('status', e.target.value)}
            className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`fu1-${session.id}`}>1st Follow Up</Label>
          <Input
            id={`fu1-${session.id}`}
            type="date"
            value={t.followUp1}
            onChange={(e) => updateField('followUp1', e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`fu2-${session.id}`}>2nd Follow Up</Label>
          <Input
            id={`fu2-${session.id}`}
            type="date"
            value={t.followUp2}
            disabled={!t.followUp1}
            onChange={(e) => updateField('followUp2', e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`fu3-${session.id}`}>3rd Follow Up</Label>
          <Input
            id={`fu3-${session.id}`}
            type="date"
            value={t.followUp3}
            disabled={!t.followUp2}
            onChange={(e) => updateField('followUp3', e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`resolved-${session.id}`}>Resolved</Label>
          <select
            id={`resolved-${session.id}`}
            value={t.resolved}
            onChange={(e) => updateField('resolved', e.target.value)}
            className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
          >
            {resolvedOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.value} ({opt.label})
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <Button type="button" className="w-full" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border bg-background">
          <div className="border-b px-4 py-3 text-sm font-medium">
            Scanned Items ({session.noOfCodes} codes)
          </div>
          <div className="max-h-[420px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>GTIN</TableHead>
                  <TableHead>Serial</TableHead>
                  <TableHead>Lot</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {session.items.map((item) => (
                  <TableRow key={`${item.gtin}-${item.serial}`}>
                    <TableCell className="font-mono text-xs">{item.gtin}</TableCell>
                    <TableCell className="font-mono text-xs">{item.serial}</TableCell>
                    <TableCell>{item.lot}</TableCell>
                    <TableCell>{item.expiry}</TableCell>
                    <TableCell className="text-right">{item.qty}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-4 rounded-lg border bg-background p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-medium">Session Images</h3>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={handleVnf}>
                <FileDown data-icon="inline-start" />
                Download VNF
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={handleEmail}>
                <Mail data-icon="inline-start" />
                Send Email
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { url: session.images.original, label: 'Original', name: `${session.id}-original.jpg` },
              { url: session.images.annotated, label: 'Annotated', name: `${session.id}-annotated.jpg` },
            ].map((img) => (
              <div key={img.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{img.label}</span>
                  <button
                    type="button"
                    className="rounded p-1 hover:bg-muted"
                    onClick={(e) => handleImageDownload(e, img.url, img.name)}
                    aria-label={`Download ${img.label}`}
                  >
                    <Download className="size-3.5" />
                  </button>
                </div>
                <a href={img.url} target="_blank" rel="noreferrer">
                  <img
                    src={img.url}
                    alt={img.label}
                    className="aspect-square w-full rounded-md border object-cover"
                  />
                </a>
              </div>
            ))}
          </div>

          <div>
            <p className="mb-2 text-xs text-muted-foreground">Captured Images</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {session.images.captured.map((url, idx) => (
                <div key={url} className="group relative">
                  <button
                    type="button"
                    className="absolute top-1 right-1 z-10 rounded bg-background/90 p-1 opacity-0 shadow group-hover:opacity-100"
                    onClick={(e) =>
                      handleImageDownload(
                        e,
                        url,
                        `${session.id}-capture-${idx + 1}.jpg`,
                      )
                    }
                    aria-label={`Download capture ${idx + 1}`}
                  >
                    <Download className="size-3.5" />
                  </button>
                  <a href={url} target="_blank" rel="noreferrer">
                    <img
                      src={url}
                      alt={`Capture ${idx + 1}`}
                      className="aspect-square w-full rounded-md border object-cover"
                    />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

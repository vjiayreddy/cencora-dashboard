import { useMemo, useState } from 'react'
import { Copy, Search } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { formatGtinExpiry } from '@/lib/qic-format'

function CopyValueButton({ value, label }) {
  async function handleCopy(e) {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(value)
      toast.success(`Copied ${label}`)
    } catch {
      toast.error(`Could not copy ${label}`)
    }
  }

  return (
    <button
      type="button"
      className="rounded p-1 text-accent-teal hover:bg-secondary hover:text-primary"
      onClick={handleCopy}
      aria-label={`Copy ${label}`}
      title={`Copy ${label}`}
    >
      <Copy className="size-3.5" />
    </button>
  )
}

function ScannedItemRow({ item }) {
  return (
    <li className="border-b border-primary/10 px-3 py-2 last:border-b-0 odd:bg-secondary/30 hover:bg-secondary/60">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-primary">
              GTIN
            </span>
            <span className="truncate font-mono text-xs font-medium text-foreground">
              {item.gtin}
            </span>
            <CopyValueButton value={item.gtin} label="GTIN" />
          </div>
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-accent-teal">
              Serial
            </span>
            <span className="truncate font-mono text-xs text-foreground/80">
              {item.serial}
            </span>
            <CopyValueButton value={item.serial} label="serial" />
          </div>
          <p className="text-xs text-ink-muted">
            <span className="font-medium text-accent-orange">Lot</span> {item.lot}
            <span className="mx-1.5 text-primary/30">·</span>
            <span className="font-medium text-accent-green">Exp</span>{' '}
            {formatGtinExpiry(item.expiry)}
          </p>
        </div>
        <Badge className="shrink-0 border-transparent bg-accent-orange text-white hover:bg-accent-orange-deep">
          Qty {item.qty}
        </Badge>
      </div>
    </li>
  )
}

export function ScannedItemsList({ items, noOfCodes }) {
  const [query, setQuery] = useState('')
  const itemCount = items.length

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter(
      (item) =>
        item.gtin.toLowerCase().includes(q) ||
        item.serial.toLowerCase().includes(q) ||
        item.lot.toLowerCase().includes(q),
    )
  }, [items, query])

  return (
    <div className="rounded-md border border-primary/20 bg-card">
      <div className="space-y-2 border-b border-primary/15 bg-primary/[0.06] px-3 py-2">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <h3 className="text-sm font-semibold text-primary">
            Scanned Items ({itemCount})
          </h3>
          {noOfCodes !== itemCount ? (
            <p className="text-xs font-medium text-accent-orange">
              {noOfCodes} codes affected
            </p>
          ) : null}
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-accent-teal" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search GTIN, serial, or lot…"
            className="h-8 border-primary/20 bg-background pl-8"
            aria-label="Search scanned items"
          />
        </div>
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-ink-muted">
            {query.trim()
              ? 'No items match your search.'
              : 'No scanned items in this session.'}
          </p>
        ) : (
          <ul>
            {filtered.map((item) => (
              <ScannedItemRow
                key={`${item.gtin}-${item.serial}`}
                item={item}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

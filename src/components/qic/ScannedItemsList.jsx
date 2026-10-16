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
      className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
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
    <li className="border-b px-4 py-3 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex min-w-0 items-center gap-1">
            <span className="shrink-0 text-xs text-muted-foreground">GTIN</span>
            <span className="truncate font-mono text-xs font-medium">
              {item.gtin}
            </span>
            <CopyValueButton value={item.gtin} label="GTIN" />
          </div>
          <div className="flex min-w-0 items-center gap-1">
            <span className="shrink-0 text-xs text-muted-foreground">Serial</span>
            <span className="truncate font-mono text-xs text-muted-foreground">
              {item.serial}
            </span>
            <CopyValueButton value={item.serial} label="serial" />
          </div>
          <p className="text-xs text-muted-foreground">
            Lot {item.lot}
            <span className="mx-1.5 text-border">·</span>
            Exp {formatGtinExpiry(item.expiry)}
          </p>
        </div>
        <Badge variant="secondary" className="shrink-0">
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
    <div className="rounded-lg border bg-background">
      <div className="space-y-3 border-b px-4 py-3">
        <div>
          <h3 className="text-sm font-medium">
            Scanned Items ({itemCount})
          </h3>
          {noOfCodes !== itemCount ? (
            <p className="text-xs text-muted-foreground">
              {noOfCodes} codes affected
            </p>
          ) : null}
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search GTIN, serial, or lot…"
            className="h-8 pl-8"
            aria-label="Search scanned items"
          />
        </div>
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
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

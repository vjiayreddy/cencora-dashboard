import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Download,
  Filter,
  Search,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  locations,
  resolvedOptions,
  scanSessions,
  scanTypes,
  statusOptions,
  suppliers,
  users,
} from '@/data/scanSessions'
import { ScanTypeIcon } from '@/components/qic/ScanTypeIcon'
import { SessionDetailPanel } from '@/components/qic/SessionDetailPanel'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { exportSessionsCsv } from '@/lib/qic-export'
import {
  formatSessionDate,
  formatSessionTime,
  resolvedBadgeClass,
  scanTypeBadgeClass,
  statusBadgeClass,
} from '@/lib/qic-format'
import { loadTrackingData } from '@/lib/qic-storage'
import { cn } from '@/lib/utils'

const COLUMN_LABELS = {
  supplierName: 'Supplier Name',
  location: 'Location',
  user: 'User',
  scanType: 'Scan Type',
  poNo: 'PO No',
  isCD: 'CII-V or CV',
  recordedDate: 'Recorded Date',
  noOfCodes: 'Qty Affected',
  sessionId: 'Session ID',
  status: 'Status',
  resolved: 'Resolved',
}

const DEFAULT_COLUMNS = Object.fromEntries(
  Object.keys(COLUMN_LABELS).map((key) => [key, true]),
)

const emptyFilters = {
  supplier: '',
  user: '',
  location: '',
  poNo: '',
  isCD: '',
  scanType: '',
  status: '',
  resolved: '',
  serial: '',
  gtin: '',
  sessionId: '',
  dateFrom: '',
  dateTo: '',
}

function resolvedLabel(value) {
  return resolvedOptions.find((o) => o.value === value)?.label ?? value
}

function SortableHeader({
  column,
  children,
  visible,
  sortColumn,
  onSort,
}) {
  if (!visible) return null
  return (
    <TableHead>
      <button
        type="button"
        className="inline-flex items-center gap-1 font-medium"
        onClick={() => onSort(column)}
      >
        {children}
        <ArrowUpDown
          className={cn(
            'size-3.5',
            sortColumn === column ? 'opacity-100' : 'opacity-40',
          )}
        />
      </button>
    </TableHead>
  )
}

export default function AuditSessionsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState(emptyFilters)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [columnsOpen, setColumnsOpen] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState(DEFAULT_COLUMNS)
  const [expandedRows, setExpandedRows] = useState({})
  const [sortColumn, setSortColumn] = useState('recordedDate')
  const [sortDirection, setSortDirection] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [trackingData, setTrackingData] = useState(() => loadTrackingData())
  const [detailWidth, setDetailWidth] = useState(0)
  const tableScrollRef = useRef(null)

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  useEffect(() => {
    const el = tableScrollRef.current
    if (!el) return

    const updateWidth = () => setDetailWidth(el.clientWidth)
    updateWidth()

    const observer = new ResizeObserver(updateWidth)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const filteredData = useMemo(() => {
    return scanSessions.filter((s) => {
      const tracking = trackingData[s.id] || {}
      const q = searchQuery.trim().toLowerCase()

      if (q) {
        const haystack = [
          s.sessionId,
          s.poNo,
          s.user,
          s.location,
          s.supplierName,
          ...s.items.map((i) => i.gtin),
          ...s.items.map((i) => i.serial),
        ]
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(q)) return false
      }

      if (filters.supplier && s.supplierName !== filters.supplier) return false
      if (filters.user && s.user !== filters.user) return false
      if (filters.location && s.location !== filters.location) return false
      if (
        filters.poNo &&
        !s.poNo.toLowerCase().includes(filters.poNo.toLowerCase())
      ) {
        return false
      }
      if (filters.isCD !== '' && s.isCD !== (filters.isCD === 'true')) {
        return false
      }
      if (filters.scanType && s.scanType !== filters.scanType) return false
      if (filters.status && tracking.status !== filters.status) return false
      if (filters.resolved && tracking.resolved !== filters.resolved) {
        return false
      }
      if (
        filters.serial &&
        !s.items.some((i) =>
          i.serial.toLowerCase().includes(filters.serial.toLowerCase()),
        )
      ) {
        return false
      }
      if (
        filters.gtin &&
        !s.items.some((i) =>
          i.gtin.toLowerCase().includes(filters.gtin.toLowerCase()),
        )
      ) {
        return false
      }
      if (
        filters.sessionId &&
        !s.sessionId.toLowerCase().includes(filters.sessionId.toLowerCase())
      ) {
        return false
      }
      if (filters.dateFrom) {
        const from = new Date(filters.dateFrom)
        from.setHours(0, 0, 0, 0)
        if (s.recordedDate < from) return false
      }
      if (filters.dateTo) {
        const to = new Date(filters.dateTo)
        to.setHours(23, 59, 59, 999)
        if (s.recordedDate > to) return false
      }
      return true
    })
  }, [searchQuery, filters, trackingData])

  const sortedData = useMemo(() => {
    const copy = [...filteredData]
    copy.sort((a, b) => {
      const ta = trackingData[a.id] || {}
      const tb = trackingData[b.id] || {}
      let av
      let bv
      if (sortColumn === 'status') {
        av = ta.status
        bv = tb.status
      } else if (sortColumn === 'resolved') {
        av = ta.resolved
        bv = tb.resolved
      } else if (sortColumn === 'isCD') {
        av = a.isCD ? 1 : 0
        bv = b.isCD ? 1 : 0
      } else {
        av = a[sortColumn]
        bv = b[sortColumn]
      }

      if (av instanceof Date && bv instanceof Date) {
        return sortDirection === 'asc' ? av - bv : bv - av
      }
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDirection === 'asc' ? av - bv : bv - av
      }
      const as = String(av ?? '')
      const bs = String(bv ?? '')
      return sortDirection === 'asc' ? as.localeCompare(bs) : bs.localeCompare(as)
    })
    return copy
  }, [filteredData, sortColumn, sortDirection, trackingData])

  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage))
  const page = Math.min(currentPage, totalPages)
  const paginatedData = sortedData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  )
  const rangeStart =
    sortedData.length === 0 ? 0 : (page - 1) * itemsPerPage + 1
  const rangeEnd = Math.min(page * itemsPerPage, sortedData.length)

  useEffect(() => {
    const el = tableScrollRef.current
    if (!el) return
    el.scrollTop = 0
    el.scrollLeft = 0
  }, [page, itemsPerPage])

  function goToPage(next) {
    setExpandedRows({})
    setCurrentPage(next)
  }

  function setFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
    goToPage(1)
  }

  function clearFilters() {
    setFilters(emptyFilters)
    setSearchQuery('')
    goToPage(1)
  }

  function handleSort(column) {
    if (sortColumn === column) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  function toggleRow(id) {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function toggleColumn(column) {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }))
  }

  function updateTracking(sessionId, field, value) {
    setTrackingData((prev) => ({
      ...prev,
      [sessionId]: { ...prev[sessionId], [field]: value },
    }))
  }

  function handleExport() {
    exportSessionsCsv(sortedData, trackingData)
    toast.success(`Exported ${sortedData.length} sessions to CSV`)
  }

  const visibleCount = Object.values(visibleColumns).filter(Boolean).length

  const pageButtons = useMemo(() => {
    const buttons = []
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - 1 && i <= page + 1)
      ) {
        buttons.push(i)
      } else if (buttons[buttons.length - 1] !== '…') {
        buttons.push('…')
      }
    }
    return buttons
  }, [page, totalPages])

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="sticky top-0 z-10 shrink-0 border-b bg-background px-4 py-3 md:px-6">
        <div className="mb-3 flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Scan Sessions</h1>
          <p className="text-sm text-muted-foreground">
            Audit GS1 scan sessions — filter, track follow-ups, and export results.
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                goToPage(1)
              }}
              placeholder="Search session, PO, user, location, GTIN, serial…"
              className="bg-white pl-8"
            />
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant={filtersOpen || activeFilterCount > 0 ? 'default' : 'outline'}
                >
                  <Filter data-icon="inline-start" />
                  Filters
                  {activeFilterCount > 0 ? (
                    <Badge variant="secondary" className="ml-1">
                      {activeFilterCount}
                    </Badge>
                  ) : null}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-[min(920px,calc(100vw-2rem))] max-h-[min(70vh,640px)] overflow-y-auto p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">Filters</p>
                  {(activeFilterCount > 0 || searchQuery) && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                    >
                      <X data-icon="inline-start" />
                      Clear All
                    </Button>
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <FilterSelect
                    label="Supplier"
                    value={filters.supplier}
                    onChange={(v) => setFilter('supplier', v)}
                    options={suppliers}
                  />
                  <FilterSelect
                    label="User"
                    value={filters.user}
                    onChange={(v) => setFilter('user', v)}
                    options={users}
                  />
                  <FilterSelect
                    label="Location"
                    value={filters.location}
                    onChange={(v) => setFilter('location', v)}
                    options={locations}
                  />
                  <div className="space-y-1.5">
                    <Label>PO No</Label>
                    <Input
                      value={filters.poNo}
                      onChange={(e) => setFilter('poNo', e.target.value)}
                      placeholder="PO-…"
                    />
                  </div>
                  <FilterSelect
                    label="CII-V or CV"
                    value={filters.isCD}
                    onChange={(v) => setFilter('isCD', v)}
                    options={[
                      { value: 'true', label: 'Yes' },
                      { value: 'false', label: 'No' },
                    ]}
                  />
                  <FilterSelect
                    label="Scan Type"
                    value={filters.scanType}
                    onChange={(v) => setFilter('scanType', v)}
                    options={scanTypes}
                  />
                  <FilterSelect
                    label="Status"
                    value={filters.status}
                    onChange={(v) => setFilter('status', v)}
                    options={statusOptions}
                  />
                  <FilterSelect
                    label="Resolved"
                    value={filters.resolved}
                    onChange={(v) => setFilter('resolved', v)}
                    options={resolvedOptions.map((o) => ({
                      value: o.value,
                      label: `${o.value} — ${o.label}`,
                    }))}
                  />
                  <div className="space-y-1.5">
                    <Label>Serial</Label>
                    <Input
                      value={filters.serial}
                      onChange={(e) => setFilter('serial', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>GTIN</Label>
                    <Input
                      value={filters.gtin}
                      onChange={(e) => setFilter('gtin', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Session ID</Label>
                    <Input
                      value={filters.sessionId}
                      onChange={(e) => setFilter('sessionId', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Date From</Label>
                    <Input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilter('dateFrom', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Date To</Label>
                    <Input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilter('dateTo', e.target.value)}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover open={columnsOpen} onOpenChange={setColumnsOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant={columnsOpen ? 'default' : 'outline'}
                >
                  <Columns3 data-icon="inline-start" />
                  Columns
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-72 p-3">
                <p className="mb-2 text-sm font-medium">Visible columns</p>
                <div className="grid gap-2">
                  {Object.entries(COLUMN_LABELS).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={visibleColumns[key]}
                        onCheckedChange={() => toggleColumn(key)}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Button type="button" variant="outline" onClick={handleExport}>
              <Download data-icon="inline-start" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      <div
        ref={tableScrollRef}
        className="min-h-0 min-w-0 flex-1 overflow-x-auto overflow-y-auto bg-card"
      >
        <Table className="min-w-[1100px]">
          <TableHeader className="sticky top-0 z-[1] bg-muted/95 backdrop-blur">
            <TableRow className="bg-muted/50">
              <TableHead className="w-10" />
              <SortableHeader
                column="supplierName"
                visible={visibleColumns.supplierName}
                sortColumn={sortColumn}
                onSort={handleSort}
              >
                Supplier Name
              </SortableHeader>
              <SortableHeader
                column="location"
                visible={visibleColumns.location}
                sortColumn={sortColumn}
                onSort={handleSort}
              >
                Location
              </SortableHeader>
              <SortableHeader
                column="user"
                visible={visibleColumns.user}
                sortColumn={sortColumn}
                onSort={handleSort}
              >
                User
              </SortableHeader>
              <SortableHeader
                column="scanType"
                visible={visibleColumns.scanType}
                sortColumn={sortColumn}
                onSort={handleSort}
              >
                Scan Type
              </SortableHeader>
              <SortableHeader
                column="poNo"
                visible={visibleColumns.poNo}
                sortColumn={sortColumn}
                onSort={handleSort}
              >
                PO No
              </SortableHeader>
              <SortableHeader
                column="isCD"
                visible={visibleColumns.isCD}
                sortColumn={sortColumn}
                onSort={handleSort}
              >
                CII-V or CV
              </SortableHeader>
              <SortableHeader
                column="recordedDate"
                visible={visibleColumns.recordedDate}
                sortColumn={sortColumn}
                onSort={handleSort}
              >
                Recorded Date
              </SortableHeader>
              <SortableHeader
                column="noOfCodes"
                visible={visibleColumns.noOfCodes}
                sortColumn={sortColumn}
                onSort={handleSort}
              >
                Qty Affected
              </SortableHeader>
              <SortableHeader
                column="sessionId"
                visible={visibleColumns.sessionId}
                sortColumn={sortColumn}
                onSort={handleSort}
              >
                Session ID
              </SortableHeader>
              <SortableHeader
                column="status"
                visible={visibleColumns.status}
                sortColumn={sortColumn}
                onSort={handleSort}
              >
                Status
              </SortableHeader>
              <SortableHeader
                column="resolved"
                visible={visibleColumns.resolved}
                sortColumn={sortColumn}
                onSort={handleSort}
              >
                Resolved
              </SortableHeader>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={visibleCount + 1}
                  className="h-32 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Search className="size-8 opacity-40" />
                    <p className="font-medium">No results found</p>
                    <p className="text-xs">
                      Try adjusting search or clearing filters.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((session) => {
                const tracking = trackingData[session.id] || {}
                const expanded = !!expandedRows[session.id]
                return (
                  <SessionRows
                    key={session.id}
                    session={session}
                    tracking={tracking}
                    expanded={expanded}
                    detailWidth={detailWidth}
                    visibleColumns={visibleColumns}
                    visibleCount={visibleCount}
                    onToggle={() => toggleRow(session.id)}
                    onTrackingChange={updateTracking}
                    setTrackingData={setTrackingData}
                  />
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex h-12 shrink-0 flex-wrap items-center justify-between gap-3 border-t bg-background px-4 text-sm md:px-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Label htmlFor="page-size" className="whitespace-nowrap">
            Rows per page
          </Label>
          <select
            id="page-size"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value))
              goToPage(1)
            }}
            className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm text-foreground"
          >
            {[5, 10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={page <= 1}
            aria-label="Previous page"
            onClick={() => goToPage(Math.max(1, page - 1))}
          >
            <ChevronLeft />
          </Button>
          {pageButtons.map((btn, idx) =>
            btn === '…' ? (
              <span
                key={`e-${idx}`}
                className="px-1.5 text-muted-foreground"
                aria-hidden
              >
                …
              </span>
            ) : (
              <Button
                key={btn}
                type="button"
                size="icon-sm"
                variant={btn === page ? 'default' : 'outline'}
                aria-label={`Page ${btn}`}
                aria-current={btn === page ? 'page' : undefined}
                onClick={() => goToPage(btn)}
              >
                {btn}
              </Button>
            ),
          )}
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={page >= totalPages}
            aria-label="Next page"
            onClick={() => goToPage(Math.min(totalPages, page + 1))}
          >
            <ChevronRight />
          </Button>
        </div>

        <div className="min-w-[9rem] text-right text-muted-foreground tabular-nums">
          {rangeStart}–{rangeEnd} of {sortedData.length}
        </div>
      </div>
    </div>
  )
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
      >
        <option value="">All</option>
        {options.map((opt) =>
          typeof opt === 'string' ? (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ) : (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ),
        )}
      </select>
    </div>
  )
}

function SessionRows({
  session,
  tracking,
  expanded,
  detailWidth,
  visibleColumns,
  visibleCount,
  onToggle,
  onTrackingChange,
  setTrackingData,
}) {
  return (
    <>
      <TableRow
        className="cursor-pointer"
        data-state={expanded ? 'selected' : undefined}
        onClick={onToggle}
      >
        <TableCell>
          {expanded ? (
            <ChevronDown className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          )}
        </TableCell>
        {visibleColumns.supplierName ? (
          <TableCell>{session.supplierName}</TableCell>
        ) : null}
        {visibleColumns.location ? (
          <TableCell>{session.location}</TableCell>
        ) : null}
        {visibleColumns.user ? <TableCell>{session.user}</TableCell> : null}
        {visibleColumns.scanType ? (
          <TableCell>
            <Badge
              variant="outline"
              className={cn('gap-1', scanTypeBadgeClass(session.scanType))}
            >
              <ScanTypeIcon type={session.scanType} />
              {session.scanType}
            </Badge>
          </TableCell>
        ) : null}
        {visibleColumns.poNo ? (
          <TableCell className="font-medium text-primary">{session.poNo}</TableCell>
        ) : null}
        {visibleColumns.isCD ? (
          <TableCell>
            <Badge variant={session.isCD ? 'default' : 'secondary'}>
              {session.isCD ? 'Yes' : 'No'}
            </Badge>
          </TableCell>
        ) : null}
        {visibleColumns.recordedDate ? (
          <TableCell>
            <div>{formatSessionDate(session.recordedDate)}</div>
            <div className="text-xs text-muted-foreground">
              {formatSessionTime(session.recordedDate)}
            </div>
          </TableCell>
        ) : null}
        {visibleColumns.noOfCodes ? (
          <TableCell>
            <Badge variant="secondary">{session.noOfCodes}</Badge>
          </TableCell>
        ) : null}
        {visibleColumns.sessionId ? (
          <TableCell className="min-w-[220px] whitespace-nowrap font-mono text-xs text-muted-foreground">
            {session.sessionId}
          </TableCell>
        ) : null}
        {visibleColumns.status ? (
          <TableCell className="min-w-[160px] whitespace-nowrap">
            <Badge
              variant="outline"
              className={statusBadgeClass(tracking.status)}
            >
              {tracking.status}
            </Badge>
          </TableCell>
        ) : null}
        {visibleColumns.resolved ? (
          <TableCell className="min-w-[100px] whitespace-nowrap">
            <Badge
              variant="outline"
              title={resolvedLabel(tracking.resolved)}
              className={resolvedBadgeClass(tracking.resolved)}
            >
              {tracking.resolved}
            </Badge>
          </TableCell>
        ) : null}
      </TableRow>
      {expanded ? (
        <TableRow className="hover:bg-transparent">
          <TableCell colSpan={visibleCount + 1} className="p-0">
            <div
              className="sticky left-0 max-w-full"
              style={{
                width: detailWidth > 0 ? detailWidth : '100%',
              }}
            >
              <SessionDetailPanel
                session={session}
                tracking={tracking}
                onTrackingChange={onTrackingChange}
                setTrackingData={setTrackingData}
              />
            </div>
          </TableCell>
        </TableRow>
      ) : null}
    </>
  )
}

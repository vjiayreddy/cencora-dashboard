import { Link } from 'react-router-dom'
import {
  AlertCircle,
  CheckCircle,
  ClipboardList,
  Package,
  XCircle,
} from 'lucide-react'
import { scanSessions } from '@/data/scanSessions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScanTypeIcon } from '@/components/qic/ScanTypeIcon'
import { formatSessionDate, scanTypeBadgeClass } from '@/lib/qic-format'
import { cn } from '@/lib/utils'

const captureCount = scanSessions.filter((s) => s.scanType === 'Capture').length
const overageCount = scanSessions.filter((s) => s.scanType === 'Overage').length
const damageCount = scanSessions.filter((s) => s.scanType === 'Damage').length
const totalCodes = scanSessions.reduce((sum, s) => sum + s.noOfCodes, 0)
const newCount = scanSessions.filter((s) => s.status === 'New').length

const kpis = [
  {
    title: 'Total Sessions',
    value: String(scanSessions.length),
    change: `${newCount} marked New`,
    icon: ClipboardList,
  },
  {
    title: 'Codes Affected',
    value: String(totalCodes),
    change: 'Across all mock sessions',
    icon: Package,
  },
  {
    title: 'Capture',
    value: String(captureCount),
    change: 'Successful captures',
    icon: CheckCircle,
  },
  {
    title: 'Exceptions',
    value: String(overageCount + damageCount),
    change: `${overageCount} overage · ${damageCount} damage`,
    icon: AlertCircle,
  },
]

const recent = [...scanSessions]
  .sort((a, b) => b.recordedDate - a.recordedDate)
  .slice(0, 6)

export default function OverviewPage() {
  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-4 md:p-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">
            QIC Scan Data Portal — mock session summary.
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/sessions">Open Scan Sessions</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>By scan type</CardTitle>
            <CardDescription>Distribution of mock sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { type: 'Capture', count: captureCount, icon: CheckCircle },
              { type: 'Overage', count: overageCount, icon: AlertCircle },
              { type: 'Damage', count: damageCount, icon: XCircle },
            ].map((row) => (
              <div
                key={row.type}
                className="flex items-center justify-between rounded-lg border px-3 py-2"
              >
                <div className="flex items-center gap-2 text-sm">
                  <row.icon className="size-4 text-muted-foreground" />
                  {row.type}
                </div>
                <Badge
                  variant="outline"
                  className={cn(scanTypeBadgeClass(row.type))}
                >
                  {row.count}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent sessions</CardTitle>
            <CardDescription>Latest recorded audit activity</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono text-xs">{s.sessionId}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn('gap-1', scanTypeBadgeClass(s.scanType))}
                      >
                        <ScanTypeIcon type={s.scanType} />
                        {s.scanType}
                      </Badge>
                    </TableCell>
                    <TableCell>{s.location}</TableCell>
                    <TableCell>{formatSessionDate(s.recordedDate)}</TableCell>
                    <TableCell className="text-right">{s.noOfCodes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

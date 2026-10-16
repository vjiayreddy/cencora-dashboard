import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

const kpis = [
  {
    title: 'Revenue',
    value: '$45,231',
    change: '+20.1% from last month',
  },
  {
    title: 'Orders',
    value: '2,350',
    change: '+12.5% from last month',
  },
  {
    title: 'Customers',
    value: '1,204',
    change: '+8.2% from last month',
  },
  {
    title: 'Conversion',
    value: '3.2%',
    change: '+0.4% from last month',
  },
]

const revenueData = [
  { month: 'Jan', revenue: 18600 },
  { month: 'Feb', revenue: 20500 },
  { month: 'Mar', revenue: 23700 },
  { month: 'Apr', revenue: 22100 },
  { month: 'May', revenue: 28900 },
  { month: 'Jun', revenue: 31200 },
]

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'var(--primary)',
  },
}

const recentOrders = [
  {
    id: 'ORD-1042',
    customer: 'Nora Ellis',
    status: 'Paid',
    total: '$249.00',
  },
  {
    id: 'ORD-1041',
    customer: 'Marcus Chen',
    status: 'Pending',
    total: '$89.50',
  },
  {
    id: 'ORD-1040',
    customer: 'Priya Shah',
    status: 'Paid',
    total: '$420.00',
  },
  {
    id: 'ORD-1039',
    customer: 'Jordan Lee',
    status: 'Refunded',
    total: '$64.00',
  },
  {
    id: 'ORD-1038',
    customer: 'Sam Rivera',
    status: 'Paid',
    total: '$156.25',
  },
]

function statusVariant(status) {
  if (status === 'Paid') return 'default'
  if (status === 'Pending') return 'secondary'
  return 'outline'
}

export default function OverviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Snapshot of store performance for the current period.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} size="sm">
            <CardHeader>
              <CardDescription>{kpi.title}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                {kpi.value}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{kpi.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>Monthly revenue for the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="aspect-auto h-[260px] w-full">
              <AreaChart
                accessibilityLayer
                data={revenueData}
                margin={{ left: 12, right: 12 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  dataKey="revenue"
                  type="natural"
                  fill="var(--color-revenue)"
                  fillOpacity={0.2}
                  stroke="var(--color-revenue)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent orders</CardTitle>
            <CardDescription>Latest transactions across the store</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {order.total}
                    </TableCell>
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

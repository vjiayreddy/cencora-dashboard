import { useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import DataGrid from '@/components/DataGrid'
import { orders, statusVariant } from '@/data/orders'

function StatusCellRenderer({ value }) {
  return <Badge variant={statusVariant(value)}>{value}</Badge>
}

function currencyFormatter({ value }) {
  if (value == null) return ''
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export default function OrdersPage() {
  const columnDefs = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'Order',
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        minWidth: 140,
      },
      {
        field: 'customer',
        headerName: 'Customer',
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        minWidth: 160,
      },
      {
        field: 'status',
        headerName: 'Status',
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        cellRenderer: StatusCellRenderer,
        minWidth: 120,
      },
      {
        field: 'date',
        headerName: 'Date',
        filter: 'agDateColumnFilter',
        floatingFilter: true,
        minWidth: 130,
      },
      {
        field: 'items',
        headerName: 'Items',
        filter: 'agNumberColumnFilter',
        floatingFilter: true,
        minWidth: 100,
      },
      {
        field: 'total',
        headerName: 'Total',
        filter: 'agNumberColumnFilter',
        floatingFilter: true,
        valueFormatter: currencyFormatter,
        minWidth: 120,
      },
    ],
    [],
  )

  const rowSelection = useMemo(
    () => ({
      mode: 'multiRow',
      checkboxes: true,
      headerCheckbox: true,
    }),
    [],
  )

  return (
    <div className="-mx-4 -mb-4 flex min-h-0 flex-1 flex-col gap-4 md:-mx-6 md:-mb-6">
      <div className="flex shrink-0 flex-col gap-1 px-4 md:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground">
          Browse, filter, and manage store orders.
        </p>
      </div>

      <DataGrid
        className="min-h-0 flex-1 border-x-0 border-b-0"
        rowData={orders}
        columnDefs={columnDefs}
        rowSelection={rowSelection}
        paginationPageSize={10}
      />
    </div>
  )
}

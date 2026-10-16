import { themeQuartz } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { cn } from '@/lib/utils'

const defaultTheme = themeQuartz.withParams({
  backgroundColor: 'var(--card)',
  foregroundColor: 'var(--foreground)',
  borderColor: 'var(--border)',
  headerBackgroundColor: 'var(--muted)',
  oddRowBackgroundColor: 'var(--card)',
  rowHoverColor: 'var(--accent)',
  selectedRowBackgroundColor: 'var(--accent)',
  chromeBackgroundColor: 'var(--card)',
  fontFamily: 'var(--font-sans)',
  borderRadius: 0,
  spacing: 8,
})

const defaultColDefDefaults = {
  sortable: true,
  filter: true,
  resizable: true,
  flex: 1,
  minWidth: 100,
}

/**
 * Reusable AG Grid wrapper with Community defaults and app-aligned Quartz theme.
 * Pass `height="100%"` (default) with a flex parent using `min-h-0 flex-1` to fill space.
 */
export default function DataGrid({
  rowData,
  columnDefs,
  defaultColDef,
  className,
  height = '100%',
  pagination = true,
  paginationPageSize = 10,
  paginationPageSizeSelector = [10, 20, 50],
  rowSelection,
  theme = defaultTheme,
  ...gridProps
}) {
  return (
    <div
      className={cn('w-full overflow-hidden border border-border', className)}
      style={{ height }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={{ ...defaultColDefDefaults, ...defaultColDef }}
        theme={theme}
        pagination={pagination}
        paginationPageSize={paginationPageSize}
        paginationPageSizeSelector={paginationPageSizeSelector}
        animateRows
        rowSelection={rowSelection}
        {...gridProps}
      />
    </div>
  )
}

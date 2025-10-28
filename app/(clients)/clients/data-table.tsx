'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useRouter } from 'next/navigation'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../../components/ui/table'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  meta?: any
}

export function DataTable<TData, TValue>({
  columns,
  data,
  meta
}: DataTableProps<TData, TValue>) {
  const router = useRouter()

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta
  })

  const handleRowClick = (row: any, event: React.MouseEvent) => {
    // Don't navigate if clicking on actions column
    if (event.target instanceof Element) {
      const cell = event.target.closest('[data-column-id="actions"]')
      if (cell) {
        return
      }
    }

    const userId = row.original.id
    if (userId) {
      router.push(`/clients/${userId}`)
    }
  }

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup: any) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header: any) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row: any) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className='cursor-pointer hover:bg-muted/50'
                onClick={event => handleRowClick(row, event)}
              >
                {row.getVisibleCells().map((cell: any) => (
                  <TableCell
                    key={cell.id}
                    data-column-id={cell.column.id}
                    className={cell.column.id === 'actions' ? '' : ''}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

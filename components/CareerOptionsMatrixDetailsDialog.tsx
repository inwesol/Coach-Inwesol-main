'use client'

import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Table2, MessageSquare } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

interface MatrixRow {
  id: string
  name: string
}

interface MatrixColumn {
  id: string
  name: string
  disabled: boolean
}

interface MatrixCell {
  colId: string
  rowId: string
  value: number
  comment: string
}

interface CareerOptionsMatrixData {
  id: string
  userId: string
  sessionId: number
  rows: MatrixRow[]
  columns: MatrixColumn[]
  cells: MatrixCell[]
  createdAt: string
  updatedAt: string
}

interface CareerOptionsMatrixDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId: string
  sessionId: number
}

const CareerOptionsMatrixDetailsDialog: React.FC<
  CareerOptionsMatrixDetailsDialogProps
> = ({ open, onOpenChange, clientId, sessionId }) => {
  const [matrixData, setMatrixData] = useState<CareerOptionsMatrixData | null>(
    null
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && clientId) {
      fetchMatrixData()
    }
  }, [open, clientId, sessionId])

  const fetchMatrixData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `/api/session-details/${clientId}/career-options-matrix?sessionId=${sessionId}`
      )
      const data = await response.json()

      if (data.success) {
        setMatrixData(data.data)
      } else {
        setError(data.error || 'Failed to fetch career options matrix data')
      }
    } catch (err) {
      setError('Failed to fetch career options matrix data')
      console.error('Error fetching career options matrix data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Helper function to get cell value for a specific row and column
  const getCellValue = (rowId: string, colId: string): MatrixCell | null => {
    if (!matrixData) return null
    return (
      matrixData.cells.find(
        cell => cell.rowId === rowId && cell.colId === colId
      ) || null
    )
  }

  // Get value color based on score (assuming 1-3 scale, can be adjusted)
  const getValueColor = (value: number | null) => {
    if (value === null) return 'text-gray-400'
    if (value === 3) return 'text-green-600 font-semibold'
    if (value === 2) return 'text-yellow-600 font-semibold'
    if (value === 1) return 'text-orange-600 font-semibold'
    return 'text-gray-600'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-6xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-2xl font-bold'>
            <Table2 className='h-6 w-6' />
            Career Options Matrix
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='h-8 w-8 animate-spin' />
            <span className='ml-2'>Loading career options matrix...</span>
          </div>
        )}

        {error && (
          <div className='py-8 text-center'>
            <div className='mb-4 text-red-500'>{error}</div>
            <p className='text-muted-foreground'>
              No career options matrix data available for this client.
            </p>
          </div>
        )}

        {matrixData && !loading && (
          <div className='space-y-6'>
            {/* Matrix Table */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Table2 className='h-5 w-5' />
                  Career Options Matrix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='overflow-x-auto'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='sticky left-0 z-10 min-w-[200px] bg-white font-semibold'>
                          Career Option
                        </TableHead>
                        {matrixData.columns
                          .filter(col => !col.disabled)
                          .map(column => (
                            <TableHead
                              key={column.id}
                              className='min-w-[150px] text-center font-semibold'
                            >
                              {column.name}
                            </TableHead>
                          ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {matrixData.rows.map(row => (
                        <TableRow key={row.id}>
                          <TableCell className='sticky left-0 z-10 bg-white font-medium'>
                            {row.name}
                          </TableCell>
                          {matrixData.columns
                            .filter(col => !col.disabled)
                            .map(column => {
                              const cell = getCellValue(row.id, column.id)
                              const value = cell?.value ?? null
                              const comment = cell?.comment || ''

                              return (
                                <TableCell
                                  key={column.id}
                                  className='text-center'
                                >
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className='flex items-center justify-center gap-2'>
                                          {comment && (
                                            <MessageSquare className='h-5 w-5 text-gray-400' />
                                          )}
                                          <span
                                            className={getValueColor(value)}
                                          >
                                            {value !== null ? value : '-'}
                                          </span>
                                        </div>
                                      </TooltipTrigger>
                                      {comment && (
                                        <TooltipContent className='max-w-xs'>
                                          <div className='whitespace-pre-line text-sm'>
                                            {comment}
                                          </div>
                                        </TooltipContent>
                                      )}
                                    </Tooltip>
                                  </TooltipProvider>
                                </TableCell>
                              )
                            })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CareerOptionsMatrixDetailsDialog

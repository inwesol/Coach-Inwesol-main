'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { FileText } from 'lucide-react'

interface SessionGuidePdfDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pdfPath: string
  title: string
}

const SessionGuidePdfDialog: React.FC<SessionGuidePdfDialogProps> = ({
  open,
  onOpenChange,
  pdfPath,
  title
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='flex max-h-[90vh] max-w-6xl flex-col overflow-hidden p-0'>
        <DialogHeader className='px-6 pt-6'>
          <DialogTitle className='flex items-center gap-2 text-2xl font-bold'>
            <FileText className='h-6 w-6' />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className='flex-1 overflow-hidden'>
          <iframe
            src={`${pdfPath}#toolbar=0`}
            className='h-full w-full border-0'
            title={title}
            style={{ minHeight: '800px' }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SessionGuidePdfDialog

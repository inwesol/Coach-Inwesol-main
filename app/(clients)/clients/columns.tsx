'use client'

import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

export interface User {
  id: string
  name: string | null
  email: string
  enableByCoach?: {
    'mlc:pnc'?: boolean
    'cs-1:values'?: boolean
    'mtrx:scores'?: boolean
    'cs-2:strengths'?: boolean
  } | null
}

const EnableByCoachActions = ({
  user,
  onToggle
}: {
  user: User
  onToggle: (userId: string, key: string, enabled: boolean) => void
}) => {
  const [loadingKeys, setLoadingKeys] = useState<Set<string>>(new Set())
  const { user: clerkUser } = useUser()

  const handleToggle = async (key: string, checked: boolean) => {
    if (!clerkUser?.emailAddresses?.[0]?.emailAddress) return

    setLoadingKeys(prev => new Set(prev).add(key))
    try {
      const response = await fetch(
        `/api/clients/${user.id}/enable-coach?coachEmail=${encodeURIComponent(clerkUser.emailAddresses[0].emailAddress)}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ key, enabled: checked })
        }
      )

      const data = await response.json()

      if (data.success) {
        onToggle(user.id, key, checked)
      } else {
        console.error('Failed to update client status:', data.error)
      }
    } catch (error) {
      console.error('Error updating client status:', error)
    } finally {
      setLoadingKeys(prev => {
        const newSet = new Set(prev)
        newSet.delete(key)
        return newSet
      })
    }
  }

  const keys = [
    { key: 'cs-1:values', label: 'CS-1:Values' },
    { key: 'cs-2:strengths', label: 'CS-2:Strengths' },
    { key: 'mlc:pnc', label: 'MLC:Pros &Cons' },
    { key: 'mtrx:scores', label: 'MTRX:Scores' }
  ]

  return (
    <div className='flex flex-col gap-1'>
      {keys.map(({ key, label }) => {
        const isEnabled =
          user.enableByCoach?.[key as keyof typeof user.enableByCoach] === true
        const isLoading = loadingKeys.has(key)

        return (
          <div key={key} className='flex items-center justify-end gap-1'>
            <span className='text-xs font-medium text-muted-foreground'>
              {label}
            </span>
            <Switch
              checked={isEnabled}
              onCheckedChange={checked => handleToggle(key, checked)}
              disabled={isLoading}
            />
          </div>
        )
      })}
    </div>
  )
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }: { row: any }) => {
      const name = row.getValue('name') as string | null
      return <div className='font-medium'>{name || 'N/A'}</div>
    }
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }: { row: any }) => {
      const email = row.getValue('email') as string
      return <div className='text-muted-foreground'>{email}</div>
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row, table }: { row: any; table: any }) => {
      const user = row.original as User
      const onToggle = table.options.meta?.onToggle
      return <EnableByCoachActions user={user} onToggle={onToggle} />
    }
  }
]

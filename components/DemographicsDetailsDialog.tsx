'use client'

import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Loader2,
  User,
  Mail,
  Calendar,
  Briefcase,
  GraduationCap,
  Heart,
  Phone
} from 'lucide-react'

interface DemographicsData {
  id: string
  user_id: string
  full_name: string | null
  email: string | null
  phone_number: string | null
  age: number | null
  gender: string | null
  profession: string | null
  previous_coaching: string | null
  education: string | null
  stress_level: number | null
  motivation: string | null
  created_at: string
  updated_at: string
}

interface DemographicsDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId: string
  sessionId: number
}

const DemographicsDetailsDialog: React.FC<DemographicsDetailsDialogProps> = ({
  open,
  onOpenChange,
  clientId,
  sessionId
}) => {
  const [demographicsData, setDemographicsData] =
    useState<DemographicsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && clientId) {
      fetchDemographicsData()
    }
  }, [open, clientId])

  const fetchDemographicsData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `/api/session-details/${clientId}/demographics-details`
      )
      const data = await response.json()

      if (data.success) {
        setDemographicsData(data.data)
      } else {
        setError(data.error || 'Failed to fetch demographics data')
      }
    } catch (err) {
      setError('Failed to fetch demographics data')
      console.error('Error fetching demographics data:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStressLevelText = (level: number | null) => {
    if (level === null) return 'Not specified'
    if (level <= 2) return 'Low'
    if (level <= 4) return 'Moderate'
    if (level <= 6) return 'High'
    return 'Very High'
  }

  const getStressLevelColor = (level: number | null) => {
    if (level === null) return 'bg-gray-100 text-gray-800'
    if (level <= 2) return 'bg-green-100 text-green-800'
    if (level <= 4) return 'bg-yellow-100 text-yellow-800'
    if (level <= 6) return 'bg-orange-100 text-orange-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-2xl font-bold'>
            <User className='h-6 w-6' />
            Demographics Details
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='h-8 w-8 animate-spin' />
            <span className='ml-2'>Loading demographics data...</span>
          </div>
        )}

        {error && (
          <div className='py-8 text-center'>
            <div className='mb-4 text-red-500'>{error}</div>
            <p className='text-muted-foreground'>
              No demographics data available for this client.
            </p>
          </div>
        )}

        {demographicsData && !loading && (
          <div className='space-y-6'>
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <User className='h-5 w-5' />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Full Name
                    </label>
                    <p className='text-lg'>
                      {demographicsData.full_name || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Email
                    </label>
                    <p className='flex items-center gap-2 text-lg'>
                      <Mail className='h-4 w-4' />
                      {demographicsData.email || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Phone Number
                    </label>
                    <p className='flex items-center gap-2 text-lg'>
                      <Phone className='h-4 w-4' />
                      {demographicsData.phone_number || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Age
                    </label>
                    <p className='text-lg'>
                      {demographicsData.age || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Gender
                    </label>
                    <p className='text-lg'>
                      {demographicsData.gender || 'Not provided'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Briefcase className='h-5 w-5' />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Profession
                    </label>
                    <p className='text-lg'>
                      {demographicsData.profession || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Previous Coaching
                    </label>
                    <p className='text-lg'>
                      {demographicsData.previous_coaching || 'Not provided'}
                    </p>
                  </div>
                </div>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Education
                  </label>
                  <p className='flex items-center gap-2 text-lg'>
                    <GraduationCap className='h-4 w-4' />
                    {demographicsData.education || 'Not provided'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Assessment Information */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Heart className='h-5 w-5' />
                  Assessment Information
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Stress Level
                  </label>
                  <div className='mt-1 flex items-center gap-2'>
                    <span className='text-base font-medium'>
                      {demographicsData.stress_level}/10
                    </span>
                  </div>
                </div>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Motivation
                  </label>
                  <p className='mt-1 text-lg'>
                    {demographicsData.motivation || 'Not provided'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Timestamps */}
            {/* <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Calendar className='h-5 w-5' />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-2'>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Created
                  </label>
                  <p className='text-lg'>
                    {formatDate(demographicsData.created_at)}
                  </p>
                </div>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Last Updated
                  </label>
                  <p className='text-lg'>
                    {formatDate(demographicsData.updated_at)}
                  </p>
                </div>
              </CardContent>
            </Card> */}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default DemographicsDetailsDialog

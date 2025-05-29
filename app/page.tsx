"use client"
import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { isLoaded, user } = useUser()
  const router = useRouter()
  
  useEffect(() => {
    if (isLoaded) {
      if (user) {
        // If user is signed in, redirect to dashboard
        router.push('/dashboard')
      } else {
        // If user is not signed in, redirect to sign-in
        router.push('/sign-in')
      }
    }
  }, [isLoaded, user, router])

  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00B24B]"></div>
    </div>
  )
}
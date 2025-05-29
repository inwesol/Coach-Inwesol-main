"use client"
import { SignOutButton, useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const { isLoaded, user } = useUser()
  const [showPlaceholder, setShowPlaceholder] = useState(true)
  const router = useRouter()
  
  useEffect(() => {
    if (isLoaded) {
      setShowPlaceholder(false)
      // If user is not signed in, redirect to sign-in
      if (!user) {
        router.push('/sign-in')
      }
    }
  }, [isLoaded, user, router])

  const handleSignOut = () => {
    // This will be called after successful sign out
    router.push('/sign-in')
  }
  
  return (
    <section className='py-24'>
      <div className='container'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-3xl font-bold'>Hi Admin</h1>
          
          {showPlaceholder && (
            <div className="animate-pulse">
              <div className="h-10 w-20 bg-gray-200 rounded"></div>
            </div>
          )}
          
          <div className={showPlaceholder ? 'opacity-0 absolute' : 'opacity-100'}>
            <SignOutButton redirectUrl="/sign-in">
              <button 
                className='px-4 py-2 bg-[#00B24B] text-white rounded-md hover:bg-[#009140] transition-all duration-200 shadow-md hover:shadow-lg'
                onClick={handleSignOut}
              >
                Logout
              </button>
            </SignOutButton>
          </div>
        </div>
        
        {/* Admin content */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Admin Dashboard</h2>
            <p className="text-gray-600">Welcome to your admin panel. You have successfully logged in.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
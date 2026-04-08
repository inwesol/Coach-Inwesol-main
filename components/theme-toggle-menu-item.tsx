'use client'

import { useEffect, useState } from 'react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Moon, Sun } from 'lucide-react'

const STORAGE_KEY = 'theme'

function getPreferredTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const storedTheme = window.localStorage.getItem(STORAGE_KEY)
  if (storedTheme === 'dark' || storedTheme === 'light') {
    return storedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function ThemeToggleMenuItem() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    setTheme(getPreferredTheme())
  }, [])

  const toggleTheme = () => {
    const root = document.documentElement
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)

    root.classList.toggle('dark', nextTheme === 'dark')
    window.localStorage.setItem(STORAGE_KEY, nextTheme)
  }

  return (
    <DropdownMenuItem onClick={toggleTheme} className='cursor-pointer'>
      {theme === 'dark' ? (
        <Sun className='mr-2 h-4 w-4' />
      ) : (
        <Moon className='mr-2 h-4 w-4' />
      )}
      <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
    </DropdownMenuItem>
  )
}

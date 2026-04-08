import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ConditionalLayout } from '@/components/conditional-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Coach Portal | Inwesol',
  description: 'Coach Portal| Inwesol'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const themeInitScript = `
    (function () {
      try {
        var storedTheme = localStorage.getItem('theme');
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var isDark = storedTheme ? storedTheme === 'dark' : prefersDark;
        document.documentElement.classList.toggle('dark', isDark);
      } catch (error) {}
    })();
  `

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang='en' suppressHydrationWarning>
        <head>
          <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        </head>
        <body className={inter.className}>
          <ConditionalLayout>{children}</ConditionalLayout>
        </body>
      </html>
    </ClerkProvider>
  )
}

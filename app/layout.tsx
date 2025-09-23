import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import { cn } from '@/lib/utils'
import './globals.css'

import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Calendar App - Manage Your Schedule',
  description: 'A modern calendar application to manage your events and schedule with Google Calendar integration.',
}

const fontHeading = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
})

const fontBody = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
})

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body 
        className={cn(
          'antialiased',
          fontHeading.variable,
          fontBody.variable
        )}
      >
        {children}
      </body>
    </html>
  )
}
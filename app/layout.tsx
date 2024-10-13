import { Manrope } from 'next/font/google'
import { cn } from '@/lib/utils'
import './globals.css'

import { ReactNode } from 'react';

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
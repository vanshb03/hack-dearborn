'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  console.log('Attempting login for email:', email)

  const { error, data: authData } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    console.error('Login error:', error.message)
    redirect('/error')
  }

  console.log('Login successful for user:', authData.user?.id)

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function initiateGoogleLogin() {
  const supabase = createClient()

  console.log('Initiating Google login')

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    console.error('Google login error:', error.message)
    return redirect('/error')
  }

  if (data.url) {
    console.log('Redirecting to Google OAuth URL:', data.url)
    return redirect(data.url)
  }

  console.error('No URL returned from signInWithOAuth')
  return redirect('/error')
}
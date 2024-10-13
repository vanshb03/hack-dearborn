"use client";

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Error signing out:', error.message)
    } else {
      router.push('/login') // Redirect to login page after successful sign-out
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-screen">
      <div className="flex flex-col justify-center">
        <div className="text-center mx-auto md:max-w-2xl">
          <h1 className="header">You are home</h1>
          <button
            onClick={handleSignOut}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
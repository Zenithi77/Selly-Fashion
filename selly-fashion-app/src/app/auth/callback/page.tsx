'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/lib/store'

export default function AuthCallbackPage() {
  const router = useRouter()
  const { setUser } = useAuthStore()

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        // Get or create user profile
        let { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (!profile) {
          const { data: newProfile } = await supabase
            .from('user_profiles')
            .insert({
              id: session.user.id,
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
              avatar_url: session.user.user_metadata?.avatar_url
            })
            .select()
            .single()
          profile = newProfile
        }

        setUser(profile)
        router.push('/')
      } else {
        router.push('/login')
      }
    }

    handleCallback()
  }, [router, setUser])

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400">Нэвтэрч байна...</p>
      </div>
    </main>
  )
}

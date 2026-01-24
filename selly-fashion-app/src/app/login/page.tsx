'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/lib/store'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()
  const { setUser } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (error) throw error

        // Get user profile or create basic one
        let { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()

        // If no profile exists, create one
        if (!profile) {
          const { data: newProfile } = await supabase
            .from('user_profiles')
            .insert({
              id: data.user.id,
              email: data.user.email,
              full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || ''
            })
            .select()
            .single()
          profile = newProfile
        }

        // Set user even if profile fetch failed - use basic info
        setUser(profile || {
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata?.full_name || '',
          is_admin: false,
          is_vip: false
        })
        router.push('/')
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        })

        if (error) throw error

        // Create user profile
        if (data.user) {
          await supabase.from('user_profiles').insert({
            id: data.user.id,
            full_name: fullName
          })
        }

        setSuccess('Бүртгэл амжилттай! Имэйлээ шалгана уу.')
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Алдаа гарлаа'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Google нэвтрэлтэнд алдаа гарлаа'
      setError(errorMessage)
    }
  }

  return (
    <main className="min-h-screen pt-[104px] flex items-center justify-center px-4 py-12">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-white to-rose-100"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold tracking-wider text-slate-900">
              SELLY <span className="text-pink-500">FASHION</span>
            </h1>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-pink-500/10 p-8 border border-pink-100">
          {/* Tabs */}
          <div className="flex mb-8 bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                isLogin 
                  ? 'bg-white text-pink-500 shadow-md' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Нэвтрэх
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                !isLogin 
                  ? 'bg-white text-pink-500 shadow-md' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Бүртгүүлэх
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Нэр
                </label>
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                    placeholder="Таны нэр"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Имэйл
              </label>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Нууц үг
              </label>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-sm text-pink-500 hover:text-pink-600 font-medium">
                  Нууц үгээ мартсан?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg shadow-pink-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Түр хүлээнэ үү...
                </span>
              ) : (
                isLogin ? 'Нэвтрэх' : 'Бүртгүүлэх'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="px-4 text-sm text-slate-500">эсвэл</span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          {/* Social Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full py-3.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google-ээр нэвтрэх
          </button>
        </div>

        {/* Footer */}
        <p className="text-center mt-8 text-sm text-slate-600">
          {isLogin ? "Бүртгэлгүй юу? " : "Бүртгэлтэй юу? "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-pink-500 font-semibold hover:text-pink-600"
          >
            {isLogin ? 'Бүртгүүлэх' : 'Нэвтрэх'}
          </button>
        </p>
      </div>
    </main>
  )
}

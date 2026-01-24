'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { api, UserProfile } from '@/lib/supabase'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    const { data } = await api.getUsers()
    if (data) setUsers(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone?.includes(searchQuery)
  )

  if (loading) {
    return (
      <main className="min-h-screen pt-[104px] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-[104px] bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin"
              className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Хэрэглэгчид</h1>
              <p className="text-sm text-slate-500">{users.length} хэрэглэгч</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              placeholder="Хайх..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none w-64"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Хэрэглэгч</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Утас</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Хаяг</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Статус</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Бүртгүүлсэн</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                          ) : (
                            user.full_name?.charAt(0).toUpperCase() || '?'
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{user.full_name || 'Нэргүй'}</p>
                          <p className="text-sm text-slate-500">{user.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {user.phone || '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-600 max-w-[200px] truncate">
                      {user.address || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {user.is_admin && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">Админ</span>
                        )}
                        {user.is_vip && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-600 text-xs rounded-full">VIP</span>
                        )}
                        {!user.is_admin && !user.is_vip && (
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">Хэрэглэгч</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {new Date(user.created_at).toLocaleDateString('mn-MN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-slate-500">Хэрэглэгч олдсонгүй</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

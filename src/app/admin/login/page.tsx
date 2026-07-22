'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Store, Mail, Lock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', { email, password, redirect: false })
    if (result?.error) { setError('بيانات الدخول غير صحيحة'); setLoading(false) }
    else { router.push('/admin'); router.refresh() }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left - Brand Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-purple-700 to-rose-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-rose-300 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8">
            <Store size={32} />
          </div>
          <h1 className="text-4xl font-bold mb-4">متجر التجميل</h1>
          <p className="text-lg text-white/80 leading-relaxed">
            لوحة تحكم متجرك لإدارة المنتجات والطلبات والإعدادات بكل سهولة
          </p>
          <div className="mt-12 flex gap-4">
            <div className="w-2 h-2 bg-white/60 rounded-full" />
            <div className="w-2 h-2 bg-white/30 rounded-full" />
            <div className="w-2 h-2 bg-white/30 rounded-full" />
          </div>
        </div>
      </div>

      {/* Right - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 bg-gray-50">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-600 mb-8 transition-colors">
            <ArrowLeft size={18} /> العودة للمتجر
          </Link>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">تسجيل الدخول</h2>
              <p className="text-gray-500 mt-1">أدخل بياناتك للوصول إلى لوحة التحكم</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input-field pr-12" placeholder="admin@alipro.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور</label>
                <div className="relative">
                  <Lock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="input-field pr-12" placeholder="••••••••" />
                </div>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm text-center">
                  {error}
                </motion.div>
              )}

              <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-rose-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.01] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    جاري الدخول...
                  </span>
                ) : 'دخول'}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-400 mt-6">
            admin@alipro.com / Admin@123456
          </p>
        </motion.div>
      </div>
    </div>
  )
}

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminShell } from '@/components/admin/AdminShell'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session || (session.user as any)?.role !== 'admin') redirect('/admin/login')

  return (
    <AdminShell userName={session.user?.name || 'مدير النظام'} userEmail={session.user?.email || ''}>
      {children}
    </AdminShell>
  )
}
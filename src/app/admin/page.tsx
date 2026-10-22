import AdminOverview from '@/components/admin/AdminOverview'
import AdminLists from '@/components/admin/AdminLists'
import AdminActions from '@/components/admin/AdminActions'
import AdminActivity from '@/components/admin/AdminActivity'
import AdminCatalog from '@/components/admin/AdminCatalog'

export default function AdminPage() {
  return (
    <div className="space-y-14">
      <AdminOverview />
      <AdminActions />
      <AdminLists />
      <AdminActivity />
      <AdminCatalog />
    </div>
  )
}

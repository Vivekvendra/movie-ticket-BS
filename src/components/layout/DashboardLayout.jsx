import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#08090e] flex text-[#f1f1f1]">
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen overflow-y-auto bg-[#08090e]">
        <Outlet />
      </main>
    </div>
  )
}

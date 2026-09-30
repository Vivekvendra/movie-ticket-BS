import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Film,
  Building2,
  Armchair,
  Ticket,
  CreditCard,
  History,
  BarChart3,
  Menu,
  X,
  LogOut,
  Clapperboard,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'

const NAV_GROUPS = [
  {
    title: 'OVERVIEW',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    title: 'MANAGEMENT',
    items: [
      { to: '/movies',   icon: Film,      label: 'Movie' },
      { to: '/theatres', icon: Building2, label: 'Theatres' },
      { to: '/seats',    icon: Armchair,  label: 'Seat Layout' },
      { to: '/booking',  icon: Ticket,    label: 'Reservations' },
    ],
  },
  {
    title: 'FINANCE & REPORTS',
    items: [
      { to: '/payment', icon: CreditCard, label: 'Payments' },
      { to: '/history', icon: History,    label: 'History' },
      { to: '/reports', icon: BarChart3,  label: 'Analytics' },
    ],
  },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const closeMenu = () => setMobileOpen(false)

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0d0f17] border-r border-[#1a1d2e] select-none">

      {/* Brand Header */}
      <div className="px-6 py-5 border-b border-[#1a1d2e] bg-[#090a10]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e50914] to-[#b80610] flex items-center justify-center shadow-lg shadow-red-600/25 ring-1 ring-white/10 flex-shrink-0">
            <Clapperboard size={20} className="text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-white font-extrabold text-[15px] tracking-[0.2em] leading-none uppercase">
                FILMAX
              </h1>
              <span className="w-1.5 h-1.5 rounded-full bg-[#e50914] animate-pulse" />
            </div>
            <p className="text-gray-400 text-[11px] font-medium mt-1 truncate">
              Cinema Admin Suite
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3.5 py-5 space-y-6 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.14em] px-3 mb-2.5">
              {group.title}
            </p>
            <div className="space-y-1.5">
              {group.items.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-[14px] font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-red-600/20 via-red-600/10 to-transparent text-white border border-red-500/30 shadow-sm shadow-red-950/40'
                        : 'text-gray-400 hover:text-white hover:bg-[#151826] border border-transparent'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active Left Indicator Bar */}
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#e50914] shadow-[0_0_8px_#e50914]" />
                      )}

                      <Icon
                        size={19}
                        className={`flex-shrink-0 transition-colors duration-200 ${
                          isActive
                            ? 'text-[#e50914]'
                            : 'text-gray-400 group-hover:text-gray-200'
                        }`}
                      />
                      <span className="flex-1 tracking-wide">{label}</span>

                      {isActive && (
                        <ChevronRight size={14} className="text-[#e50914] opacity-80" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile Card & Logout */}
      <div className="p-3.5 border-t border-[#1a1d2e] bg-[#090a10]">
        <div className="p-3 rounded-xl bg-[#131622] border border-[#202538] flex items-center gap-3 mb-2.5">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e50914] to-[#80050c] flex items-center justify-center text-white font-bold text-sm shadow-md">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#131622]" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-white text-sm font-semibold truncate leading-tight">
                {user?.name || 'Administrator'}
              </p>
            </div>
            <p className="text-gray-400 text-[11px] truncate mt-0.5">
              {user?.email || 'admin@stackly.edu'}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#23273a] hover:border-red-500/40 bg-[#131622]/60 hover:bg-red-950/20 text-gray-400 hover:text-red-400 text-xs font-medium transition-all cursor-pointer"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-11 h-11 flex items-center justify-center rounded-xl bg-[#141624] border border-[#262a3e] text-white shadow-xl cursor-pointer"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={closeMenu} />
      )}

      <div
        className={`lg:hidden fixed top-0 left-0 z-50 h-full w-64 transition-transform duration-300 ease-out shadow-2xl ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={closeMenu}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white cursor-pointer"
        >
          <X size={18} />
        </button>
        <SidebarContent />
      </div>

      <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bottom-0 z-30 select-none">
        <SidebarContent />
      </aside>
    </>
  )
}

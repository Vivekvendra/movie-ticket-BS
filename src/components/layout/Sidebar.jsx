import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Film, Building2, Armchair,
  Ticket, CreditCard, History, BarChart3,
  Menu, X, LogOut, ChevronRight, Clapperboard,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'

const NAV = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard'       },
  { to: '/movies',     icon: Film,             label: 'Movies'          },
  { to: '/theatres',   icon: Building2,        label: 'Theatres'        },
  { to: '/seats',      icon: Armchair,         label: 'Seat Selection'  },
  { to: '/booking',    icon: Ticket,           label: 'Booking'         },
  { to: '/payment',    icon: CreditCard,       label: 'Payment'         },
  { to: '/history',    icon: History,          label: 'Booking History' },
  { to: '/reports',    icon: BarChart3,        label: 'Reports'         },
]

function NavItem({ to, icon: Icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
          isActive
            ? 'bg-[#e50914] text-white shadow-lg shadow-red-900/30'
            : 'text-gray-400 hover:bg-[#1e1e1e] hover:text-white'
        }`
      }
    >
      <Icon size={17} className="flex-shrink-0" />
      <span className="flex-1 truncate">{label}</span>
      <ChevronRight
        size={13}
        className="opacity-0 group-hover:opacity-60 -translate-x-1 group-hover:translate-x-0 transition-all"
      />
    </NavLink>
  )
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully!')
    navigate('/login')
  }

  const close = () => setOpen(false)

  const Inner = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[#1e1e1e] flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-[#e50914] flex items-center justify-center flex-shrink-0">
          <Clapperboard size={16} className="text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-white font-bold text-base tracking-[0.2em] uppercase leading-none font-sans">
            FILMAX
          </p>
          <p className="text-gray-500 text-[10px] mt-0.5 truncate">Movie Ticketing System</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-gray-600 text-[10px] font-semibold uppercase tracking-wider px-3 mb-2">
          Main Menu
        </p>
        {NAV.map((item) => (
          <NavItem key={item.to} {...item} onClick={close} />
        ))}
      </nav>

      {/* User card + logout */}
      <div className="px-3 py-3 border-t border-[#1e1e1e] flex-shrink-0">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#171717] mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e50914] to-[#ff6b35] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
            <p className="text-gray-500 text-[10px] truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-500 hover:bg-red-900/20 hover:text-red-400 transition-colors"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 flex items-center justify-center rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-white"
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          onClick={close}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed top-0 left-0 z-50 h-full w-60 bg-[#111] border-r border-[#1e1e1e] transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={close}
          className="absolute top-4 right-4 text-gray-500 hover:text-white"
        >
          <X size={18} />
        </button>
        <Inner />
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 h-screen bg-[#111] border-r border-[#1e1e1e] sticky top-0 overflow-hidden">
        <Inner />
      </aside>
    </>
  )
}

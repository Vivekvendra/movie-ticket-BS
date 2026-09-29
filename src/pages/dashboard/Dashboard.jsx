import { useState } from 'react'
import {
  Film,
  Building2,
  Ticket,
  MonitorPlay,
  CalendarCheck,
  TrendingUp,
  DollarSign,
  MapPin,
  Plus,
  Search,
  RefreshCw,
  BarChart3,
  Bell,
  ArrowUpRight,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

/* ── Cohesive KPI Stats (No harsh violet colors) ────────────────────────── */
const STATS = [
  {
    label: 'Total Movies',
    value: '1,284',
    icon: Film,
    change: '+24 this month',
    color: 'text-[#e50914]',
    bg: 'bg-red-500/10 border-red-500/20',
  },
  {
    label: 'Total Theatres',
    value: '148',
    icon: Building2,
    change: '+3 new added',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
  },
  {
    label: 'Total Bookings',
    value: '52,340',
    icon: Ticket,
    change: '+1,240 this week',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  {
    label: 'Active Shows',
    value: '386',
    icon: MonitorPlay,
    change: '94% active',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
  {
    label: "Today's Bookings",
    value: '924',
    icon: CalendarCheck,
    change: '+18% vs yesterday',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20',
  },
  {
    label: 'Monthly Revenue',
    value: '₹18.45 L',
    icon: DollarSign,
    change: '+22.4% MoM',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
]

/* ── Revenue Chart Data ─────────────────────────────────────────────────── */
const REVENUE_DATA = [
  { month: 'Apr', heightPct: 58, amount: '₹11.2L' },
  { month: 'May', heightPct: 72, amount: '₹13.8L' },
  { month: 'Jun', heightPct: 80, amount: '₹15.2L' },
  { month: 'Jul', heightPct: 75, amount: '₹14.3L' },
  { month: 'Aug', heightPct: 88, amount: '₹16.9L' },
  { month: 'Sep', heightPct: 100, amount: '₹18.4L' },
]

/* ── Top Movies (Cohesive palette without violet) ────────────────────────── */
const TOP_MOVIES = [
  { title: 'Top Gun: Maverick',    bookings: 12480, pct: 100, color: 'bg-[#e50914]' },
  { title: 'Deadpool & Wolverine', bookings: 9840,  pct: 79,  color: 'bg-rose-500' },
  { title: 'Dune: Part Two',       bookings: 8420,  pct: 67,  color: 'bg-cyan-500' },
  { title: 'Inside Out 2',         bookings: 6890,  pct: 55,  color: 'bg-emerald-500' },
]

/* ── Recent Bookings ─────────────────────────────────────────────────────── */
const RECENT_BOOKINGS = [
  { id: 'FLX-9941', user: 'Rahul Sharma',  movie: 'Top Gun: Maverick',    theatre: 'PVR Phoenix, Mumbai',     seats: 3, amount: '₹1,290', status: 'Confirmed',  sc: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' },
  { id: 'FLX-9940', user: 'Priya Mehta',   movie: 'Dune: Part Two',       theatre: 'AMB Cinemas, Hyderabad',  seats: 2, amount: '₹980',   status: 'Checked In', sc: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' },
  { id: 'FLX-9939', user: 'Aarav Singh',   movie: 'Deadpool & Wolverine', theatre: 'Cinepolis VR, Bengaluru', seats: 4, amount: '₹1,840', status: 'Confirmed',  sc: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' },
  { id: 'FLX-9938', user: 'Sneha Reddy',   movie: 'Inside Out 2',         theatre: 'Prasads Multiplex, Hyd',  seats: 3, amount: '₹890',   status: 'Pending',    sc: 'bg-amber-500/15 text-amber-400 border border-amber-500/30' },
  { id: 'FLX-9937', user: 'Kiran Kumar',   movie: 'Top Gun: Maverick',    theatre: 'INOX GVK, Hyderabad',     seats: 2, amount: '₹760',   status: 'Confirmed',  sc: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' },
]

/* ── Quick Actions (Refined cohesive cards, no bright candy violet) ─────── */
const QUICK_ACTIONS = [
  { label: 'Movies',    icon: Film,      path: '/movies',   accent: 'group-hover:text-[#e50914]', iconBg: 'bg-red-500/10 text-[#e50914]' },
  { label: 'Theatres',  icon: Building2, path: '/theatres', accent: 'group-hover:text-cyan-400',  iconBg: 'bg-cyan-500/10 text-cyan-400' },
  { label: 'Bookings',  icon: Ticket,    path: '/booking',  accent: 'group-hover:text-emerald-400', iconBg: 'bg-emerald-500/10 text-emerald-400' },
  { label: 'Analytics', icon: BarChart3, path: '/reports',  accent: 'group-hover:text-amber-400', iconBg: 'bg-amber-500/10 text-amber-400' },
]

const card = 'bg-[#121420] border border-[#1e2233] rounded-2xl shadow-xl'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeRange, setActiveRange] = useState('6M')

  const todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="min-h-screen p-6 lg:p-8 space-y-6 bg-[#0c0d14] text-white">

      {/* ── HEADER ── */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-5 p-6 ${card}`}>
        <div>
          <p className="text-sm text-gray-400 mb-1">{todayStr}</p>
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
            Good morning, {user?.name ? user.name.split(' ')[0] : 'Admin'} 👋
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#171926] border border-[#262a3e] w-64 focus-within:border-[#e50914] transition-all">
            <Search size={17} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-gray-500"
            />
          </div>

          <button
            onClick={() => toast.success('Refreshed!')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#171926] border border-[#262a3e] hover:bg-[#1f2233] text-gray-300 hover:text-white text-sm transition-all cursor-pointer"
          >
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => toast.info('No new notifications')}
            className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-[#171926] border border-[#262a3e] hover:bg-[#1f2233] text-gray-300 hover:text-white cursor-pointer transition-all"
          >
            <Bell size={17} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#e50914]" />
          </button>

          <button
            onClick={() => navigate('/movies')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#e50914] hover:bg-[#ff1a26] text-white text-sm font-semibold transition-all cursor-pointer shadow-lg shadow-red-600/25 active:scale-95"
          >
            <Plus size={16} />
            <span>Add Movie</span>
          </button>
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {STATS.map(({ label, value, icon: Icon, change, color, bg }) => (
          <div
            key={label}
            className={`p-5 flex flex-col justify-between gap-3.5 cursor-pointer hover:-translate-y-1 hover:border-[#2a3048] transition-all duration-200 ${card}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400 font-normal">{label}</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${bg}`}>
                <Icon size={18} className={color} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
              <p className={`text-xs mt-1.5 flex items-center gap-1 font-medium ${color}`}>
                <TrendingUp size={13} />
                {change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── MAIN GRID: Left 2/3 + Right 1/3 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">

          {/* Revenue Chart with Visible, Sleek Bars */}
          <div className={`p-6 ${card}`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white tracking-tight">Revenue Overview</h2>
                <p className="text-xs text-gray-400 mt-0.5">Monthly box office performance</p>
              </div>

              <div className="flex gap-1 p-1 rounded-xl bg-[#171926] border border-[#262a3e]">
                {['3M', '6M', '1Y'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setActiveRange(r)}
                    className={`px-3.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      activeRange === r
                        ? 'bg-[#e50914] text-white shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Clearly Visible Modern Bar Chart */}
            <div className="flex items-end gap-4 h-44 pt-6 px-2">
              {REVENUE_DATA.map((d, i) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  {/* Hover amount tooltip */}
                  <span className="text-[11px] font-semibold text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    {d.amount}
                  </span>

                  <div className="w-full relative flex items-end justify-center">
                    <div
                      className="w-full rounded-t-lg transition-all duration-300 group-hover:brightness-125"
                      style={{
                        height: `${Math.max(d.heightPct * 1.4, 20)}px`,
                        background:
                          i === REVENUE_DATA.length - 1
                            ? 'linear-gradient(180deg, #ff3b47 0%, #e50914 100%)'
                            : 'linear-gradient(180deg, #3a4260 0%, #22273a 100%)',
                        boxShadow:
                          i === REVENUE_DATA.length - 1
                            ? '0 0 15px rgba(229, 9, 20, 0.4)'
                            : 'none',
                      }}
                    />
                  </div>

                  <span className={`text-xs font-medium transition-colors ${
                    i === REVENUE_DATA.length - 1 ? 'text-white font-bold' : 'text-gray-400 group-hover:text-gray-200'
                  }`}>
                    {d.month}
                  </span>
                </div>
              ))}
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-[#1e2233]">
              {[
                { label: 'Total Revenue', val: '₹93,50,000', sub: '+22.4%', color: 'text-emerald-400' },
                { label: 'Tickets Sold',  val: '30,350',     sub: '96.2%',  color: 'text-cyan-400' },
                { label: 'Avg. Price',    val: '₹308',       sub: 'Standard', color: 'text-amber-400' },
              ].map((s) => (
                <div key={s.label} className="p-3.5 rounded-xl bg-[#171926] border border-[#202436]">
                  <p className="text-xs text-gray-400">{s.label}</p>
                  <p className="text-lg font-semibold text-white mt-1">{s.val}</p>
                  <p className={`text-xs mt-0.5 font-medium ${s.color}`}>{s.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Bookings Table */}
          <div className={`p-6 ${card}`}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-white tracking-tight">Recent Bookings</h2>
                <p className="text-xs text-gray-400 mt-0.5">Live transactions across venues</p>
              </div>
              <button
                onClick={() => toast.info('Opening booking history…')}
                className="text-sm text-[#e50914] hover:underline cursor-pointer font-medium"
              >
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#1e2233]">
                    {['ID', 'Customer', 'Movie', 'Theatre', 'Seats', 'Amount', 'Status'].map((h) => (
                      <th key={h} className="text-xs font-semibold text-gray-400 pb-3 pr-4 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RECENT_BOOKINGS.map((b, i) => (
                    <tr
                      key={b.id}
                      className="hover:bg-[#171926] transition-colors"
                      style={{ borderBottom: i < RECENT_BOOKINGS.length - 1 ? '1px solid #1a1d2e' : 'none' }}
                    >
                      <td className="py-3.5 pr-4">
                        <span className="text-xs font-mono font-medium text-[#e50914]">{b.id}</span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="text-sm font-medium text-white">{b.user}</span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="text-sm text-gray-300 whitespace-nowrap">{b.movie}</span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="text-xs text-gray-400 flex items-center gap-1.5 whitespace-nowrap">
                          <MapPin size={12} className="text-gray-500" />
                          {b.theatre}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="text-sm text-gray-300">{b.seats}</span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="text-sm font-semibold text-white">{b.amount}</span>
                      </td>
                      <td className="py-3.5">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${b.sc}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">

          {/* Seat Occupancy */}
          <div className={`p-6 ${card}`}>
            <h2 className="text-lg font-semibold text-white mb-5 tracking-tight">Seat Occupancy</h2>
            <div className="flex justify-center mb-5">
              <div className="relative">
                <svg width="130" height="130" viewBox="0 0 130 130" className="-rotate-90">
                  <circle cx="65" cy="65" r="50" fill="transparent" stroke="#1e2233" strokeWidth="11" />
                  <circle
                    cx="65" cy="65" r="50" fill="transparent"
                    stroke="#e50914" strokeWidth="11"
                    strokeDasharray="314" strokeDashoffset="69"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_8px_rgba(229,9,20,0.5)]"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-white">78%</span>
                  <span className="text-xs text-gray-400">Booked</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#1e2233]">
              {[
                { label: 'Occupied',  val: '4,820', color: 'bg-[#e50914]' },
                { label: 'Available', val: '1,360', color: 'bg-[#22273a]' },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2.5">
                  <span className={`w-3.5 h-3.5 rounded flex-shrink-0 ${s.color}`} />
                  <div>
                    <p className="text-xs text-gray-400">{s.label}</p>
                    <p className="text-sm font-semibold text-white">{s.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions (Refined, elegant, cohesive dark cards) */}
          <div className={`p-6 ${card}`}>
            <h2 className="text-lg font-semibold text-white mb-4 tracking-tight">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {QUICK_ACTIONS.map(({ label, icon: Icon, path, accent, iconBg }) => (
                <button
                  key={label}
                  onClick={() => navigate(path)}
                  className={`group flex flex-col items-center gap-2.5 p-4 rounded-xl bg-[#171926] hover:bg-[#1f2234] border border-[#24283d] hover:border-[#383f5e] transition-all duration-200 cursor-pointer text-gray-300 hover:text-white shadow-sm active:scale-95`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg} transition-all duration-200`}>
                    <Icon size={20} />
                  </div>
                  <span className={`text-sm font-medium ${accent} transition-colors`}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Top Movies (Clean bar indicators, no violet) */}
          <div className={`p-6 ${card}`}>
            <h2 className="text-lg font-semibold text-white mb-4 tracking-tight">Top Movies</h2>
            <div className="space-y-4">
              {TOP_MOVIES.map((m) => (
                <div key={m.title}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-gray-300 truncate pr-2">{m.title}</span>
                    <span className="text-sm font-semibold text-white flex-shrink-0">
                      {m.bookings.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#1b1e2e]">
                    <div className={`h-2 rounded-full ${m.color}`} style={{ width: `${m.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

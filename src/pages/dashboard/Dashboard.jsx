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
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

/* ── KPI Stats (World-Class Visual Palette - No Harsh Violet) ──────────── */
const STATS = [
  {
    label: 'Total Movies',
    value: '1,284',
    icon: Film,
    change: '+24 this month',
    accentColor: '#e50914',
    bg: 'bg-red-500/10 text-[#e50914] border-red-500/20',
    topGlow: 'from-[#e50914]/40 to-transparent',
  },
  {
    label: 'Total Theatres',
    value: '148',
    icon: Building2,
    change: '+3 new added',
    accentColor: '#38bdf8',
    bg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    topGlow: 'from-sky-500/30 to-transparent',
  },
  {
    label: 'Total Bookings',
    value: '52,340',
    icon: Ticket,
    change: '+1,240 this week',
    accentColor: '#34d399',
    bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    topGlow: 'from-emerald-500/30 to-transparent',
  },
  {
    label: 'Active Shows',
    value: '386',
    icon: MonitorPlay,
    change: '94% occupancy rate',
    accentColor: '#fbbf24',
    bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    topGlow: 'from-amber-500/30 to-transparent',
  },
  {
    label: "Today's Admissions",
    value: '924',
    icon: CalendarCheck,
    change: '+18% vs yesterday',
    accentColor: '#f43f5e',
    bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    topGlow: 'from-rose-500/30 to-transparent',
  },
  {
    label: 'Monthly Box Office',
    value: '₹18.45 L',
    icon: DollarSign,
    change: '+22.4% MoM',
    accentColor: '#34d399',
    bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    topGlow: 'from-emerald-500/40 to-transparent',
  },
]

/* ── Revenue Chart Data ─────────────────────────────────────────────────── */
const REVENUE_DATA = [
  { month: 'Apr', heightPct: 58, amount: '₹11.2L', count: '18,400 tickets' },
  { month: 'May', heightPct: 72, amount: '₹13.8L', count: '22,100 tickets' },
  { month: 'Jun', heightPct: 80, amount: '₹15.2L', count: '24,600 tickets' },
  { month: 'Jul', heightPct: 75, amount: '₹14.3L', count: '23,100 tickets' },
  { month: 'Aug', heightPct: 88, amount: '₹16.9L', count: '27,800 tickets' },
  { month: 'Sep', heightPct: 100, amount: '₹18.4L', count: '30,350 tickets' },
]

/* ── Top Performing Movies (Refined Palette) ───────────────────────────── */
const TOP_MOVIES = [
  { title: 'Top Gun: Maverick',    bookings: 12480, pct: 100, color: 'bg-gradient-to-r from-red-600 to-[#e50914]' },
  { title: 'Deadpool & Wolverine', bookings: 9840,  pct: 79,  color: 'bg-gradient-to-r from-rose-500 to-red-500' },
  { title: 'Dune: Part Two',       bookings: 8420,  pct: 67,  color: 'bg-gradient-to-r from-sky-500 to-cyan-400' },
  { title: 'Inside Out 2',         bookings: 6890,  pct: 55,  color: 'bg-gradient-to-r from-emerald-500 to-teal-400' },
]

/* ── Live Recent Bookings ───────────────────────────────────────────────── */
const RECENT_BOOKINGS = [
  { id: 'FLX-9941', user: 'Rahul Sharma',  initials: 'RS', movie: 'Top Gun: Maverick',    theatre: 'PVR Phoenix, Mumbai',     seats: ['A4', 'A5'], amount: '₹1,290', status: 'Confirmed',  badgeClass: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' },
  { id: 'FLX-9940', user: 'Priya Mehta',   initials: 'PM', movie: 'Dune: Part Two',       theatre: 'AMB Cinemas, Hyderabad',  seats: ['C3', 'C4'], amount: '₹980',   status: 'Checked In', badgeClass: 'bg-sky-500/15 text-sky-400 border border-sky-500/30' },
  { id: 'FLX-9939', user: 'Aarav Singh',   initials: 'AS', movie: 'Deadpool & Wolverine', theatre: 'Cinepolis VR, Bengaluru', seats: ['D6', 'D7'], amount: '₹1,840', status: 'Confirmed',  badgeClass: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' },
  { id: 'FLX-9938', user: 'Sneha Reddy',   initials: 'SR', movie: 'Inside Out 2',         theatre: 'Prasads Multiplex, Hyd',  seats: ['E2'],       amount: '₹890',   status: 'Pending',    badgeClass: 'bg-amber-500/15 text-amber-400 border border-amber-500/30' },
  { id: 'FLX-9937', user: 'Kiran Kumar',   initials: 'KK', movie: 'Top Gun: Maverick',    theatre: 'INOX GVK, Hyderabad',     seats: ['B1', 'B2'], amount: '₹760',   status: 'Confirmed',  badgeClass: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' },
]

/* ── Quick Action Tiles ─────────────────────────────────────────────────── */
const QUICK_ACTIONS = [
  { label: 'Movie Catalog', sub: 'Manage Titles', icon: Film,      path: '/movies',   accent: 'group-hover:text-[#e50914]', iconBg: 'bg-red-500/10 text-[#e50914] border-red-500/20' },
  { label: 'Theatres',      sub: 'Venues & Screens', icon: Building2, path: '/theatres', accent: 'group-hover:text-sky-400',  iconBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  { label: 'Seat Layout',   sub: 'Tier Matrix',   icon: Layers,    path: '/seats',    accent: 'group-hover:text-emerald-400', iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { label: 'Reservations',  sub: 'Live Bookings', icon: Ticket,    path: '/booking',  accent: 'group-hover:text-amber-400', iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeRange, setActiveRange] = useState('6M')
  const [hoveredBar, setHoveredBar] = useState(null)

  const todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="min-h-screen p-6 lg:p-8 flex flex-col gap-6 bg-[#08090e] text-white">

      {/* ── HERO HEADER CARD ──────────────────────────────────────────────── */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#121524] via-[#0f121d] to-[#141221] border border-[#1f243b] p-6 lg:p-7 shadow-2xl">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Box Office Engine
              </span>
              <span className="text-gray-500 text-xs">•</span>
              <span className="text-gray-400 text-xs font-medium">{todayStr}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Good morning, {user?.name ? user.name.split(' ')[0] : 'Admin'} 👋
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Real-time screenings, multiplex performance, and box office ticket metrics.
            </p>
          </div>

          {/* Quick Actions in Header */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search Input */}
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#161a29] border border-[#262c45] focus-within:border-[#e50914] w-64 transition-all shadow-inner">
              <Search size={16} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search movies, venues..."
                className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-gray-500"
              />
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => toast.success('Dashboard telemetry updated!')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#161a29] border border-[#262c45] hover:bg-[#1f243b] text-gray-300 hover:text-white text-sm font-medium transition-all cursor-pointer shadow-sm"
              title="Refresh telemetry"
            >
              <RefreshCw size={15} />
              <span>Refresh</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => toast.info('All 148 auditorium screening servers operational.')}
              className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-[#161a29] border border-[#262c45] hover:bg-[#1f243b] text-gray-300 hover:text-white cursor-pointer transition-all shadow-sm"
              aria-label="Notifications"
            >
              <Bell size={17} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#e50914] ring-2 ring-[#121524]" />
            </button>

            {/* Add Movie CTA */}
            <button
              onClick={() => navigate('/movies')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#e50914] to-[#ff2b38] hover:brightness-110 text-white text-sm font-bold transition-all cursor-pointer shadow-lg shadow-red-600/30 active:scale-95"
            >
              <Plus size={16} />
              <span>Add Movie</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 6 KPI STAT CARDS WITH TOP GLOWS ────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {STATS.map(({ label, value, icon: Icon, change, accentColor, bg, topGlow }) => (
          <div
            key={label}
            className="group relative overflow-hidden rounded-2xl bg-[#111422] border border-[#1e243b] hover:border-[#2f385c] p-5 flex flex-col justify-between gap-3.5 transition-all duration-300 hover:-translate-y-1 shadow-lg"
          >
            {/* Top Border Glow Accent */}
            <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${topGlow}`} />

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 font-medium tracking-wide">{label}</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${bg} shadow-sm transition-transform duration-200 group-hover:scale-105`}>
                <Icon size={17} />
              </div>
            </div>

            <div>
              <p className="text-2xl font-black text-white tracking-tight">{value}</p>
              <p className="text-[11px] mt-1.5 flex items-center gap-1 font-semibold text-emerald-400">
                <TrendingUp size={12} />
                {change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── MAIN ANALYTICS GRID: Left 2/3 + Right 1/3 ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── LEFT COLUMN: Revenue Chart & Recent Bookings ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Interactive Revenue Overview Chart */}
          <div className="rounded-3xl bg-[#111422] border border-[#1e243b] p-6 lg:p-7 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <BarChart3 size={19} className="text-[#e50914]" /> Monthly Box Office Revenue
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Aggregate gross box office earnings across all metro locations
                </p>
              </div>

              {/* Timeframe selector */}
              <div className="flex gap-1 p-1 rounded-xl bg-[#161a29] border border-[#252b45] self-start sm:self-auto">
                {['3M', '6M', '1Y'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setActiveRange(range)}
                    className={`px-3.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeRange === range
                        ? 'bg-[#e50914] text-white shadow-md'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Sleek Bar Chart Area */}
            <div className="relative pt-6 pb-2 px-4 rounded-2xl bg-[#0d0f19] border border-[#181d30]">
              <div className="flex items-end gap-4 h-48">
                {REVENUE_DATA.map((d, i) => {
                  const isCurrent = i === REVENUE_DATA.length - 1
                  const isHovered = hoveredBar === d.month

                  return (
                    <div
                      key={d.month}
                      onMouseEnter={() => setHoveredBar(d.month)}
                      onMouseLeave={() => setHoveredBar(null)}
                      className="flex-1 flex flex-col items-center gap-2 group cursor-pointer h-full justify-end"
                    >
                      {/* Amount Float Badge on Hover */}
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md transition-all duration-200 ${
                          isHovered || isCurrent
                            ? 'opacity-100 bg-[#161a29] text-white border border-[#2c3452] -translate-y-1'
                            : 'opacity-0 text-transparent'
                        }`}
                      >
                        {d.amount}
                      </span>

                      {/* Bar Pillar */}
                      <div className="w-full relative flex items-end justify-center">
                        <div
                          className={`w-full rounded-t-xl transition-all duration-300 ${
                            isCurrent
                              ? 'bg-gradient-to-t from-[#c70b15] via-[#e50914] to-[#ff414d] shadow-[0_0_20px_rgba(229,9,20,0.45)]'
                              : 'bg-gradient-to-t from-[#1b2034] via-[#242b45] to-[#343d61] hover:brightness-125'
                          }`}
                          style={{
                            height: `${Math.max(d.heightPct * 1.5, 24)}px`,
                          }}
                        />
                      </div>

                      {/* Month label */}
                      <span
                        className={`text-xs transition-colors duration-200 ${
                          isCurrent
                            ? 'text-[#e50914] font-black'
                            : 'text-gray-400 font-medium group-hover:text-gray-200'
                        }`}
                      >
                        {d.month}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Bottom Financial Metrics Pill Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              <div className="p-3.5 rounded-xl bg-[#151928] border border-[#232942]">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Gross Revenue</p>
                <p className="text-lg font-black text-white mt-1">₹93,50,000</p>
                <p className="text-xs font-bold text-emerald-400 mt-0.5">↑ +22.4% Quarter Target</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#151928] border border-[#232942]">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Tickets Issued</p>
                <p className="text-lg font-black text-white mt-1">30,350</p>
                <p className="text-xs font-bold text-sky-400 mt-0.5">96.2% Seat Fill Ratio</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#151928] border border-[#232942]">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Average Ticket</p>
                <p className="text-lg font-black text-white mt-1">₹308.00</p>
                <p className="text-xs font-bold text-amber-400 mt-0.5">Standard & Recliner Mix</p>
              </div>
            </div>
          </div>

          {/* Recent Customer Bookings Table */}
          <div className="rounded-3xl bg-[#111422] border border-[#1e243b] p-6 lg:p-7 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b2034]">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Ticket size={18} className="text-[#e50914]" /> Recent Ticket Transactions
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Real-time admission passes across multiplexes</p>
              </div>
              <button
                onClick={() => navigate('/history')}
                className="text-xs font-bold text-[#e50914] hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#181d30] text-gray-400 font-semibold">
                    <th className="pb-3 pr-4">Booking Ref</th>
                    <th className="pb-3 pr-4">Customer</th>
                    <th className="pb-3 pr-4">Movie Title</th>
                    <th className="pb-3 pr-4">Theatre Venue</th>
                    <th className="pb-3 pr-4">Seats</th>
                    <th className="pb-3 pr-4">Amount</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_BOOKINGS.map((b, i) => (
                    <tr
                      key={b.id}
                      className="border-b border-[#151928] hover:bg-[#161a2b] transition-colors"
                    >
                      <td className="py-3.5 pr-4">
                        <span className="font-mono font-bold text-[#e50914]">{b.id}</span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#1e243d] text-gray-200 text-[10px] font-bold flex items-center justify-center">
                            {b.initials}
                          </span>
                          <span className="font-semibold text-white">{b.user}</span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 font-medium text-gray-300 whitespace-nowrap">
                        {b.movie}
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="text-gray-400 flex items-center gap-1 whitespace-nowrap">
                          <MapPin size={11} className="text-gray-500" />
                          {b.theatre}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 font-bold">
                          {b.seats.join(', ')}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 font-bold text-white">
                        {b.amount}
                      </td>
                      <td className="py-3.5 text-right">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${b.badgeClass}`}>
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

        {/* ── RIGHT COLUMN: Seat Occupancy & Quick Actions & Top Movies ── */}
        <div className="space-y-6">

          {/* Seat Occupancy Visualization */}
          <div className="rounded-3xl bg-[#111422] border border-[#1e243b] p-6 shadow-xl space-y-5">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Layers size={17} className="text-[#e50914]" /> Auditorium Capacity
            </h2>

            {/* Circular Gauge */}
            <div className="flex justify-center my-3">
              <div className="relative">
                <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
                  <circle
                    cx="70" cy="70" r="54"
                    fill="transparent"
                    stroke="#191e32"
                    strokeWidth="12"
                  />
                  <circle
                    cx="70" cy="70" r="54"
                    fill="transparent"
                    stroke="#e50914"
                    strokeWidth="12"
                    strokeDasharray="339.29"
                    strokeDashoffset="74.6"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_12px_rgba(229,9,20,0.6)] transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-white tracking-tight">78%</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Occupied</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#1b2034]">
              <div className="p-3 rounded-xl bg-[#151928] border border-[#232942]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#e50914] shadow-[0_0_6px_#e50914]" />
                  <span className="text-[11px] text-gray-400">Reserved</span>
                </div>
                <p className="text-base font-bold text-white">4,820</p>
              </div>

              <div className="p-3 rounded-xl bg-[#151928] border border-[#232942]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2a3250]" />
                  <span className="text-[11px] text-gray-400">Available</span>
                </div>
                <p className="text-base font-bold text-white">1,360</p>
              </div>
            </div>
          </div>

          {/* Quick Action Tiles */}
          <div className="rounded-3xl bg-[#111422] border border-[#1e243b] p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white tracking-tight">Platform Modules</h2>

            <div className="grid grid-cols-2 gap-3">
              {QUICK_ACTIONS.map(({ label, sub, icon: Icon, path, accent, iconBg }) => (
                <button
                  key={label}
                  onClick={() => navigate(path)}
                  className="group flex flex-col items-start p-3.5 rounded-2xl bg-[#151928] hover:bg-[#1b2034] border border-[#232942] hover:border-[#38426b] transition-all duration-200 cursor-pointer text-left shadow-sm hover:-translate-y-0.5"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${iconBg} mb-2`}>
                    <Icon size={18} />
                  </div>
                  <span className={`text-xs font-bold text-white ${accent} transition-colors`}>
                    {label}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5">
                    {sub}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Top Rated Titles */}
          <div className="rounded-3xl bg-[#111422] border border-[#1e243b] p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white tracking-tight">Box Office Top Grossers</h2>

            <div className="space-y-4">
              {TOP_MOVIES.map((m) => (
                <div key={m.title}>
                  <div className="flex items-center justify-between mb-1.5 text-xs">
                    <span className="font-semibold text-gray-300 truncate pr-2">{m.title}</span>
                    <span className="font-bold text-white flex-shrink-0">
                      {m.bookings.toLocaleString()} admissions
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#181d30] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${m.color}`}
                      style={{ width: `${m.pct}%` }}
                    />
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

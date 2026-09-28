import {
  Film, Building2, Ticket, MonitorPlay,
  CalendarCheck, TrendingUp, TrendingDown,
  DollarSign, Star, Clock, MapPin,
  Plus, Search, Bell, RefreshCw,
  ChevronRight, MoreHorizontal, Play,
  Users, Zap, Eye, BarChart3,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

/* ── Static data ─────────────────────────────────────────────────────────── */

const STATS = [
  {
    label: 'Total Movies',
    value: '1,284',
    icon: Film,
    change: '+24 this month',
    up: true,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    glow: 'shadow-violet-900/20',
  },
  {
    label: 'Total Theatres',
    value: '148',
    icon: Building2,
    change: '+3 new',
    up: true,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    glow: 'shadow-cyan-900/20',
  },
  {
    label: 'Total Bookings',
    value: '52,340',
    icon: Ticket,
    change: '+1,240 this week',
    up: true,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    glow: 'shadow-emerald-900/20',
  },
  {
    label: 'Available Shows',
    value: '386',
    icon: MonitorPlay,
    change: '-12 sold out',
    up: false,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    glow: 'shadow-orange-900/20',
  },
  {
    label: "Today's Bookings",
    value: '924',
    icon: CalendarCheck,
    change: '+18% vs yesterday',
    up: true,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    glow: 'shadow-pink-900/20',
  },
  {
    label: 'Monthly Revenue',
    value: '$1,84,500',
    icon: DollarSign,
    change: '+22% vs last month',
    up: true,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    glow: 'shadow-yellow-900/20',
  },
]

const REVENUE_DATA = [
  { month: 'Apr', revenue: 110000, bookings: 3800 },
  { month: 'May', revenue: 138000, bookings: 4600 },
  { month: 'Jun', revenue: 152000, bookings: 5100 },
  { month: 'Jul', revenue: 143000, bookings: 4800 },
  { month: 'Aug', revenue: 168000, bookings: 5600 },
  { month: 'Sep', revenue: 184500, bookings: 6200 },
]

const UPCOMING_MOVIES = [
  {
    id: 1,
    title: 'Dune: Part Two',
    genre: 'Sci-Fi',
    rating: 8.5,
    release: 'Oct 5, 2026',
    poster: 'https://image.tmdb.org/t/p/w300/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
    language: 'English',
    bookings: 4820,
  },
  {
    id: 2,
    title: 'Deadpool & Wolverine',
    genre: 'Action',
    rating: 8.2,
    release: 'Oct 12, 2026',
    poster: 'https://image.tmdb.org/t/p/w300/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    language: 'English',
    bookings: 5130,
  },
  {
    id: 3,
    title: 'Inside Out 2',
    genre: 'Animation',
    rating: 7.8,
    release: 'Oct 18, 2026',
    poster: 'https://image.tmdb.org/t/p/w300/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
    language: 'English',
    bookings: 3640,
  },
  {
    id: 4,
    title: 'Alien: Romulus',
    genre: 'Horror/Sci-Fi',
    rating: 7.4,
    release: 'Oct 25, 2026',
    poster: 'https://image.tmdb.org/t/p/w300/b33nnKl1GSFbao4l3fZDDqsMx0F.jpg',
    language: 'English',
    bookings: 2980,
  },
]

const RECENT_BOOKINGS = [
  { id: 'CB-8821', user: 'Rahul Sharma',  movie: 'Top Gun: Maverick', theatre: 'PVR Phoenix',    seats: 3, time: '7:30 PM', amount: 1290, status: 'Confirmed',  avatar: 'R' },
  { id: 'CB-8820', user: 'Priya Mehta',   movie: 'Dune: Part Two',    theatre: 'INOX Magnet',    seats: 2, time: '4:00 PM', amount: 980,  status: 'Confirmed',  avatar: 'P' },
  { id: 'CB-8819', user: 'Aarav Singh',   movie: 'Inside Out 2',      theatre: 'Cinepolis VR Mall', seats: 4, time: '1:15 PM', amount: 1600, status: 'Checked In', avatar: 'A' },
  { id: 'CB-8818', user: 'Sneha Iyer',    movie: 'Deadpool & Wolverine','theatre': 'PVR Icon',   seats: 2, time: '10:00 PM',amount: 1100, status: 'Pending',    avatar: 'S' },
  { id: 'CB-8817', user: 'Vikram Nair',   movie: 'Alien: Romulus',    theatre: 'INOX Leisure',   seats: 1, time: '9:45 PM', amount: 420,  status: 'Cancelled',  avatar: 'V' },
  { id: 'CB-8816', user: 'Ananya Patel',  movie: 'Top Gun: Maverick', theatre: 'Miraj Cinemas',  seats: 3, time: '6:00 PM', amount: 990,  status: 'Completed',  avatar: 'A' },
]

const TOP_MOVIES = [
  { title: 'Top Gun: Maverick',    bookings: 8420, pct: 100, color: 'bg-[#e50914]' },
  { title: 'Deadpool & Wolverine', bookings: 7150, pct: 85,  color: 'bg-violet-500' },
  { title: 'Dune: Part Two',       bookings: 6380, pct: 76,  color: 'bg-cyan-500'   },
  { title: 'Inside Out 2',         bookings: 5240, pct: 62,  color: 'bg-emerald-500'},
]

const QUICK_ACTIONS = [
  { label: 'Add Movie',    icon: Film,     color: 'bg-[#e50914] hover:bg-[#c40812]' },
  { label: 'New Show',     icon: Play,     color: 'bg-violet-600 hover:bg-violet-700' },
  { label: 'Book Ticket',  icon: Ticket,   color: 'bg-emerald-600 hover:bg-emerald-700' },
  { label: 'View Reports', icon: BarChart3,color: 'bg-blue-600 hover:bg-blue-700' },
]

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function StatusBadge({ status }) {
  const MAP = {
    Confirmed:   'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
    'Checked In':'bg-blue-500/15 text-blue-300 border-blue-500/25',
    Pending:     'bg-yellow-500/15 text-yellow-300 border-yellow-500/25',
    Cancelled:   'bg-red-500/15 text-red-300 border-red-500/25',
    Completed:   'bg-gray-500/15 text-gray-300 border-gray-500/25',
  }
  return (
    <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${MAP[status] || MAP.Pending}`}>
      {status}
    </span>
  )
}

/* pure-CSS bar chart */
function RevenueChart() {
  const maxRev = Math.max(...REVENUE_DATA.map((d) => d.revenue))
  return (
    <div className="flex items-end gap-2 h-28 px-1">
      {REVENUE_DATA.map((d, i) => {
        const h = Math.round((d.revenue / maxRev) * 100)
        const isLast = i === REVENUE_DATA.length - 1
        return (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer">
            <div className="relative w-full flex flex-col items-center">
              {/* tooltip */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-10">
                <div className="bg-[#222] border border-[#333] rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-xl">
                  <p className="text-white text-[11px] font-bold">
                    {(d.revenue / 1000).toFixed(0)}k
                  </p>
                  <p className="text-gray-500 text-[10px]">{d.bookings} bookings</p>
                </div>
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#333]" />
              </div>
              <div
                className={`w-full rounded-t-md transition-all duration-500 ${
                  isLast ? 'bg-gradient-to-t from-[#e50914] to-[#ff4444]' : 'bg-[#222] group-hover:bg-[#e50914]/50'
                }`}
                style={{ height: `${h}%`, minHeight: '8px' }}
              />
            </div>
            <span className="text-[10px] text-gray-500">{d.month}</span>
          </div>
        )
      })}
    </div>
  )
}

/* SVG donut — occupancy */
function OccupancyDonut({ booked, total }) {
  const pct = Math.round((booked / total) * 100)
  const r = 38
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <div className="flex flex-col items-center">
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="#1e1e1e" strokeWidth="10" />
        <circle
          cx="48" cy="48" r={r}
          fill="none"
          stroke="url(#donutGrad)"
          strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 48 48)"
        />
        <defs>
          <linearGradient id="donutGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e50914" />
            <stop offset="100%" stopColor="#ff6b35" />
          </linearGradient>
        </defs>
        <text x="48" y="44" textAnchor="middle" fill="white" fontSize="14" fontWeight="800">{pct}%</text>
        <text x="48" y="58" textAnchor="middle" fill="#555" fontSize="8">occupancy</text>
      </svg>
    </div>
  )
}

/* ── Dashboard page ─────────────────────────────────────────────────────── */
export default function Dashboard() {
  const { user } = useAuth()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="p-5 lg:p-7 min-h-screen space-y-5">

      {/* ── Topbar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">
            {greeting}, {user?.name?.split(' ')[0] ?? 'Admin'} 👋
          </h1>
          <p className="text-gray-500 text-xs mt-0.5">{today}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search…"
              className="pl-8 pr-4 py-2 rounded-xl bg-[#161616] border border-[#222] text-white text-xs placeholder-gray-600 focus:outline-none focus:border-[#e50914] w-40 transition-all"
            />
          </div>
          <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-[#161616] border border-[#222] text-gray-400 hover:text-white transition-colors">
            <Bell size={15} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#e50914] rounded-full" />
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#161616] border border-[#222] text-gray-400 hover:text-white text-xs transition-colors">
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {STATS.map((s) => {
          const Icon = s.icon
          return (
            <div
              key={s.label}
              className={`bg-[#111] border ${s.border} rounded-2xl p-4 flex flex-col gap-2.5 shadow-lg ${s.glow} hover:scale-[1.02] transition-transform cursor-pointer`}
            >
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                <Icon size={17} className={s.color} />
              </div>
              <div>
                <p className="text-xl font-extrabold text-white leading-none">{s.value}</p>
                <p className="text-gray-500 text-[11px] mt-1 leading-tight">{s.label}</p>
              </div>
              <p className={`text-[10px] font-medium flex items-center gap-1 ${s.up ? 'text-emerald-400' : 'text-red-400'}`}>
                {s.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {s.change}
              </p>
            </div>
          )
        })}
      </div>

      {/* ── Row 2: Revenue chart + Donut + Quick Actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-[#111] border border-[#1e1e1e] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-semibold text-sm">Revenue Overview</h3>
              <p className="text-gray-600 text-[11px]">Last 6 months • Ticket Sales</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                <TrendingUp size={12} /> +22%
              </span>
              <button className="text-gray-500 hover:text-white ml-2">
                <MoreHorizontal size={15} />
              </button>
            </div>
          </div>
          {/* chart */}
          <RevenueChart />
          {/* summary row */}
          <div className="flex gap-6 mt-4 pt-4 border-t border-[#1e1e1e]">
            {[
              { label: 'Total Revenue', value: '$9,35,000', color: 'text-[#e50914]' },
              { label: 'Total Bookings', value: '30,100',   color: 'text-emerald-400' },
              { label: 'Avg per Booking', value: '$31.06',  color: 'text-yellow-400'  },
            ].map((item) => (
              <div key={item.label}>
                <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
                <p className="text-gray-600 text-[10px]">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Seat occupancy + Quick actions */}
        <div className="flex flex-col gap-4">
          {/* Occupancy card */}
          <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-3">
              <h3 className="text-white font-semibold text-sm">Seat Occupancy</h3>
              <span className="text-[10px] text-gray-500">Today</span>
            </div>
            <OccupancyDonut booked={70} total={100} />
            <div className="flex w-full justify-around mt-3 pt-3 border-t border-[#1e1e1e]">
              <div className="text-center">
                <p className="text-white text-sm font-bold">70%</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-[#e50914]" />
                  <p className="text-gray-500 text-[10px]">Booked</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-white text-sm font-bold">30%</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-[#1e1e1e] border border-[#333]" />
                  <p className="text-gray-500 text-[10px]">Available</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5">
            <h3 className="text-white font-semibold text-sm mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_ACTIONS.map(({ label, icon: Icon, color }) => (
                <button
                  key={label}
                  className={`${color} flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-white text-[11px] font-semibold transition-all active:scale-95`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 3: Upcoming movies + Top movies ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Upcoming movies */}
        <div className="lg:col-span-2 bg-[#111] border border-[#1e1e1e] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-sm">Upcoming Movies</h3>
            <button className="text-[#e50914] text-xs hover:underline flex items-center gap-1">
              View all <ChevronRight size={12} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {UPCOMING_MOVIES.map((m) => (
              <div
                key={m.id}
                className="bg-[#161616] rounded-xl overflow-hidden border border-[#1e1e1e] hover:border-[#e50914]/40 transition-all group cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={m.poster}
                    alt={m.title}
                    className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/60 rounded-md px-1.5 py-0.5">
                    <Star size={9} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-[10px] font-bold">{m.rating}</span>
                  </div>
                  <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-9 h-9 rounded-full bg-[#e50914]/90 flex items-center justify-center">
                      <Play size={14} className="text-white fill-white ml-0.5" />
                    </div>
                  </button>
                </div>
                <div className="p-2.5">
                  <p className="text-white text-xs font-semibold truncate">{m.title}</p>
                  <p className="text-gray-500 text-[10px] mt-0.5">{m.genre}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock size={9} />
                      <span className="text-[10px]">{m.release}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Ticket size={9} className="text-[#e50914]" />
                    <span className="text-[10px] text-gray-400">
                      {m.bookings.toLocaleString()} pre-booked
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top movies by bookings */}
        <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-sm">Top Movies</h3>
            <span className="text-gray-500 text-[10px]">By bookings</span>
          </div>
          <div className="space-y-4">
            {TOP_MOVIES.map((m, i) => (
              <div key={m.title}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-gray-600 text-[11px] font-bold w-4">#{i + 1}</span>
                    <span className="text-gray-300 text-xs truncate">{m.title}</span>
                  </div>
                  <span className="text-gray-400 text-[11px] flex-shrink-0 ml-2">
                    {m.bookings.toLocaleString()}
                  </span>
                </div>
                <div className="h-1.5 bg-[#1e1e1e] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${m.color} rounded-full transition-all duration-700`}
                    style={{ width: `${m.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Live activity */}
          <div className="mt-5 pt-4 border-t border-[#1e1e1e]">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={12} className="text-yellow-400" />
              <span className="text-white text-xs font-semibold">Live Activity</span>
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse ml-auto" />
            </div>
            <div className="space-y-2">
              {[
                { city: 'Mumbai', bookings: 124, icon: MapPin },
                { city: 'Delhi',  bookings: 98,  icon: MapPin },
                { city: 'Pune',   bookings: 67,  icon: MapPin },
              ].map(({ city, bookings, icon: Icon }) => (
                <div key={city} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Icon size={10} className="text-gray-500" />
                    <span className="text-gray-400 text-[11px]">{city}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1 w-12 bg-[#1e1e1e] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#e50914] rounded-full"
                        style={{ width: `${(bookings / 124) * 100}%` }}
                      />
                    </div>
                    <span className="text-gray-500 text-[10px]">{bookings}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 4: Recent Bookings table ── */}
      <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-semibold text-sm">Recent Bookings</h3>
            <p className="text-gray-600 text-[11px]">Latest ticket transactions</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e50914] hover:bg-[#c40812] text-white text-xs font-semibold transition-colors">
              <Plus size={12} /> New Booking
            </button>
            <button className="text-gray-500 hover:text-white">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1e1e1e]">
                {['Booking ID', 'Customer', 'Movie', 'Theatre', 'Seats', 'Show Time', 'Amount', 'Status'].map((h) => (
                  <th key={h} className="pb-2.5 text-left text-gray-500 font-medium text-[11px] pr-4 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161616]">
              {RECENT_BOOKINGS.map((b) => (
                <tr key={b.id} className="hover:bg-[#161616] transition-colors group">
                  <td className="py-3 pr-4 text-[#e50914] font-semibold whitespace-nowrap">{b.id}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#e50914] to-[#ff6b35] flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
                        {b.avatar}
                      </div>
                      <span className="text-gray-300 truncate max-w-[90px]">{b.user}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-gray-300 whitespace-nowrap max-w-[130px]">
                    <div className="flex items-center gap-1.5">
                      <Film size={11} className="text-gray-600 flex-shrink-0" />
                      <span className="truncate">{b.movie}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-gray-400 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={10} className="text-gray-600" />
                      {b.theatre}
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-center">
                    <span className="bg-[#1e1e1e] text-gray-300 rounded-md px-2 py-0.5 text-[11px]">
                      {b.seats}x
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-gray-400 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Clock size={10} className="text-gray-600" />
                      {b.time}
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-white font-semibold whitespace-nowrap">
                    Rs. {b.amount.toLocaleString()}
                  </td>
                  <td className="py-3">
                    <StatusBadge status={b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#1e1e1e]">
          <p className="text-gray-600 text-[11px]">Showing 6 of 924 bookings today</p>
          <button className="text-[#e50914] text-xs hover:underline flex items-center gap-1">
            View all bookings <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}

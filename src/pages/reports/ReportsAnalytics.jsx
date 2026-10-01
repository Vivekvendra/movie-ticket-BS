import { useState, useMemo } from 'react'
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Ticket,
  Users,
  Building2,
  Calendar,
  Download,
  Printer,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Sparkles,
  PieChart,
  Coffee,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react'
import { toast } from 'react-toastify'

/* ── Historical Revenue Data ────────────────────────────────────────────── */
const MONTHLY_REVENUE = [
  { month: 'Apr', revenue: 24.5, admissions: 38200, occupancy: 72 },
  { month: 'May', revenue: 31.2, admissions: 49400, occupancy: 78 },
  { month: 'Jun', revenue: 36.8, admissions: 58100, occupancy: 84 },
  { month: 'Jul', revenue: 33.4, admissions: 52000, occupancy: 76 },
  { month: 'Aug', revenue: 41.6, admissions: 64900, occupancy: 89 },
  { month: 'Sep', revenue: 48.6, admissions: 74200, occupancy: 93 },
]

/* ── Multiplex Performance ──────────────────────────────────────────────── */
const THEATRE_PERFORMANCE = [
  { name: 'AMB Cinemas, Hyderabad', screens: 7, occupancy: 92, revenue: '₹14.8 L', admissions: '24,300', peak: 'Evening & Night' },
  { name: 'Prasads Multiplex & IMAX, Hyd', screens: 6, occupancy: 88, revenue: '₹12.4 L', admissions: '20,800', peak: 'Weekend Matinee' },
  { name: 'PVR INOX Phoenix, Mumbai', screens: 9, occupancy: 85, revenue: '₹11.2 L', admissions: '17,400', peak: 'Friday - Sunday' },
  { name: 'Cinepolis Forum, Bengaluru', screens: 11, occupancy: 79, revenue: '₹8.9 L', admissions: '14,200', peak: 'Late Night' },
  { name: 'SPI Palazzo, Chennai', screens: 9, occupancy: 76, revenue: '₹7.5 L', admissions: '12,900', peak: 'Evening 6:15 PM' },
  { name: 'Miraj Cinemas IMAX, Mumbai', screens: 5, occupancy: 71, revenue: '₹5.8 L', admissions: '9,800', peak: 'Matinee & Night' },
]

/* ── Genre Distribution ─────────────────────────────────────────────────── */
const GENRE_STATS = [
  { genre: 'Action & Thriller', share: 44, amount: '₹21.4 L', color: 'bg-red-500', barGradient: 'from-red-600 to-rose-500' },
  { genre: 'Sci-Fi & Adventure', share: 28, amount: '₹13.6 L', color: 'bg-sky-500', barGradient: 'from-sky-500 to-cyan-400' },
  { genre: 'Drama & Historical', share: 15, amount: '₹7.3 L', color: 'bg-amber-500', barGradient: 'from-amber-500 to-yellow-400' },
  { genre: 'Animation & Family', share: 9, amount: '₹4.4 L', color: 'bg-emerald-500', barGradient: 'from-emerald-500 to-teal-400' },
  { genre: 'Comedy & Others', share: 4, amount: '₹1.9 L', color: 'bg-purple-500', barGradient: 'from-purple-500 to-indigo-400' },
]

/* ── Top Selling F&B Refreshments ───────────────────────────────────────── */
const CONCESSIONS_STATS = [
  { item: 'Jumbo Caramel Popcorn', units: '14,290', revenue: '₹4.14 L', margin: '82%', growth: '+19%' },
  { item: 'Loaded Cheese Nachos with Jalapeños', units: '10,840', revenue: '₹2.81 L', margin: '76%', growth: '+14%' },
  { item: 'Chilled Coca-Cola Fountain (500ml)', units: '21,400', revenue: '₹2.78 L', margin: '88%', growth: '+22%' },
  { item: 'Gourmet Chicken Hot Dog', units: '4,650', revenue: '₹1.11 L', margin: '68%', growth: '+8%' },
  { item: 'Artisanal Cold Brew Coffee', units: '3,890', revenue: '₹0.74 L', margin: '74%', growth: '+12%' },
]

/* ── Showtime Heatmap Slots ─────────────────────────────────────────────── */
const TIME_SLOTS = [
  { slot: 'Morning Shows (09:30 AM - 11:30 AM)', occupancy: 58, tag: 'Moderate', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { slot: 'Matinee Screening (01:00 PM - 03:30 PM)', occupancy: 79, tag: 'High Demand', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
  { slot: 'Prime Evening (06:00 PM - 08:30 PM)', occupancy: 96, tag: 'Peak Housefull', color: 'text-[#e50914] bg-red-500/10 border-red-500/20' },
  { slot: 'Night Screening (09:45 PM - 11:30 PM)', occupancy: 87, tag: 'Fast Filling', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
]

export default function ReportsAnalytics() {
  const [selectedRange, setSelectedRange] = useState('6M')
  const [chartMetric, setChartMetric] = useState('revenue') // 'revenue' | 'admissions'
  const [selectedVenue, setSelectedVenue] = useState('All')
  const [hoveredMonth, setHoveredMonth] = useState(null)

  // Max value calculation for bar chart scaling
  const maxMetricVal = useMemo(() => {
    if (chartMetric === 'revenue') {
      return Math.max(...MONTHLY_REVENUE.map((m) => m.revenue))
    }
    return Math.max(...MONTHLY_REVENUE.map((m) => m.admissions))
  }, [chartMetric])

  // Handle Export CSV
  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Month,Gross Revenue (Lakhs),Total Admissions,Seat Occupancy (%)\n' +
      MONTHLY_REVENUE.map((r) => `${r.month},₹${r.revenue}L,${r.admissions},${r.occupancy}%`).join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `Filmax_BoxOffice_Report_${selectedRange}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Box office analytical dataset exported as CSV!')
  }

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6 min-h-screen bg-[#08090e] text-white">

      {/* ── TOP HEADER BAR ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#121524] via-[#0f121d] to-[#141221] border border-[#1f243b] p-6 lg:p-7 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Financial Reports & Analytics
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Auditorium utilization metrics, revenue yield curves, concession margins, and footfall telemetry.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Time Range Selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#161a29] border border-[#242b45]">
            {['1M', '3M', '6M', 'YTD'].map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedRange === r ? 'bg-[#e50914] text-white shadow-sm' : 'text-gray-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#161a29] border border-[#262c45] hover:bg-[#1f243b] text-gray-300 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>

          {/* Print Report */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#e50914] to-[#ff2b38] hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-all cursor-pointer"
          >
            <Printer size={14} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* ── 4 KPI STATS ROW ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-[#111422] border border-[#1e243b] shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Gross Collections</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <DollarSign size={17} />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-white">₹48.65 L</p>
            <span className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
              <TrendingUp size={12} />
              +22.4% vs previous period
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-[#111422] border border-[#1e243b] shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Total Admissions</span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
              <Ticket size={17} />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-white">142,890</p>
            <span className="text-[11px] text-sky-400 mt-1 flex items-center gap-1 font-semibold">
              <TrendingUp size={12} />
              +14.2% patron admissions
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-[#111422] border border-[#1e243b] shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Screen Occupancy</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Users size={17} />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-white">81.4%</p>
            <span className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
              <TrendingUp size={12} />
              +6.8% higher utilization
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-[#111422] border border-[#1e243b] shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Concessions per Attendee</span>
            <div className="w-9 h-9 rounded-xl bg-red-500/10 text-[#e50914] border border-red-500/20 flex items-center justify-center">
              <Coffee size={17} />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-white">₹245 / patron</p>
            <span className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
              <TrendingUp size={12} />
              +9.1% F&B spend growth
            </span>
          </div>
        </div>
      </div>

      {/* ── ROW: INTERACTIVE BAR CHART & GENRE SHARE ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 2/3 COLUMN: MONTHLY TRENDS CHART */}
        <div className="lg:col-span-2 rounded-3xl bg-[#111422] border border-[#1e243b] p-6 lg:p-7 shadow-xl flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#1b2034]">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <BarChart3 size={18} className="text-[#e50914]" />
                Revenue Growth & Admissions Curve
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Comparison of box office collections and patron admissions across past quarters.
              </p>
            </div>

            {/* Metric Switcher */}
            <div className="flex items-center gap-1 bg-[#161a29] p-1 rounded-xl border border-[#242b45]">
              <button
                onClick={() => setChartMetric('revenue')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  chartMetric === 'revenue' ? 'bg-[#e50914] text-white shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                Revenue (₹)
              </button>
              <button
                onClick={() => setChartMetric('admissions')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  chartMetric === 'admissions' ? 'bg-[#e50914] text-white shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                Admissions
              </button>
            </div>
          </div>

          {/* Interactive CSS Bar Chart */}
          <div className="h-64 mt-6 flex items-end justify-between gap-3 px-2 sm:px-6 relative">
            {/* Background grid lines */}
            <div className="absolute inset-x-0 top-0 border-b border-white/5" />
            <div className="absolute inset-x-0 top-1/4 border-b border-white/5" />
            <div className="absolute inset-x-0 top-2/4 border-b border-white/5" />
            <div className="absolute inset-x-0 top-3/4 border-b border-white/5" />

            {MONTHLY_REVENUE.map((d, index) => {
              const currentVal = chartMetric === 'revenue' ? d.revenue : d.admissions
              const heightPct = Math.round((currentVal / maxMetricVal) * 100)
              const isHovered = hoveredMonth === d.month
              const isLatest = index === MONTHLY_REVENUE.length - 1

              return (
                <div
                  key={d.month}
                  className="flex-1 flex flex-col items-center h-full justify-end group relative z-10 cursor-pointer"
                  onMouseEnter={() => setHoveredMonth(d.month)}
                  onMouseLeave={() => setHoveredMonth(null)}
                >
                  {/* Tooltip on hover */}
                  <div
                    className={`absolute -top-12 px-3 py-1.5 rounded-xl bg-[#1d2238] border border-[#2e375c] text-center shadow-xl transition-all duration-200 pointer-events-none whitespace-nowrap z-20 ${
                      isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
                  >
                    <p className="text-[11px] font-bold text-white">
                      {chartMetric === 'revenue' ? `₹${d.revenue} Lakhs` : `${d.admissions.toLocaleString()} tickets`}
                    </p>
                    <p className="text-[9px] text-emerald-400 font-semibold">{d.occupancy}% Occupancy</p>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full max-w-[48px] bg-[#161a29] rounded-2xl p-1 flex items-end h-full">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-xl transition-all duration-500 ${
                        isLatest
                          ? 'bg-gradient-to-t from-[#b80610] to-[#e50914] shadow-[0_0_15px_rgba(229,9,20,0.5)]'
                          : 'bg-gradient-to-t from-[#1e243b] to-[#3b4772] hover:from-sky-700 hover:to-sky-500'
                      }`}
                    />
                  </div>

                  {/* Month Label */}
                  <span
                    className={`text-xs mt-3 font-semibold transition-colors ${
                      isLatest ? 'text-[#e50914] font-black' : 'text-gray-400 group-hover:text-white'
                    }`}
                  >
                    {d.month}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Chart footer notes */}
          <div className="mt-4 pt-4 border-t border-[#1b2034] flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-[#e50914]" /> Current Month Record High
            </span>
            <span className="text-emerald-400 font-bold">+28.4% Revenue Acceleration</span>
          </div>
        </div>

        {/* 1/3 COLUMN: GENRE BOX OFFICE BREAKDOWN */}
        <div className="rounded-3xl bg-[#111422] border border-[#1e243b] p-6 lg:p-7 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2 pb-3 border-b border-[#1b2034]">
              <PieChart size={18} className="text-sky-400" />
              Genre Share Distribution
            </h2>

            {/* List with gradient progress bars */}
            <div className="mt-5 space-y-4">
              {GENRE_STATS.map((g) => (
                <div key={g.genre} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-gray-200">{g.genre}</span>
                    <span className="font-bold text-white">
                      {g.share}% <span className="text-gray-500">({g.amount})</span>
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#161a29] overflow-hidden">
                    <div
                      style={{ width: `${g.share}%` }}
                      className={`h-full rounded-full bg-gradient-to-r ${g.barGradient}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-3.5 rounded-2xl bg-[#161a29] border border-[#22283d] text-xs text-gray-400 flex items-center gap-2.5">
            <Sparkles size={16} className="text-[#e50914] flex-shrink-0" />
            <span>Action & Sci-Fi lead 72% of total box office gross revenue this season.</span>
          </div>
        </div>

      </div>

      {/* ── ROW: MULTIPLEX AUDITORIUM PERFORMANCE & PEAK DEMAND ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 2/3 COLUMN: THEATRE OCCUPANCY TABLE */}
        <div className="lg:col-span-2 rounded-3xl bg-[#111422] border border-[#1e243b] shadow-xl overflow-hidden">
          <div className="p-6 border-b border-[#1b2034] flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 size={18} className="text-[#e50914]" />
                Auditorium Utilization by Multiplex Venue
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Screen capacity, total admissions, and revenue yields per cinema property.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              6 Active Venues
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1b2034] bg-[#0d0f17] text-gray-400 uppercase font-semibold">
                  <th className="py-3.5 px-5">Multiplex Venue</th>
                  <th className="py-3.5 px-5">Screens</th>
                  <th className="py-3.5 px-5">Occupancy Rate</th>
                  <th className="py-3.5 px-5">Admissions</th>
                  <th className="py-3.5 px-5">Revenue</th>
                  <th className="py-3.5 px-5">Peak Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181d30]">
                {THEATRE_PERFORMANCE.map((t) => (
                  <tr key={t.name} className="hover:bg-[#151928]/60 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      {t.name}
                    </td>
                    <td className="py-3.5 px-5 text-gray-300 font-semibold">{t.screens} Screens</td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-20 h-2 rounded-full bg-[#181d30] overflow-hidden">
                          <div
                            style={{ width: `${t.occupancy}%` }}
                            className={`h-full rounded-full ${
                              t.occupancy >= 85 ? 'bg-[#e50914]' : t.occupancy >= 75 ? 'bg-sky-400' : 'bg-amber-400'
                            }`}
                          />
                        </div>
                        <span className="font-bold text-white text-[11px]">{t.occupancy}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-gray-300">{t.admissions}</td>
                    <td className="py-3.5 px-5 font-bold text-emerald-400">{t.revenue}</td>
                    <td className="py-3.5 px-5 text-gray-400">{t.peak}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 1/3 COLUMN: PEAK SHOWTIME DEMAND HEATMAP */}
        <div className="rounded-3xl bg-[#111422] border border-[#1e243b] p-6 lg:p-7 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-[#1b2034]">
              <Calendar size={18} className="text-amber-400" />
              Peak Screening Demand Slots
            </h2>

            <div className="mt-5 space-y-4">
              {TIME_SLOTS.map((slot) => (
                <div
                  key={slot.slot}
                  className="p-3.5 rounded-2xl bg-[#161a29] border border-[#232942] space-y-2"
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-semibold text-gray-200">{slot.slot}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${slot.color}`}>
                      {slot.tag}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span>Average Seat Fill Rate:</span>
                    <span className="font-bold text-white">{slot.occupancy}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
            <strong>Operator Advisory:</strong> Prime evening showtimes running at 96% occupancy require additional ticket counters.
          </div>
        </div>

      </div>

      {/* ── ROW: CONCESSIONS (F&B) BREAKDOWN & AUDITED FINANCIAL RECONCILIATION ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* TOP CONCESSIONS TABLE */}
        <div className="rounded-3xl bg-[#111422] border border-[#1e243b] shadow-xl overflow-hidden p-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#1b2034]">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Coffee size={18} className="text-amber-400" />
                Gourmet Concessions & Refreshments Ledger
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Top performing snacks, units sold, and profit margins.</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {CONCESSIONS_STATS.map((item) => (
              <div
                key={item.item}
                className="p-3.5 rounded-2xl bg-[#161a29] border border-[#242b45] flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <p className="font-bold text-white">{item.item}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {item.units} units sold • Margin: <span className="text-emerald-400 font-semibold">{item.margin}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white text-sm">{item.revenue}</p>
                  <span className="text-[10px] text-emerald-400 font-bold">{item.growth} MoM</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AUDITED FINANCIAL RECONCILIATION */}
        <div className="rounded-3xl bg-[#111422] border border-[#1e243b] shadow-xl overflow-hidden p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#1b2034]">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle size={18} className="text-emerald-400" />
                  Audited Financial Reconciliation Summary
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Gross collections, statutory taxes, and net settled payouts.</p>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-xs">
              <div className="flex justify-between p-3 rounded-xl bg-[#161a29] text-gray-300">
                <span>Gross Box Office Ticket Sales</span>
                <span className="font-bold text-white">₹38,24,000</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-[#161a29] text-gray-300">
                <span>Gourmet Concessions & Refreshments</span>
                <span className="font-bold text-amber-400">+₹11,58,000</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-[#161a29] text-gray-300">
                <span>Convenience Fees Collected</span>
                <span className="font-bold text-sky-400">+₹2,42,000</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-[#161a29] text-gray-300">
                <span>Integrated GST (18%) & Statutory Levies</span>
                <span className="font-bold text-rose-400">-₹7,36,000</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-[#161a29] text-gray-300">
                <span>Payment Gateway & Platform Commissions (1.8%)</span>
                <span className="font-bold text-rose-400">-₹94,000</span>
              </div>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Net Bank Settlement</span>
              <p className="text-xl font-black text-white">₹43,94,000</p>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              Audited & Reconciled ✓
            </span>
          </div>
        </div>

      </div>

    </div>
  )
}

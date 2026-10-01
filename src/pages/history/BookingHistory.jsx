import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Ticket,
  Search,
  Filter,
  Calendar,
  Eye,
  XCircle,
  Download,
  Printer,
  ChevronRight,
  Clock,
  MapPin,
  User,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Film,
  Building2,
  Receipt,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { toast } from 'react-toastify'

const SAMPLE_BOOKINGS = [
  {
    bookingId: 'FLX-9941',
    transactionId: 'TXN_1727712490001',
    movieTitle: 'Top Gun: Maverick',
    theatreName: 'PVR INOX Phoenix Palladium, Mumbai',
    date: '2026-10-02',
    time: '07:00 PM',
    seats: ['A4', 'A5'],
    customer: {
      fullName: 'Rahul Sharma',
      email: 'rahul.s@stackly.edu',
      phone: '9876543210',
    },
    snacks: [
      { id: 'c1', name: 'Jumbo Caramel Popcorn', quantity: 1, price: 290 },
      { id: 'c3', name: 'Chilled Coca-Cola Fountain (500ml)', quantity: 2, price: 130 },
    ],
    pricing: {
      ticketsBase: 700,
      snackTotal: 550,
      fee: 60,
      gst: 30,
      discount: 50,
      total: 1290,
    },
    paymentMethod: 'UPI (Google Pay)',
    paidAt: '2026-09-30T14:32:00.000Z',
    poster: '/posters/topgun.jpg',
    status: 'Confirmed',
  },
  {
    bookingId: 'FLX-9940',
    transactionId: 'TXN_1727711200000',
    movieTitle: 'Dune: Part Two',
    theatreName: 'AMB Cinemas, Hyderabad',
    date: '2026-10-03',
    time: '06:45 PM',
    seats: ['C3', 'C4'],
    customer: {
      fullName: 'Priya Mehta',
      email: 'priya.m@stackly.edu',
      phone: '9845012345',
    },
    snacks: [{ id: 'c2', name: 'Loaded Cheese Nachos with Jalapeños', quantity: 1, price: 260 }],
    pricing: {
      ticketsBase: 600,
      snackTotal: 260,
      fee: 60,
      gst: 60,
      discount: 0,
      total: 980,
    },
    paymentMethod: 'Credit Card',
    paidAt: '2026-09-29T18:15:00.000Z',
    poster: '/posters/dune2.jpg',
    status: 'Checked In',
  },
  {
    bookingId: 'FLX-9939',
    transactionId: 'TXN_1727708500000',
    movieTitle: 'Deadpool & Wolverine',
    theatreName: 'Cinepolis Forum South, Bengaluru',
    date: '2026-10-04',
    time: '09:45 PM',
    seats: ['D6', 'D7', 'D8'],
    customer: {
      fullName: 'Aarav Singh',
      email: 'aarav.singh@gmail.com',
      phone: '9920145678',
    },
    snacks: [
      { id: 'c1', name: 'Jumbo Caramel Popcorn', quantity: 2, price: 290 },
      { id: 'c5', name: 'Gourmet Chicken Hot Dog', quantity: 2, price: 240 },
    ],
    pricing: {
      ticketsBase: 1140,
      snackTotal: 1060,
      fee: 90,
      gst: 50,
      discount: 500,
      total: 1840,
    },
    paymentMethod: 'UPI (PhonePe)',
    paidAt: '2026-09-28T20:45:00.000Z',
    poster: '/posters/deadpool.jpg',
    status: 'Confirmed',
  },
  {
    bookingId: 'FLX-9938',
    transactionId: 'TXN_1727699100000',
    movieTitle: 'RRR',
    theatreName: 'Prasads Multiplex & IMAX, Hyderabad',
    date: '2026-10-01',
    time: '01:45 PM',
    seats: ['E2', 'E3'],
    customer: {
      fullName: 'Sneha Reddy',
      email: 'sneha.reddy@outlook.com',
      phone: '9888123456',
    },
    snacks: [],
    pricing: {
      ticketsBase: 600,
      snackTotal: 0,
      fee: 60,
      gst: 40,
      discount: 0,
      total: 700,
    },
    paymentMethod: 'Net Banking (HDFC)',
    paidAt: '2026-09-27T11:20:00.000Z',
    poster: '/posters/rrr.jpg',
    status: 'Cancelled',
  },
  {
    bookingId: 'FLX-9937',
    transactionId: 'TXN_1727685400000',
    movieTitle: 'Kalki 2898 AD',
    theatreName: 'SPI Palazzo The Central, Chennai',
    date: '2026-10-05',
    time: '10:00 PM',
    seats: ['B1', 'B2'],
    customer: {
      fullName: 'Kiran Kumar',
      email: 'kiran.k@techmail.com',
      phone: '9765432109',
    },
    snacks: [{ id: 'c3', name: 'Chilled Coca-Cola Fountain (500ml)', quantity: 2, price: 130 }],
    pricing: {
      ticketsBase: 700,
      snackTotal: 260,
      fee: 60,
      gst: 40,
      discount: 100,
      total: 960,
    },
    paymentMethod: 'UPI (Paytm)',
    paidAt: '2026-09-26T16:50:00.000Z',
    poster: '/posters/kalki.jpg',
    status: 'Confirmed',
  },
]

export default function BookingHistory() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [bookingToCancel, setBookingToCancel] = useState(null)

  // Load from localStorage combined with SAMPLE_BOOKINGS
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('cinebook_bookings') || '[]')
      // Merge unique by bookingId
      const map = new Map()
      stored.forEach((b) => map.set(b.bookingId, b))
      SAMPLE_BOOKINGS.forEach((b) => {
        if (!map.has(b.bookingId)) {
          map.set(b.bookingId, b)
        }
      })
      setBookings(Array.from(map.values()))
    } catch {
      setBookings(SAMPLE_BOOKINGS)
    }
  }, [])

  // Filter bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesStatus =
        selectedStatus === 'All' || b.status.toLowerCase() === selectedStatus.toLowerCase()
      const query = searchQuery.toLowerCase()
      const matchesQuery =
        !searchQuery ||
        b.bookingId?.toLowerCase().includes(query) ||
        b.movieTitle?.toLowerCase().includes(query) ||
        b.theatreName?.toLowerCase().includes(query) ||
        b.customer?.fullName?.toLowerCase().includes(query)

      return matchesStatus && matchesQuery
    })
  }, [bookings, selectedStatus, searchQuery])

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalCount = bookings.length
    const confirmedCount = bookings.filter((b) => b.status === 'Confirmed').length
    const checkedInCount = bookings.filter((b) => b.status === 'Checked In').length
    const totalRevenue = bookings
      .filter((b) => b.status !== 'Cancelled')
      .reduce((acc, curr) => acc + (curr.pricing?.total || 0), 0)

    return { totalCount, confirmedCount, checkedInCount, totalRevenue }
  }, [bookings])

  // Cancel Booking handler
  const handleCancelBooking = () => {
    if (!bookingToCancel) return

    const updated = bookings.map((b) =>
      b.bookingId === bookingToCancel.bookingId ? { ...b, status: 'Cancelled' } : b
    )
    setBookings(updated)
    try {
      localStorage.setItem('cinebook_bookings', JSON.stringify(updated))
    } catch {
      // ignore
    }
    setIsCancelModalOpen(false)
    toast.success(`Booking ${bookingToCancel.bookingId} cancelled. Refund initiated to source method.`)
    setBookingToCancel(null)
  }

  // Print Receipt
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6 min-h-screen bg-[#08090e] text-white">

      {/* ── TOP HEADER BAR ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#121524] via-[#0f121d] to-[#141221] border border-[#1f243b] p-6 lg:p-7 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Booking History & Invoices
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Track customer screening passes, view verified admission receipts, and manage seat cancellations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/booking')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#e50914] to-[#ff2b38] hover:brightness-110 text-white text-sm font-bold shadow-lg shadow-red-600/30 transition-all cursor-pointer"
          >
            <Ticket size={16} />
            <span>New Reservation</span>
          </button>
        </div>
      </div>

      {/* ── SUMMARY METRICS ROW ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#111422] border border-[#1e243b] shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Total Bookings</span>
            <div className="w-9 h-9 rounded-xl bg-red-500/10 text-[#e50914] border border-red-500/20 flex items-center justify-center">
              <Ticket size={17} />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-3">{metrics.totalCount}</p>
          <span className="text-[11px] text-gray-400 mt-1 font-medium">All historical transactions</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#111422] border border-[#1e243b] shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Active Passes</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle size={17} />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-400 mt-3">{metrics.confirmedCount}</p>
          <span className="text-[11px] text-emerald-500/80 mt-1 font-medium">Ready for auditorium entry</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#111422] border border-[#1e243b] shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Admitted / Checked In</span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
              <ShieldCheck size={17} />
            </div>
          </div>
          <p className="text-2xl font-black text-sky-400 mt-3">{metrics.checkedInCount}</p>
          <span className="text-[11px] text-sky-400/80 mt-1 font-medium">Barcode scanned at gate</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#111422] border border-[#1e243b] shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Gross Collections</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Receipt size={17} />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-3">₹{metrics.totalRevenue.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-amber-400 mt-1 font-medium">Net settled box office</span>
        </div>
      </div>

      {/* ── SEARCH & FILTER CONTROLS ────────────────────────────────────── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#111422] border border-[#1e243b] shadow-lg flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, movie, patron, venue..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#161a29] border border-[#262c45] text-sm text-white focus:outline-none focus:border-[#e50914] placeholder-gray-500 transition-all"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#161a29] border border-[#242b42] w-full sm:w-auto overflow-x-auto">
          {['All', 'Confirmed', 'Checked In', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedStatus === st
                  ? 'bg-[#e50914] text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* ── BOOKINGS LIST TABLE / CARDS ─────────────────────────────────── */}
      <div className="rounded-3xl bg-[#111422] border border-[#1e243b] shadow-xl overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="py-20 px-6 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gray-500">
              <Ticket size={28} />
            </div>
            <h3 className="text-base font-bold text-white">No Bookings Found</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              No reservation records matched your filter criteria. Try adjusting your query or book new tickets.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1b2034] bg-[#0d0f17] text-gray-400 uppercase tracking-wider font-semibold">
                  <th className="py-4 px-5">Ref ID</th>
                  <th className="py-4 px-5">Movie & Screening</th>
                  <th className="py-4 px-5">Auditorium / Seats</th>
                  <th className="py-4 px-5">Attendee Details</th>
                  <th className="py-4 px-5">Amount</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181d30]">
                {filteredBookings.map((b) => (
                  <tr key={b.bookingId} className="hover:bg-[#151928]/60 transition-colors">
                    {/* ID */}
                    <td className="py-4 px-5 font-mono font-bold text-[#e50914]">
                      {b.bookingId}
                      <span className="block text-[10px] text-gray-500 font-sans mt-0.5">
                        {b.paidAt ? new Date(b.paidAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </td>

                    {/* Movie Info */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={b.poster || '/posters/topgun.jpg'}
                          alt={b.movieTitle}
                          className="w-10 h-14 object-cover rounded-lg border border-[#252b45] flex-shrink-0 shadow"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-white text-sm truncate">{b.movieTitle}</p>
                          <p className="text-gray-400 text-xs truncate mt-0.5 flex items-center gap-1">
                            <MapPin size={11} className="text-[#e50914] flex-shrink-0" />
                            {b.theatreName}
                          </p>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            {b.date} • <span className="text-white font-medium">{b.time}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Seats */}
                    <td className="py-4 px-5">
                      <div className="flex flex-wrap gap-1 mb-1">
                        {b.seats?.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded-md bg-red-500/15 border border-red-500/30 text-red-400 font-black text-[10px]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                      {b.snacks?.length > 0 && (
                        <p className="text-[11px] text-amber-400 font-medium">
                          + {b.snacks.reduce((acc, c) => acc + c.quantity, 0)} Concessions
                        </p>
                      )}
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-5">
                      <p className="font-semibold text-white">{b.customer?.fullName || 'Guest'}</p>
                      <p className="text-gray-400 text-[11px] mt-0.5">{b.customer?.email || 'N/A'}</p>
                      <p className="text-gray-500 text-[10px] mt-0.5">+91 {b.customer?.phone || 'N/A'}</p>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-5 font-semibold">
                      <span className="text-sm font-bold text-white">₹{b.pricing?.total}</span>
                      <span className="block text-[10px] text-gray-400 mt-0.5">{b.paymentMethod || 'UPI'}</span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          b.status === 'Confirmed'
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : b.status === 'Checked In'
                            ? 'bg-sky-500/15 text-sky-400 border-sky-500/30'
                            : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            b.status === 'Confirmed'
                              ? 'bg-emerald-400 animate-pulse'
                              : b.status === 'Checked In'
                              ? 'bg-sky-400'
                              : 'bg-rose-400'
                          }`}
                        />
                        {b.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* View Pass Modal Button */}
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="p-2 rounded-xl bg-[#161a29] border border-[#242b45] hover:bg-[#1f243b] text-gray-300 hover:text-white transition-all cursor-pointer"
                          title="View Digital Cinema Pass"
                        >
                          <Eye size={15} />
                        </button>

                        {/* Cancel Button */}
                        {b.status === 'Confirmed' && (
                          <button
                            onClick={() => {
                              setBookingToCancel(b)
                              setIsCancelModalOpen(true)
                            }}
                            className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all cursor-pointer"
                            title="Cancel Booking & Refund"
                          >
                            <XCircle size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── MODAL: DIGITAL E-TICKET & AUDIT PASS ──────────────────────────── */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#111422] border border-[#262c45] rounded-3xl shadow-2xl overflow-hidden my-8">

            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-[#e50914] to-[#ff2b38] text-white flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-85">FILMAX E-PASS</p>
                <h3 className="text-base font-black tracking-wide">BOOKING REF: {selectedBooking.bookingId}</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white cursor-pointer transition-all"
              >
                ✕
              </button>
            </div>

            {/* Ticket Body */}
            <div className="p-6 flex flex-col gap-5">
              {/* Movie & Venue Info */}
              <div className="flex gap-4 items-center">
                <img
                  src={selectedBooking.poster || '/posters/topgun.jpg'}
                  alt={selectedBooking.movieTitle}
                  className="w-18 h-26 object-cover rounded-xl border border-white/10 shadow-md flex-shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-lg font-black text-white leading-snug">{selectedBooking.movieTitle}</h4>
                  <p className="text-xs text-gray-300 mt-1 flex items-center gap-1">
                    <MapPin size={12} className="text-[#e50914]" />
                    {selectedBooking.theatreName}
                  </p>
                  <p className="text-xs text-[#e50914] font-bold mt-1">
                    {selectedBooking.date} • {selectedBooking.time}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-gray-400">Seats:</span>
                    <div className="flex gap-1">
                      {selectedBooking.seats?.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-xs font-black">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Perforated Divider */}
              <div className="relative h-6 flex items-center justify-center">
                <div className="w-full border-t border-dashed border-[#2b3352]" />
                <div className="absolute -left-9 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#08090e] border-r border-[#262c45]" />
                <div className="absolute -right-9 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#08090e] border-l border-[#262c45]" />
              </div>

              {/* Guest & Payment Specs */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-[#161a29] p-4 rounded-2xl border border-[#232942]">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Attendee</span>
                  <span className="text-white font-semibold">{selectedBooking.customer?.fullName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Contact</span>
                  <span className="text-white font-semibold">+91 {selectedBooking.customer?.phone}</span>
                </div>
                <div className="mt-2">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Method</span>
                  <span className="text-white font-semibold">{selectedBooking.paymentMethod}</span>
                </div>
                <div className="mt-2">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Total Paid</span>
                  <span className="text-emerald-400 font-extrabold text-sm">₹{selectedBooking.pricing?.total}</span>
                </div>
              </div>

              {/* Barcode Strip */}
              <div className="p-4 rounded-2xl bg-white text-black flex flex-col items-center justify-center space-y-1">
                <div className="font-mono text-2xl tracking-[0.35em] font-black">
                  ||| | |||| | ||| |||| |
                </div>
                <p className="text-[10px] font-mono font-bold tracking-widest text-gray-700">
                  {selectedBooking.bookingId} • GATE ADMISSION VALID
                </p>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handlePrint}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1d2238] hover:bg-[#252c48] text-white text-xs font-bold transition-all cursor-pointer"
                >
                  <Printer size={15} />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/seats', { state: { movie: { title: selectedBooking.movieTitle, poster: selectedBooking.poster } } })
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#e50914] to-[#ff2b38] hover:brightness-110 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-red-600/30"
                >
                  <RotateCcw size={15} />
                  <span>Book Again</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: CONFIRM CANCELLATION ─────────────────────────────────── */}
      {isCancelModalOpen && bookingToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#111422] border border-[#2c3452] rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-[#e50914] flex items-center justify-center mx-auto">
              <AlertCircle size={26} />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">Cancel Reservation?</h3>
              <p className="text-xs text-gray-400">
                Are you sure you want to cancel booking <strong className="text-white">{bookingToCancel.bookingId}</strong> for{' '}
                <strong className="text-white">{bookingToCancel.movieTitle}</strong>?
              </p>
              <p className="text-xs text-emerald-400 mt-2">
                A refund of ₹{bookingToCancel.pricing?.total} will be credited to {bookingToCancel.paymentMethod} within 2-3 business hours.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsCancelModalOpen(false)
                  setBookingToCancel(null)
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#161a29] border border-[#242b45] hover:bg-[#1f243b] text-gray-300 text-xs font-bold transition-all cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                className="flex-1 py-2.5 rounded-xl bg-[#e50914] hover:bg-[#ff2b38] text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-red-600/30"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

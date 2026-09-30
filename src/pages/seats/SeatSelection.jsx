import { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Armchair,
  Film,
  Building2,
  Calendar,
  Clock,
  ChevronRight,
  Check,
  Sparkles,
  Ticket,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react'
import { INITIAL_MOVIES } from '../../data/moviesData'
import { INITIAL_THEATRES } from '../../data/theatresData'
import { toast } from 'react-toastify'

// Seat Layout Configuration
const SEAT_ROWS = [
  { row: 'A', tier: 'Recliner VIP', price: 450, seats: 10, color: 'text-amber-400' },
  { row: 'B', tier: 'Recliner VIP', price: 450, seats: 10, color: 'text-amber-400' },
  { row: 'C', tier: 'Prime Circle', price: 280, seats: 12, color: 'text-sky-400' },
  { row: 'D', tier: 'Prime Circle', price: 280, seats: 12, color: 'text-sky-400' },
  { row: 'E', tier: 'Prime Circle', price: 280, seats: 12, color: 'text-sky-400' },
  { row: 'F', tier: 'Classic Club', price: 180, seats: 14, color: 'text-emerald-400' },
  { row: 'G', tier: 'Classic Club', price: 180, seats: 14, color: 'text-emerald-400' },
  { row: 'H', tier: 'Classic Club', price: 180, seats: 14, color: 'text-emerald-400' },
]

// Pre-booked sample seats
const INITIAL_OCCUPIED = ['A4', 'A5', 'C3', 'C7', 'D6', 'D7', 'D8', 'F5', 'F6', 'G9', 'G10', 'H2']

const DATES = [
  { day: 'Today', date: '29 Sep', full: '2026-09-29' },
  { day: 'Tomorrow', date: '30 Sep', full: '2026-09-30' },
  { day: 'Thu', date: '01 Oct', full: '2026-10-01' },
  { day: 'Fri', date: '02 Oct', full: '2026-10-02' },
]

export default function SeatSelection() {
  const navigate = useNavigate()
  const location = useLocation()

  // State pre-populated from navigation or defaults
  const [selectedMovieId, setSelectedMovieId] = useState(
    location.state?.movieId || INITIAL_MOVIES[0].id
  )
  const [selectedTheatreId, setSelectedTheatreId] = useState(
    location.state?.theatreId || INITIAL_THEATRES[0].id
  )
  const [selectedDate, setSelectedDate] = useState(DATES[0].full)
  const [selectedShowTime, setSelectedShowTime] = useState('06:45 PM')
  const [selectedSeats, setSelectedSeats] = useState(['C4', 'C5'])

  const currentMovie = useMemo(
    () => INITIAL_MOVIES.find((m) => m.id === Number(selectedMovieId)) || INITIAL_MOVIES[0],
    [selectedMovieId]
  )

  const currentTheatre = useMemo(
    () => INITIAL_THEATRES.find((t) => t.id === Number(selectedTheatreId)) || INITIAL_THEATRES[0],
    [selectedTheatreId]
  )

  // Toggle seat selection
  const handleSeatClick = (seatId) => {
    if (INITIAL_OCCUPIED.includes(seatId)) {
      toast.info(`Seat ${seatId} is already reserved by another guest.`)
      return
    }

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId))
    } else {
      if (selectedSeats.length >= 8) {
        toast.warning('Maximum 8 tickets allowed per transaction.')
        return
      }
      setSelectedSeats([...selectedSeats, seatId])
    }
  }

  // Calculate pricing breakdown
  const pricing = useMemo(() => {
    let subtotal = 0
    selectedSeats.forEach((seatId) => {
      const rowLetter = seatId.charAt(0)
      const rowConfig = SEAT_ROWS.find((r) => r.row === rowLetter)
      subtotal += rowConfig ? rowConfig.price : 250
    })

    const convenienceFee = selectedSeats.length ? 30 * selectedSeats.length : 0
    const gst = Math.round(convenienceFee * 0.18)
    const grandTotal = subtotal + convenienceFee + gst

    return { subtotal, convenienceFee, gst, grandTotal }
  }, [selectedSeats])

  // Proceed to Module 6 (Ticket Booking)
  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least 1 seat to continue.')
      return
    }

    navigate('/booking', {
      state: {
        movie: currentMovie,
        theatre: currentTheatre,
        date: selectedDate,
        time: selectedShowTime,
        seats: selectedSeats,
        pricing,
      },
    })
  }

  return (
    <div className="min-h-screen p-6 lg:p-8 flex flex-col gap-6 bg-[#08090e] text-white">

      {/* ── Top Bar Header (Clean - No 'Module 5' text) ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#121524] to-[#101320] border border-[#1e243b] p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Seat Layout & Auditorium Selection
          </h1>
          <p className="text-gray-400 text-xs mt-1">
            Choose your preferred seats, view ticket tiers, and reserve screening showtimes.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setSelectedSeats([])}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#161a29] border border-[#262c45] text-gray-300 hover:text-white text-xs font-semibold cursor-pointer transition-all hover:bg-[#1f243b]"
          >
            <RotateCcw size={14} />
            <span>Clear Selection</span>
          </button>
        </div>
      </div>

      {/* ── Screening Configuration Bar ── */}
      <div className="bg-[#111422] border border-[#1e243b] p-5 rounded-2xl shadow-lg space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Movie Picker */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 flex items-center gap-1.5">
              <Film size={14} className="text-[#e50914]" /> Movie Title
            </label>
            <select
              value={selectedMovieId}
              onChange={(e) => setSelectedMovieId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#161a29] border border-[#262c45] text-white text-sm focus:outline-none focus:border-[#e50914] cursor-pointer"
            >
              {INITIAL_MOVIES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title} ({m.certification})
                </option>
              ))}
            </select>
          </div>

          {/* Theatre Picker */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 flex items-center gap-1.5">
              <Building2 size={14} className="text-sky-400" /> Multiplex Venue
            </label>
            <select
              value={selectedTheatreId}
              onChange={(e) => setSelectedTheatreId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#161a29] border border-[#262c45] text-white text-sm focus:outline-none focus:border-[#e50914] cursor-pointer"
            >
              {INITIAL_THEATRES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} • {t.city}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 flex items-center gap-1.5">
              <Calendar size={14} className="text-emerald-400" /> Screening Date
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {DATES.map((d) => (
                <button
                  key={d.full}
                  onClick={() => setSelectedDate(d.full)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedDate === d.full
                      ? 'bg-[#e50914] text-white shadow-md shadow-red-600/30'
                      : 'bg-[#161a29] text-gray-400 hover:text-white border border-[#262c45]'
                  }`}
                >
                  <span className="block text-[10px] opacity-80">{d.day}</span>
                  <span className="block font-black">{d.date.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Showtime Picker */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 flex items-center gap-1.5">
              <Clock size={14} className="text-amber-400" /> Show Time & Audio
            </label>
            <select
              value={selectedShowTime}
              onChange={(e) => setSelectedShowTime(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#161a29] border border-[#262c45] text-white text-sm focus:outline-none focus:border-[#e50914] cursor-pointer"
            >
              <option value="10:15 AM">10:15 AM • Dolby Atmos</option>
              <option value="01:45 PM">01:45 PM • 4K Laser Projection</option>
              <option value="06:45 PM">06:45 PM • IMAX 3D Evening</option>
              <option value="09:45 PM">09:45 PM • VIP Night Show</option>
            </select>
          </div>

        </div>
      </div>

      {/* ── Main Layout: Screen & Seats Grid (Left) + Booking Summary (Right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── LEFT: Interactive Cinema Auditorium Matrix ── */}
        <div className="lg:col-span-2 bg-[#111422] border border-[#1e243b] p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col justify-between">

          {/* Curved Screen Visualization with Silver / Crimson Ambient Glow */}
          <div className="mb-10 text-center">
            <div className="relative mx-auto w-4/5 max-w-lg mb-2">
              <div className="h-2 rounded-t-full bg-gradient-to-r from-transparent via-[#e50914] to-transparent shadow-[0_0_25px_#e50914]" />
              <div className="h-8 bg-gradient-to-b from-red-600/15 to-transparent" />
            </div>
            <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em]">
              AUDITORIUM SCREEN • ALL EYES THIS WAY
            </p>
          </div>

          {/* Seat Rows Matrix */}
          <div className="space-y-4 overflow-x-auto py-2">
            {SEAT_ROWS.map(({ row, tier, price, seats, color }) => (
              <div key={row} className="flex items-center justify-center gap-3.5 min-w-[520px]">
                {/* Row Letter */}
                <span className="w-6 text-center text-xs font-black text-gray-500">
                  {row}
                </span>

                {/* Seats Container */}
                <div className="flex items-center gap-2">
                  {[...Array(seats)].map((_, idx) => {
                    const seatNum = idx + 1
                    const seatId = `${row}${seatNum}`
                    const isOccupied = INITIAL_OCCUPIED.includes(seatId)
                    const isSelected = selectedSeats.includes(seatId)

                    // Aisle separation gap
                    const isAisle = (seats === 12 && seatNum === 6) || (seats === 14 && (seatNum === 4 || seatNum === 10))

                    return (
                      <div key={seatId} className="flex items-center">
                        <button
                          type="button"
                          onClick={() => handleSeatClick(seatId)}
                          disabled={isOccupied}
                          title={`${seatId} (${tier} - ₹${price})`}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[11px] font-bold transition-all cursor-pointer ${
                            isOccupied
                              ? 'bg-[#151825] text-gray-600 border border-[#1f2438] cursor-not-allowed opacity-35'
                              : isSelected
                              ? 'bg-gradient-to-b from-[#ff3844] to-[#e50914] text-white shadow-[0_0_12px_rgba(229,9,20,0.6)] scale-110 ring-2 ring-white/40'
                              : 'bg-[#181c2d] hover:bg-[#252c47] border border-[#2a3250] text-gray-300 hover:text-white'
                          }`}
                        >
                          {isSelected ? <Check size={14} /> : seatNum}
                        </button>
                        {isAisle && <div className="w-5" />}
                      </div>
                    )
                  })}
                </div>

                {/* Tier & Price Badge */}
                <span className={`text-[10px] font-bold w-20 text-right ${color}`}>
                  ₹{price}
                </span>
              </div>
            ))}
          </div>

          {/* Seat Status Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 pt-5 border-t border-[#1b2034] text-xs">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-md bg-[#181c2d] border border-[#2a3250]" />
              <span className="text-gray-400">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-md bg-[#e50914] shadow-sm shadow-red-600/40" />
              <span className="text-white font-semibold">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-md bg-[#151825] border border-[#1f2438] opacity-50" />
              <span className="text-gray-500">Reserved</span>
            </div>

            <div className="hidden sm:block h-4 w-[1px] bg-[#22273d]" />

            <div className="flex items-center gap-3 text-gray-400 text-[11px]">
              <span className="flex items-center gap-1 font-bold text-amber-400">
                • Recliner VIP: ₹450
              </span>
              <span className="flex items-center gap-1 font-bold text-sky-400">
                • Prime: ₹280
              </span>
              <span className="flex items-center gap-1 font-bold text-emerald-400">
                • Classic: ₹180
              </span>
            </div>
          </div>

        </div>

        {/* ── RIGHT: Real-time Selection & Price Summary ── */}
        <div className="bg-[#111422] border border-[#1e243b] p-6 rounded-3xl shadow-xl flex flex-col justify-between space-y-6">

          {/* Movie Details Header */}
          <div className="flex gap-4 items-center pb-5 border-b border-[#1b2034]">
            <img
              src={currentMovie.poster}
              alt={currentMovie.title}
              className="w-16 h-24 object-cover rounded-xl shadow-md border border-[#232942] flex-shrink-0"
            />
            <div className="min-w-0">
              <span className="px-2 py-0.5 rounded-md bg-red-600/90 text-white text-[10px] font-bold">
                {currentMovie.certification || 'U/A'}
              </span>
              <h3 className="text-base font-extrabold text-white truncate mt-1">
                {currentMovie.title}
              </h3>
              <p className="text-xs text-gray-400 truncate mt-0.5">
                {currentTheatre.name}
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                {selectedDate} • {selectedShowTime}
              </p>
            </div>
          </div>

          {/* Selected Seats Chips */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Selected Seats ({selectedSeats.length})
              </span>
              <span className="text-xs font-bold text-[#e50914]">
                Max 8 Seats
              </span>
            </div>

            {selectedSeats.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#161a29] border border-[#232942] text-center text-xs text-gray-500">
                No seats selected. Click on the layout to choose.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-black"
                  >
                    Seat {s}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Pricing Breakdown */}
          <div className="p-4 rounded-2xl bg-[#161a29] border border-[#232942] space-y-2 text-xs">
            <div className="flex justify-between text-gray-400">
              <span>Tickets Base Fare ({selectedSeats.length})</span>
              <span className="text-white font-semibold">₹{pricing.subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Convenience Fee</span>
              <span className="text-white font-semibold">₹{pricing.convenienceFee}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Integrated GST (18%)</span>
              <span className="text-white font-semibold">₹{pricing.gst}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#252c47] text-sm font-bold">
              <span className="text-white">Payable Amount</span>
              <span className="text-[#e50914] text-lg font-black">
                ₹{pricing.grandTotal}
              </span>
            </div>
          </div>

          {/* Proceed Button */}
          <button
            onClick={handleProceed}
            disabled={selectedSeats.length === 0}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#e50914] to-[#ff2b38] hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold shadow-lg shadow-red-600/30 transition-all cursor-pointer active:scale-98"
          >
            <Ticket size={18} />
            <span>Proceed to Booking ({selectedSeats.length} Seats)</span>
            <ChevronRight size={16} />
          </button>

        </div>

      </div>

    </div>
  )
}

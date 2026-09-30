import { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
  Ticket,
  Film,
  Building2,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Tag,
  CreditCard,
  Plus,
  Minus,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Popcorn,
  Utensils,
  Coffee,
  CheckCircle2,
  X,
  MessageSquare,
  Gift,
  AlertCircle,
} from 'lucide-react'
import { INITIAL_MOVIES } from '../../data/moviesData'
import { INITIAL_THEATRES } from '../../data/theatresData'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'

// Cinema Concessions Menu Items
const CONCESSIONS = [
  {
    id: 'snk1',
    name: 'Jumbo Caramel Popcorn',
    category: 'Popcorn',
    price: 290,
    desc: 'Golden popped corn coated with warm caramelized sugar glaze',
    isVeg: true,
    tag: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=300&q=80',
  },
  {
    id: 'snk2',
    name: 'Classic Salted Butter Popcorn',
    category: 'Popcorn',
    price: 220,
    desc: 'Warm multiplex salted butter popcorn, freshly popped',
    isVeg: true,
    tag: null,
    image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=300&q=80',
  },
  {
    id: 'snk3',
    name: 'Loaded Jalapeño Nachos',
    category: 'Hot Bites',
    price: 240,
    desc: 'Crispy corn tortilla chips with warm spiced cheese dip & salsa',
    isVeg: true,
    tag: 'Popular',
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=300&q=80',
  },
  {
    id: 'snk4',
    name: 'Chilled Coca-Cola Fountain (500ml)',
    category: 'Beverages',
    price: 130,
    desc: 'Ice cold carbonated cola served with crushed ice',
    isVeg: true,
    tag: null,
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300&q=80',
  },
  {
    id: 'snk5',
    name: 'Cheesy Chicken Sausage Roll',
    category: 'Hot Bites',
    price: 260,
    desc: 'Flaky golden puff pastry filled with seasoned smoked chicken',
    isVeg: false,
    tag: 'Non-Veg',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=300&q=80',
  },
  {
    id: 'snk6',
    name: 'Cold Brew Iced Coffee',
    category: 'Beverages',
    price: 180,
    desc: 'Slow brewed Arabica coffee with chilled milk and syrup',
    isVeg: true,
    tag: null,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300&q=80',
  },
]

const QUICK_COUPONS = [
  { code: 'FILMAX50', label: 'Flat ₹50 OFF', desc: 'On orders above ₹500' },
  { code: 'STACKLY', label: '10% Cashback', desc: 'Student special pass' },
  { code: 'FIRST100', label: 'Flat ₹100 OFF', desc: 'Premier first booking' },
]

export default function BookingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  // Received payload from Seat Selection or defaults
  const bookingState = location.state || {}
  const movie = bookingState.movie || INITIAL_MOVIES[0]
  const theatre = bookingState.theatre || INITIAL_THEATRES[0]
  const date = bookingState.date || '2026-09-29'
  const time = bookingState.time || '06:45 PM'
  const seats = bookingState.seats || ['C4', 'C5']
  const initialPricing = bookingState.pricing || {
    subtotal: 560,
    convenienceFee: 60,
    gst: 11,
    grandTotal: 631,
  }

  // Active Concessions Filter
  const [activeCategory, setActiveCategory] = useState('All')

  // Concessions Quantities State
  const [concessionQty, setConcessionQty] = useState({
    snk1: 1,
    snk4: 2,
  })

  // Coupon state
  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState({ code: 'FILMAX50', discount: 50 })

  // WhatsApp E-Ticket updates toggle
  const [whatsappUpdates, setWhatsappUpdates] = useState(true)

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: user?.name || 'Rahul Sharma',
      email: user?.email || 'rahul.s@stackly.edu',
      phone: '9876543210',
      notes: '',
    },
  })

  // Concession quantity handlers
  const updateConcession = (id, delta) => {
    setConcessionQty((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }))
  }

  // Filtered concessions
  const filteredConcessions = useMemo(() => {
    if (activeCategory === 'All') return CONCESSIONS
    return CONCESSIONS.filter((c) => c.category === activeCategory)
  }, [activeCategory])

  // Total Concessions Calculation
  const concessionsTotal = useMemo(() => {
    return CONCESSIONS.reduce((sum, item) => sum + (concessionQty[item.id] || 0) * item.price, 0)
  }, [concessionQty])

  // Selected concessions list
  const selectedItemsList = useMemo(() => {
    return CONCESSIONS.filter((c) => concessionQty[c.id] > 0).map((c) => ({
      ...c,
      quantity: concessionQty[c.id],
    }))
  }, [concessionQty])

  // Promo Code Validation
  const handleApplyCouponCode = (codeToApply) => {
    const code = (codeToApply || couponInput).trim().toUpperCase()

    if (code === 'FILMAX50') {
      setAppliedCoupon({ code: 'FILMAX50', discount: 50 })
      toast.success('Coupon FILMAX50 applied! Saved ₹50')
    } else if (code === 'STACKLY') {
      const discount = Math.round(initialPricing.subtotal * 0.1)
      setAppliedCoupon({ code: 'STACKLY', discount })
      toast.success(`Coupon STACKLY applied! Saved ₹${discount} (10%)`)
    } else if (code === 'FIRST100') {
      setAppliedCoupon({ code: 'FIRST100', discount: 100 })
      toast.success('Coupon FIRST100 applied! Saved ₹100')
    } else {
      toast.error('Invalid promo code. Try FILMAX50, STACKLY, or FIRST100')
    }
  }

  // Final Calculations
  const finalPricing = useMemo(() => {
    const ticketsBase = initialPricing.subtotal || 560
    const fee = initialPricing.convenienceFee || 60
    const gst = initialPricing.gst || 11
    const discount = appliedCoupon ? appliedCoupon.discount : 0
    const total = Math.max(0, ticketsBase + concessionsTotal + fee + gst - discount)

    return {
      ticketsBase,
      concessionsTotal,
      fee,
      gst,
      discount,
      total,
    }
  }, [initialPricing, concessionsTotal, appliedCoupon])

  // Form Submit -> Proceed to Payment
  const onSubmit = (formData) => {
    navigate('/payment', {
      state: {
        movie,
        theatre,
        date,
        time,
        seats,
        customer: {
          ...formData,
          whatsappUpdates,
        },
        snacks: selectedItemsList,
        pricing: finalPricing,
      },
    })
  }

  return (
    <div className="min-h-screen p-6 lg:p-8 flex flex-col gap-6 bg-[#08090e] text-white">

      {/* ── TOP BREADCRUMB JOURNEY STEPPER ─────────────────────────────────── */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#101322] border border-[#1d2238] shadow-lg">
        <div className="flex items-center gap-6 sm:gap-10 overflow-x-auto text-xs font-semibold">
          {/* Step 1 */}
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-xs">
              ✓
            </span>
            <span className="whitespace-nowrap">Seats Selected ({seats.length})</span>
          </div>

          <ChevronRight size={14} className="text-gray-600 flex-shrink-0" />

          {/* Step 2 (Active) */}
          <div className="flex items-center gap-2 text-white">
            <span className="w-6 h-6 rounded-full bg-[#e50914] text-white flex items-center justify-center font-black text-xs shadow-[0_0_10px_#e50914]">
              2
            </span>
            <span className="font-bold text-[#e50914] whitespace-nowrap">
              Guest Details & Concessions
            </span>
          </div>

          <ChevronRight size={14} className="text-gray-600 flex-shrink-0" />

          {/* Step 3 */}
          <div className="flex items-center gap-2 text-gray-500">
            <span className="w-6 h-6 rounded-full bg-[#181c2d] border border-[#272e48] flex items-center justify-center text-gray-500 font-bold text-xs">
              3
            </span>
            <span className="whitespace-nowrap">Payment & E-Ticket</span>
          </div>
        </div>

        {/* Change Seats Shortcut */}
        <button
          onClick={() => navigate('/seats', { state: { movieId: movie.id, theatreId: theatre.id } })}
          className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 hover:text-white font-medium cursor-pointer transition-colors"
        >
          <ChevronLeft size={14} />
          <span>Change Seats</span>
        </button>
      </div>

      {/* ── CINEMATIC SCREENING STRIP HERO ─────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#141727] via-[#101321] to-[#161224] border border-[#1e243b] p-6 lg:p-7 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-16 h-24 object-cover rounded-2xl shadow-xl border border-white/10 flex-shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2.5 py-0.5 rounded-md bg-[#e50914] text-white text-[10px] font-black uppercase">
                  {movie.language}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#1d2338] text-gray-300 text-[10px] font-bold border border-[#2a3352]">
                  {movie.certification || 'U/A'}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  {movie.duration}
                </span>
              </div>

              <h1 className="text-2xl font-black text-white tracking-tight">{movie.title}</h1>

              <div className="flex items-center gap-3 text-xs text-gray-400 mt-1 flex-wrap">
                <span className="flex items-center gap-1 text-gray-300 font-medium">
                  <Building2 size={13} className="text-sky-400" />
                  {theatre.name}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-gray-300 font-medium">
                  <Calendar size={13} className="text-emerald-400" />
                  {date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-gray-300 font-medium">
                  <Clock size={13} className="text-amber-400" />
                  {time}
                </span>
              </div>
            </div>
          </div>

          {/* Reserved Seats Pill in Hero */}
          <div className="flex flex-col sm:items-end justify-center border-t sm:border-t-0 sm:border-l border-[#222942] sm:pl-6 pt-3 sm:pt-0">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Your Reserved Seats
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {seats.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 rounded-xl bg-gradient-to-b from-[#ff3844] to-[#e50914] text-white text-xs font-black shadow-md shadow-red-600/30"
                >
                  {s}
                </span>
              ))}
            </div>
            <span className="text-[11px] text-gray-400 mt-1">Screen 4 • Dolby Atmos</span>
          </div>
        </div>
      </div>

      {/* ── MAIN RESERVATION WORKSPACE: 2-COLUMN SPLIT ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">

        {/* ── LEFT COLUMN (2/3): Guest Details + Concessions Menu ── */}
        <div className="lg:col-span-2 space-y-7">

          {/* 1. GUEST ATTENDEE FORM */}
          <div className="rounded-3xl bg-[#111422] border border-[#1e243b] p-6 lg:p-7 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b2034]">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <User size={18} className="text-[#e50914]" /> Attendee Contact Information
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Admission pass and invoice receipt will be delivered instantly to these credentials.
                </p>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Verified Attendee
              </span>
            </div>

            <form id="reservation-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                    Lead Guest Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...register('fullName', { required: 'Attendee name is required' })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#151928] border border-[#242b45] text-white text-sm focus:border-[#e50914] focus:outline-none transition-all"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                    Email Address (For E-Ticket Pass) *
                  </label>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
                    })}
                    placeholder="name@company.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#151928] border border-[#242b45] text-white text-sm focus:border-[#e50914] focus:outline-none transition-all"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                    Mobile Number (SMS Entry Barcode) *
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-gray-400 text-xs font-bold">
                      +91
                    </span>
                    <input
                      type="tel"
                      {...register('phone', {
                        required: 'Phone number is required',
                        minLength: { value: 10, message: 'Enter a valid 10-digit number' },
                      })}
                      placeholder="98765 43210"
                      className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-[#151928] border border-[#242b45] text-white text-sm focus:border-[#e50914] focus:outline-none transition-all"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                    Auditorium Access / Special Notes (Optional)
                  </label>
                  <input
                    type="text"
                    {...register('notes')}
                    placeholder="e.g. Wheelchair assistance, aisle preference"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#151928] border border-[#242b45] text-white text-sm focus:border-[#e50914] focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* WhatsApp updates checkbox */}
              <div className="pt-1">
                <label className="flex items-center gap-2.5 text-xs text-gray-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={whatsappUpdates}
                    onChange={(e) => setWhatsappUpdates(e.target.checked)}
                    className="w-4 h-4 rounded text-[#e50914] bg-[#151928] border-[#252b45] focus:ring-0 cursor-pointer accent-[#e50914]"
                  />
                  <span className="flex items-center gap-1.5 font-medium">
                    <MessageSquare size={13} className="text-emerald-400" />
                    Send digital boarding pass & QR code directly to WhatsApp
                  </span>
                </label>
              </div>
            </form>
          </div>

          {/* 2. GOURMET CINEMA CONCESSIONS (FOOD & BEVERAGES) */}
          <div className="rounded-3xl bg-[#111422] border border-[#1e243b] p-6 lg:p-7 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1b2034]">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Popcorn size={19} className="text-amber-400" /> Cinema Concessions & Refreshments
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Delivered fresh directly to your seat before screening starts.
                </p>
              </div>

              {concessionsTotal > 0 && (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 self-start sm:self-auto">
                  ₹{concessionsTotal} Added
                </span>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {['All', 'Popcorn', 'Hot Bites', 'Beverages'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#e50914] text-white shadow-md shadow-red-600/25'
                      : 'bg-[#151928] text-gray-400 hover:text-white border border-[#232942]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Concession Item Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredConcessions.map((item) => {
                const qty = concessionQty[item.id] || 0
                const isSelected = qty > 0

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3.5 shadow-sm ${
                      isSelected
                        ? 'bg-[#161a2c] border-[#e50914]/60 shadow-lg shadow-red-950/20'
                        : 'bg-[#151928] border-[#22283d] hover:border-[#323b5c]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-xl border border-white/10 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full flex-shrink-0 ${
                              item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          <p className="text-sm font-bold text-white truncate">{item.name}</p>
                        </div>
                        <p className="text-[11px] text-gray-400 truncate mt-0.5">{item.desc}</p>
                        <p className="text-xs font-black text-[#e50914] mt-1">₹{item.price}</p>
                      </div>
                    </div>

                    {/* Interactive Stepper */}
                    <div className="flex items-center gap-2 bg-[#0c0e18] px-2.5 py-1.5 rounded-xl border border-[#242b45] flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => updateConcession(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white rounded hover:bg-[#1a1f33] transition-all cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-5 text-center text-xs font-black text-white">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateConcession(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white rounded hover:bg-[#1a1f33] transition-all cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 3. PROMO CODE VOUCHERS */}
          <div className="rounded-3xl bg-[#111422] border border-[#1e243b] p-6 lg:p-7 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Tag size={16} className="text-[#e50914]" /> Available Coupons & Discounts
            </h2>

            {/* Quick Tap Coupons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {QUICK_COUPONS.map((cpn) => {
                const isApplied = appliedCoupon?.code === cpn.code
                return (
                  <button
                    key={cpn.code}
                    type="button"
                    onClick={() => handleApplyCouponCode(cpn.code)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isApplied
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                        : 'bg-[#151928] border-[#22283d] hover:border-[#38426b] text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs">{cpn.code}</span>
                      {isApplied && <CheckCircle2 size={14} className="text-emerald-400" />}
                    </div>
                    <p className="text-[11px] font-semibold text-white mt-1">{cpn.label}</p>
                    <p className="text-[10px] text-gray-400">{cpn.desc}</p>
                  </button>
                )
              })}
            </div>

            {/* Custom Input */}
            <div className="flex gap-2.5 pt-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Enter custom coupon code..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#151928] border border-[#242b45] text-white text-xs uppercase font-medium focus:outline-none focus:border-[#e50914]"
              />
              <button
                type="button"
                onClick={() => handleApplyCouponCode()}
                className="px-5 py-2.5 rounded-xl bg-[#1c2238] hover:bg-[#262e4c] text-white text-xs font-bold transition-all cursor-pointer border border-[#2b3454]"
              >
                Apply
              </button>
            </div>

            {appliedCoupon && (
              <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <Sparkles size={14} /> Coupon applied: {appliedCoupon.code}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-black">-₹{appliedCoupon.discount}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAppliedCoupon(null)
                      toast.info('Coupon removed.')
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ── RIGHT COLUMN (1/3): REALISTIC CINEMA TICKET STUB SUMMARY ─────── */}
        <div className="flex flex-col gap-6">

          {/* Ticket Stub Card */}
          <div className="relative rounded-3xl bg-[#111422] border border-[#1e243b] shadow-2xl overflow-hidden">

            {/* Ticket Header Banner */}
            <div className="px-6 pt-6 pb-4 bg-gradient-to-r from-[#e50914] to-[#ff2b38] text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] opacity-85">
                  FILMAX CINEMA PASS
                </span>
                <Ticket size={20} />
              </div>
              <h3 className="text-lg font-black truncate">{movie.title}</h3>
              <p className="text-xs opacity-90 truncate mt-0.5">{theatre.name}</p>
            </div>

            {/* Perforated Divider Strip with Notch Cutouts */}
            <div className="relative h-6 flex items-center justify-center bg-[#111422]">
              <div className="w-full border-t border-dashed border-[#262c45]" />
              {/* Left Notch */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#08090e] border-r border-[#1e243b]" />
              {/* Right Notch */}
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#08090e] border-l border-[#1e243b]" />
            </div>

            {/* Ticket Details Body */}
            <div className="p-6 pt-4 flex flex-col gap-5">

              {/* Show Timing Matrix */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-[#151928] border border-[#22283d]">
                  <span className="text-[10px] text-gray-400 font-semibold block uppercase">DATE</span>
                  <span className="font-bold text-white">{date}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#151928] border border-[#22283d]">
                  <span className="text-[10px] text-gray-400 font-semibold block uppercase">TIME</span>
                  <span className="font-bold text-[#e50914]">{time}</span>
                </div>
              </div>

              {/* Reserved Seats Chips */}
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Seats Assigned ({seats.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {seats.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-black"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Concessions ordered list */}
              {selectedItemsList.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                    Concessions Added ({selectedItemsList.length})
                  </span>
                  <div className="space-y-1.5">
                    {selectedItemsList.map((item) => (
                      <div key={item.id} className="flex justify-between text-xs text-gray-300">
                        <span>{item.name} × {item.quantity}</span>
                        <span className="font-bold text-white">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Itemized Fare Breakdown */}
              <div className="p-4 rounded-2xl bg-[#151928] border border-[#22283d] space-y-2 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Tickets Subtotal</span>
                  <span className="text-white font-semibold">₹{finalPricing.ticketsBase}</span>
                </div>

                {finalPricing.concessionsTotal > 0 && (
                  <div className="flex justify-between text-gray-400">
                    <span>F&B Refreshments</span>
                    <span className="text-amber-400 font-semibold">+₹{finalPricing.concessionsTotal}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-400">
                  <span>Convenience Fee</span>
                  <span className="text-white font-semibold">₹{finalPricing.fee}</span>
                </div>

                <div className="flex justify-between text-gray-400">
                  <span>Integrated GST (18%)</span>
                  <span className="text-white font-semibold">₹{finalPricing.gst}</span>
                </div>

                {finalPricing.discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Promo Discount ({appliedCoupon.code})</span>
                    <span>-₹{finalPricing.discount}</span>
                  </div>
                )}

                <div className="flex justify-between pt-2.5 border-t border-[#252c47] text-sm font-bold">
                  <span className="text-white">Total Amount</span>
                  <span className="text-[#e50914] text-xl font-black">
                    ₹{finalPricing.total}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                form="reservation-form"
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-[#e50914] to-[#ff2b38] hover:brightness-110 text-white text-sm font-bold shadow-lg shadow-red-600/35 transition-all cursor-pointer active:scale-98"
              >
                <CreditCard size={18} />
                <span>Confirm & Pay ₹{finalPricing.total}</span>
                <ChevronRight size={16} />
              </button>

              <div className="flex items-center justify-center gap-2 text-gray-500 text-[11px]">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>Instant Ticket Issuance • Free Cancellation</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

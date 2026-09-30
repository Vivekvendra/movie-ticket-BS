import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  CreditCard,
  QrCode,
  Building,
  Wallet,
  ShieldCheck,
  CheckCircle,
  Clock,
  Printer,
  ChevronRight,
  Ticket,
  Receipt,
  RotateCw,
} from 'lucide-react'
import { INITIAL_MOVIES } from '../../data/moviesData'
import { INITIAL_THEATRES } from '../../data/theatresData'
import { toast } from 'react-toastify'

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI / QR Code', icon: QrCode, badge: 'Fastest' },
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, badge: null },
  { id: 'netbanking', label: 'Net Banking', icon: Building, badge: null },
  { id: 'wallet', label: 'Digital Wallets', icon: Wallet, badge: null },
]

const NET_BANKS = ['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra']

export default function PaymentPage() {
  const navigate = useNavigate()
  const location = useLocation()

  // Received payload from Module 6 (Booking) or defaults
  const state = location.state || {}
  const movie = state.movie || INITIAL_MOVIES[0]
  const theatre = state.theatre || INITIAL_THEATRES[0]
  const date = state.date || '2026-09-29'
  const time = state.time || '06:45 PM'
  const seats = state.seats || ['C4', 'C5']
  const customer = state.customer || {
    fullName: 'Rahul Sharma',
    email: 'rahul.s@stackly.edu',
    phone: '9876543210',
  }
  const snacks = state.snacks || []
  const pricing = state.pricing || {
    ticketsBase: 560,
    snackTotal: 530,
    fee: 60,
    gst: 11,
    discount: 50,
    total: 1111,
  }

  // Active method
  const [activeMethod, setActiveMethod] = useState('upi')
  const [upiOption, setUpiOption] = useState('qr') // 'qr' | 'id'
  const [upiIdInput, setUpiIdInput] = useState('')
  const [selectedBank, setSelectedBank] = useState(NET_BANKS[0])

  // Card Inputs
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [cardName, setCardName] = useState(customer.fullName || '')

  // Reservation Timer (10 minutes countdown)
  const [timeLeft, setTimeLeft] = useState(600) // 10 mins

  // Processing & Confirmation Modal State
  const [isProcessing, setIsProcessing] = useState(false)
  const [confirmedBooking, setConfirmedBooking] = useState(null)
  const [viewHistoryTab, setViewHistoryTab] = useState(false)

  // Local storage payment transactions list
  const [pastPayments, setPastPayments] = useState([])

  // Load existing payments on mount
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('cinebook_payments') || '[]')
      setPastPayments(stored)
    } catch {
      setPastPayments([])
    }
  }, [])

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const formattedTimer = useMemo(() => {
    const mins = Math.floor(timeLeft / 60)
    const secs = timeLeft % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [timeLeft])

  // Format Card Number input with spaces
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const parts = raw.match(/.{1,4}/g)
    setCardNumber(parts ? parts.join(' ').substring(0, 19) : '')
  }

  // Format Expiry MM/YY
  const handleExpiryChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').substring(0, 4)
    if (raw.length >= 3) {
      setCardExpiry(`${raw.substring(0, 2)}/${raw.substring(2, 4)}`)
    } else {
      setCardExpiry(raw)
    }
  }

  // Handle Payment Submit
  const handlePay = async (e) => {
    e.preventDefault()

    if (activeMethod === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 16) {
        toast.error('Please enter a valid 16-digit card number.')
        return
      }
      if (!cardExpiry || cardExpiry.length < 5) {
        toast.error('Please enter card expiry in MM/YY format.')
        return
      }
      if (!cardCvv || cardCvv.length < 3) {
        toast.error('Please enter a valid 3-digit CVV.')
        return
      }
    }

    setIsProcessing(true)

    // Simulate Payment Gateway Network Call
    await new Promise((r) => setTimeout(r, 1400))

    const bookingRef = `FLX-${Math.floor(100000 + Math.random() * 900000)}`
    const transactionId = `TXN_${Date.now()}`

    const newRecord = {
      bookingId: bookingRef,
      transactionId,
      paidAt: new Date().toLocaleString(),
      movieTitle: movie.title,
      poster: movie.poster,
      theatreName: theatre.name,
      screens: theatre.screens,
      date,
      time,
      seats,
      customer,
      snacks,
      pricing,
      paymentMethod: activeMethod.toUpperCase(),
      status: 'Paid & Confirmed',
    }

    // Save to LocalStorage
    try {
      const existing = JSON.parse(localStorage.getItem('cinebook_payments') || '[]')
      const updated = [newRecord, ...existing]
      localStorage.setItem('cinebook_payments', JSON.stringify(updated))
      setPastPayments(updated)

      // Also append to bookings list for history and dashboard
      const existingBookings = JSON.parse(localStorage.getItem('cinebook_bookings') || '[]')
      localStorage.setItem('cinebook_bookings', JSON.stringify([newRecord, ...existingBookings]))
    } catch {
      // ignore
    }

    setIsProcessing(false)
    setConfirmedBooking(newRecord)
    toast.success('Payment authorized! Your seats are booked.')
  }

  return (
    <div className="min-h-screen p-6 lg:p-8 flex flex-col gap-6 bg-[#08090e] text-white">

      {/* ── Top Header & Tab Switcher (Clean - No 'Module 7' text) ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#121524] to-[#101320] border border-[#1e243b] p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Checkout & Payment Gateway
          </h1>
          <p className="text-gray-400 text-xs mt-1">
            256-bit SSL encrypted transactions powered by PCI-DSS certified gateway.
          </p>
        </div>

        {/* View Switcher: Make Payment vs Transactions */}
        <div className="flex items-center gap-2 bg-[#161a29] p-1.5 rounded-2xl border border-[#252b45]">
          <button
            onClick={() => setViewHistoryTab(false)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              !viewHistoryTab ? 'bg-[#e50914] text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            Payment Terminal
          </button>
          <button
            onClick={() => setViewHistoryTab(true)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewHistoryTab ? 'bg-[#e50914] text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            Payment Receipts ({pastPayments.length})
          </button>
        </div>
      </div>

      {/* ── VIEW: PAST RECEIPTS & TRANSACTIONS ── */}
      {viewHistoryTab ? (
        <div className="bg-[#111422] border border-[#1e243b] p-6 sm:p-7 rounded-3xl shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1b2034]">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Receipt size={18} className="text-[#e50914]" /> Transaction History & Generated Invoices
            </h2>
            <span className="text-xs text-gray-400">{pastPayments.length} Completed Bookings</span>
          </div>

          {pastPayments.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No transactions recorded yet. Complete your first ticket payment to see generated invoices here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#181d30] text-gray-400 font-semibold">
                    <th className="pb-3 pr-4">Booking Ref</th>
                    <th className="pb-3 pr-4">Movie</th>
                    <th className="pb-3 pr-4">Venue & Date</th>
                    <th className="pb-3 pr-4">Seats</th>
                    <th className="pb-3 pr-4">Method</th>
                    <th className="pb-3 pr-4">Total Paid</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pastPayments.map((p) => (
                    <tr key={p.bookingId} className="border-b border-[#151928] hover:bg-[#161a2b] transition-colors">
                      <td className="py-3.5 pr-4 font-mono font-bold text-[#e50914]">{p.bookingId}</td>
                      <td className="py-3.5 pr-4 font-semibold text-white">{p.movieTitle}</td>
                      <td className="py-3.5 pr-4 text-gray-400">
                        {p.theatreName} <br />
                        <span className="text-[10px] text-gray-500">{p.date} • {p.time}</span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 font-bold">
                          {p.seats.join(', ')}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 text-gray-300 font-medium">{p.paymentMethod}</td>
                      <td className="py-3.5 pr-4 font-black text-white">₹{p.pricing?.total}</td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => setConfirmedBooking(p)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#1b2034] hover:bg-[#252c48] text-white text-[11px] font-bold transition-all cursor-pointer border border-[#2a3352]"
                        >
                          View E-Ticket
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* ── VIEW: CHECKOUT & PAYMENT METHODS ── */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT: Payment Methods Selector & Form ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Countdown Hold Banner */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs">
              <div className="flex items-center gap-2 font-medium">
                <Clock size={16} className="animate-pulse" />
                <span>Seats are temporarily held for you. Complete payment before timeout:</span>
              </div>
              <span className="font-mono font-black text-sm bg-amber-500/20 px-3 py-1 rounded-xl">
                {formattedTimer}
              </span>
            </div>

            {/* Payment Method Tabs */}
            <div className="bg-[#111422] border border-[#1e243b] p-6 sm:p-7 rounded-3xl shadow-xl space-y-6">
              <div>
                <h2 className="text-base font-extrabold text-white mb-3 tracking-tight">
                  Select Payment Method
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PAYMENT_METHODS.map(({ id, label, icon: Icon, badge }) => (
                    <button
                      key={id}
                      onClick={() => setActiveMethod(id)}
                      className={`relative flex flex-col items-center gap-2.5 p-4 rounded-2xl border transition-all cursor-pointer ${
                        activeMethod === id
                          ? 'bg-[#1b2034] border-[#e50914] text-white shadow-md'
                          : 'bg-[#151928] border-[#22283d] text-gray-400 hover:text-white hover:border-[#2f385c]'
                      }`}
                    >
                      {badge && (
                        <span className="absolute -top-2 right-2 text-[9px] font-black px-1.5 py-0.2 rounded-full bg-[#e50914] text-white uppercase">
                          {badge}
                        </span>
                      )}
                      <Icon size={20} className={activeMethod === id ? 'text-[#e50914]' : ''} />
                      <span className="text-xs font-bold">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Payment Method Forms */}
              <div className="p-5 rounded-2xl bg-[#161a29] border border-[#232942]">

                {/* 1. UPI Payment Interface */}
                {activeMethod === 'upi' && (
                  <div className="space-y-4">
                    <div className="flex gap-2 pb-3 border-b border-[#242b45]">
                      <button
                        onClick={() => setUpiOption('qr')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                          upiOption === 'qr' ? 'bg-[#e50914] text-white shadow' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Dynamic UPI QR Code
                      </button>
                      <button
                        onClick={() => setUpiOption('id')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                          upiOption === 'id' ? 'bg-[#e50914] text-white shadow' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Enter UPI VPA / ID
                      </button>
                    </div>

                    {upiOption === 'qr' ? (
                      <div className="flex flex-col items-center text-center p-4">
                        <div className="w-48 h-48 p-3 rounded-2xl bg-white flex items-center justify-center shadow-2xl mb-3">
                          <img
                            src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=filmax@cinepay&pn=FilmaxCinemas&am=1111&cu=INR"
                            alt="Scan UPI QR"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <p className="text-xs font-bold text-white">Scan with any UPI app</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Google Pay, PhonePe, Paytm, CRED or BHIM
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                          <RotateCw size={13} className="animate-spin" />
                          <span>Awaiting real-time payment authorization…</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <label className="block text-xs font-semibold text-gray-400">
                          Enter your UPI ID (Virtual Payment Address)
                        </label>
                        <div className="flex gap-2.5">
                          <input
                            type="text"
                            value={upiIdInput}
                            onChange={(e) => setUpiIdInput(e.target.value)}
                            placeholder="username@okhdfcbank"
                            className="flex-1 px-4 py-2.5 rounded-xl bg-[#111422] border border-[#2b3352] text-white text-sm focus:border-[#e50914] focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => toast.info('Collect request dispatched to UPI App')}
                            className="px-5 py-2.5 rounded-xl bg-[#1b2034] text-white text-xs font-bold hover:bg-[#252c48] cursor-pointer border border-[#2a3352]"
                          >
                            Verify VPA
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Credit / Debit Card Interface */}
                {activeMethod === 'card' && (
                  <form onSubmit={handlePay} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4532 •••• •••• 8892"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#111422] border border-[#2b3352] text-white text-sm focus:border-[#e50914] focus:outline-none font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1">
                          Valid Thru
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#111422] border border-[#2b3352] text-white text-sm focus:border-[#e50914] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1">
                          CVV / CVC
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                          placeholder="•••"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#111422] border border-[#2b3352] text-white text-sm focus:border-[#e50914] focus:outline-none"
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-xs font-semibold text-gray-400 mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="Name on card"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#111422] border border-[#2b3352] text-white text-sm focus:border-[#e50914] focus:outline-none"
                        />
                      </div>
                    </div>
                  </form>
                )}

                {/* 3. Net Banking */}
                {activeMethod === 'netbanking' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-gray-400">
                      Choose Your Bank
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {NET_BANKS.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setSelectedBank(b)}
                          className={`p-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                            selectedBank === b
                              ? 'bg-[#e50914] text-white border-transparent shadow'
                              : 'bg-[#111422] border-[#22283d] text-gray-300 hover:text-white'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Digital Wallets */}
                {activeMethod === 'wallet' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-gray-400">
                      Select Linked Wallet
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Paytm Wallet', 'Amazon Pay', 'MobiKwik', 'Freecharge'].map((w) => (
                        <button
                          key={w}
                          type="button"
                          className="p-3 rounded-xl bg-[#111422] border border-[#22283d] hover:border-[#e50914] text-white text-xs font-bold text-center cursor-pointer transition-all"
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Pay Now Button */}
              <button
                type="button"
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-[#e50914] to-[#ff2b38] hover:brightness-110 disabled:opacity-50 text-white text-sm font-bold shadow-lg shadow-red-600/30 transition-all cursor-pointer active:scale-98"
              >
                {isProcessing ? (
                  <>
                    <RotateCw size={18} className="animate-spin" />
                    <span>Authorizing Transaction…</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    <span>Authorize & Pay ₹{pricing.total}</span>
                    <ChevronRight size={16} />
                  </>
                )}
              </button>
            </div>

          </div>

          {/* ── RIGHT: Order Summary Card ── */}
          <div className="space-y-6">
            <div className="bg-[#111422] border border-[#1e243b] p-6 sm:p-7 rounded-3xl shadow-xl space-y-5">
              <h2 className="text-base font-extrabold text-white border-b border-[#1b2034] pb-3">
                Order Summary
              </h2>

              <div className="flex gap-3.5 items-start">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-16 h-24 object-cover rounded-xl border border-[#252b45] flex-shrink-0 shadow-md"
                />
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">{movie.title}</h3>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{theatre.name}</p>
                  <p className="text-[11px] text-gray-500 mt-1 font-medium">
                    {date} • {time}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {seats.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-red-500/15 text-red-400 text-[10px] font-black">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cost breakdown */}
              <div className="p-4 rounded-2xl bg-[#161a29] border border-[#232942] space-y-2 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Tickets Base ({seats.length})</span>
                  <span className="text-white font-semibold">₹{pricing.ticketsBase}</span>
                </div>
                {pricing.snackTotal > 0 && (
                  <div className="flex justify-between text-gray-400">
                    <span>F&B Refreshments</span>
                    <span className="text-amber-400 font-semibold">+₹{pricing.snackTotal}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-400">
                  <span>Convenience Fee</span>
                  <span className="text-white font-semibold">₹{pricing.fee}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>GST (18%)</span>
                  <span className="text-white font-semibold">₹{pricing.gst}</span>
                </div>
                {pricing.discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Discount</span>
                    <span>-₹{pricing.discount}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2.5 border-t border-[#252c47] text-sm font-bold">
                  <span className="text-white">Amount Payable</span>
                  <span className="text-[#e50914] text-lg font-black">₹{pricing.total}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#151928] border border-[#22283d] flex items-center gap-3 text-xs text-gray-400">
                <ShieldCheck size={20} className="text-emerald-400 flex-shrink-0" />
                <span>PCI-DSS Level 1 Encrypted • 100% Secure Checkout</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ── MODAL: CONFIRMED E-TICKET & TAX INVOICE ── */}
      {confirmedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#111422] border border-[#2c3452] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">

            {/* Success Header */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-2xl font-black text-white">Booking Confirmed!</h2>
              <p className="text-gray-400 text-xs">
                Your admission pass has been dispatched to{' '}
                <span className="text-white font-semibold">{confirmedBooking.customer?.email}</span>
              </p>
            </div>

            {/* E-Ticket Card Layout */}
            <div className="rounded-3xl bg-[#151928] border border-[#252b45] overflow-hidden shadow-xl">

              {/* Top Banner */}
              <div className="p-4 bg-gradient-to-r from-[#e50914] to-[#ff2b38] flex items-center justify-between text-white">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">FILMAX E-TICKET PASS</p>
                  <p className="text-sm font-black tracking-wider">BOOKING REF: {confirmedBooking.bookingId}</p>
                </div>
                <Ticket size={24} />
              </div>

              {/* Ticket Body */}
              <div className="p-5 space-y-4">
                <div className="flex gap-4 items-center">
                  <img
                    src={confirmedBooking.poster}
                    alt={confirmedBooking.movieTitle}
                    className="w-16 h-24 object-cover rounded-xl border border-white/10 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-white leading-tight">
                      {confirmedBooking.movieTitle}
                    </h3>
                    <p className="text-xs text-gray-300 mt-1">{confirmedBooking.theatreName}</p>
                    <p className="text-xs text-[#e50914] font-semibold mt-1">
                      {confirmedBooking.date} • {confirmedBooking.time}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Attendee: {confirmedBooking.customer?.fullName} (+91 {confirmedBooking.customer?.phone})
                    </p>
                  </div>
                </div>

                {/* Perforated Divider */}
                <div className="relative my-3">
                  <div className="border-t border-dashed border-[#2b3352]" />
                </div>

                {/* Seats and Info Matrix */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-2.5 rounded-xl bg-[#0f111d] border border-[#20263d]">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">SEATS</span>
                    <span className="text-sm font-black text-white">{confirmedBooking.seats.join(', ')}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0f111d] border border-[#20263d]">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">HALL</span>
                    <span className="text-sm font-black text-white">SCREEN 3</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0f111d] border border-[#20263d]">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">PAID</span>
                    <span className="text-sm font-black text-emerald-400">₹{confirmedBooking.pricing?.total}</span>
                  </div>
                </div>

                {/* Simulated Barcode */}
                <div className="pt-2 text-center">
                  <div className="h-10 mx-auto w-3/4 flex items-center justify-between opacity-80 px-2">
                    {[...Array(32)].map((_, i) => (
                      <div
                        key={i}
                        className={`bg-white h-full ${i % 3 === 0 ? 'w-1' : i % 5 === 0 ? 'w-1.5' : 'w-0.5'}`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] font-mono text-gray-500 tracking-[0.3em] mt-1">
                    {confirmedBooking.bookingId} • SCAN AT ENTRANCE
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#161a29] hover:bg-[#1f243b] border border-[#262c45] text-white text-xs font-bold transition-all cursor-pointer"
              >
                <Printer size={15} />
                <span>Print / Save PDF</span>
              </button>

              <button
                onClick={() => {
                  setConfirmedBooking(null)
                  navigate('/movies')
                }}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#e50914] to-[#ff2b38] hover:brightness-110 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-red-600/30"
              >
                <span>Book Another Movie</span>
                <ChevronRight size={15} />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

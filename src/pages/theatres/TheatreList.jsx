import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Search,
  Clock,
  ChevronRight,
  ChevronLeft,
  X,
  Plus,
  Ticket,
  CheckCircle,
  Eye,
  SlidersHorizontal,
  Star,
} from 'lucide-react'
import { INITIAL_THEATRES } from '../../data/theatresData'
import { toast } from 'react-toastify'

const CITIES = ['All', 'Hyderabad', 'Mumbai', 'Bengaluru', 'Delhi', 'Chennai', 'Pune']
const AMENITY_FILTERS = ['All', 'IMAX', '4DX', 'Dolby Atmos', 'Recliner']

export default function TheatreList() {
  const navigate = useNavigate()
  const [theatres, setTheatres] = useState(INITIAL_THEATRES)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('All')
  const [selectedAmenity, setSelectedAmenity] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Detail Modal
  const [activeTheatre, setActiveTheatre] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Add Theatre State
  const [newTheatre, setNewTheatre] = useState({
    name: '',
    city: 'Hyderabad',
    area: '',
    address: '',
    screens: 6,
    phone: '',
    email: '',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80',
  })

  // Filter & Search Logic
  const filteredTheatres = useMemo(() => {
    return theatres.filter((th) => {
      const matchesSearch =
        th.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        th.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        th.city.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCity = selectedCity === 'All' || th.city.toLowerCase() === selectedCity.toLowerCase()

      const matchesAmenity =
        selectedAmenity === 'All' ||
        th.facilities.some((f) => f.toLowerCase().includes(selectedAmenity.toLowerCase()))

      return matchesSearch && matchesCity && matchesAmenity
    })
  }, [theatres, searchQuery, selectedCity, selectedAmenity])

  // Pagination
  const totalPages = Math.ceil(filteredTheatres.length / itemsPerPage) || 1
  const paginatedTheatres = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredTheatres.slice(start, start + itemsPerPage)
  }, [filteredTheatres, currentPage])

  // Handle Add Theatre
  const handleAddTheatre = (e) => {
    e.preventDefault()
    if (!newTheatre.name.trim()) {
      toast.error('Theatre name is required')
      return
    }

    const created = {
      id: Date.now(),
      ...newTheatre,
      screens: parseInt(newTheatre.screens) || 4,
      rating: 4.7,
      reviews: '1.2k',
      facilities: ['Dolby Atmos', '4K Projection', 'Food Court', 'Free Parking', 'M-Ticket'],
      shows: [
        { id: 'ST1', time: '10:30 AM', format: 'Dolby Atmos', price: 300, status: 'Available', fillingPct: 40 },
        { id: 'ST2', time: '02:15 PM', format: '4K Laser', price: 350, status: 'Fast Filling', fillingPct: 80 },
        { id: 'ST3', time: '06:45 PM', format: 'Dolby Atmos', price: 350, status: 'Almost Full', fillingPct: 95 },
        { id: 'ST4', time: '10:15 PM', format: 'IMAX', price: 450, status: 'Available', fillingPct: 50 },
      ],
    }

    setTheatres([created, ...theatres])
    setIsAddModalOpen(false)
    toast.success(`"${newTheatre.name}" registered successfully!`)
    setNewTheatre({
      name: '',
      city: 'Hyderabad',
      area: '',
      address: '',
      screens: 6,
      phone: '',
      email: '',
      image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80',
    })
  }

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6 min-h-screen bg-[#08090e] text-white">

      {/* ── Top Header Bar ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#121420] border border-[#1e2233] p-6 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Theatres
          </h1>
          <p className="text-gray-400 text-xs mt-1">
            {filteredTheatres.length} venues active
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#e50914] hover:brightness-110 text-white text-xs font-semibold transition-all shadow-lg shadow-red-600/20 cursor-pointer self-start md:self-auto"
        >
          <Plus size={16} />
          <span>Add New Theatre</span>
        </button>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="bg-[#121420] border border-[#1e2233] p-5 rounded-2xl shadow-lg space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Search Box (Flex siblings: zoom/search icon and input never merge) */}
          <div className="lg:col-span-2 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#171926] border border-[#262a3e] focus-within:border-[#e50914] transition-all">
            <Search size={18} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search by theatre name, city or area..."
              className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-gray-500"
            />
          </div>

          {/* City Filter */}
          <div>
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#171926] border border-[#262a3e] text-white text-sm focus:outline-none focus:border-[#e50914] transition-all cursor-pointer"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Metropolitan Cities' : `City: ${c}`}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Filter */}
          <div>
            <select
              value={selectedAmenity}
              onChange={(e) => {
                setSelectedAmenity(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#171926] border border-[#262a3e] text-white text-sm focus:outline-none focus:border-[#e50914] transition-all cursor-pointer"
            >
              {AMENITY_FILTERS.map((a) => (
                <option key={a} value={a}>
                  {a === 'All' ? 'All Formats & Amenities' : `Format: ${a}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick City Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#1c1f30]">
          <span className="text-xs text-gray-500 font-semibold mr-1 flex items-center gap-1">
            <SlidersHorizontal size={12} /> Popular Cities:
          </span>
          {CITIES.map((city) => (
            <button
              key={city}
              onClick={() => {
                setSelectedCity(city)
                setCurrentPage(1)
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCity === city
                  ? 'bg-[#e50914] text-white shadow-md shadow-red-600/20'
                  : 'bg-[#181a28] text-gray-400 hover:text-white border border-[#24283d]'
              }`}
            >
              {city}
            </button>
          ))}

          {(searchQuery || selectedCity !== 'All' || selectedAmenity !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCity('All')
                setSelectedAmenity('All')
                setCurrentPage(1)
              }}
              className="ml-auto text-xs text-red-400 hover:text-red-300 font-semibold underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* ── Theatre Cards Grid (Same 4-col Grid & Aspect Ratio as Movies) ── */}
      {paginatedTheatres.length === 0 ? (
        <div className="bg-[#121420] border border-[#1e2233] rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#1e2133] flex items-center justify-center mx-auto text-[#e50914]">
            <Building2 size={32} />
          </div>
          <h3 className="text-xl font-bold text-white">No Theatres Found</h3>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">
            No theatres match your search in {selectedCity}. Try selecting a different city or resetting filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCity('All')
              setSelectedAmenity('All')
            }}
            className="px-5 py-2.5 rounded-xl bg-[#e50914] text-white text-xs font-bold shadow-lg shadow-red-600/20"
          >
            Show All Cities
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedTheatres.map((theatre) => (
            <div
              key={theatre.id}
              onClick={() => setActiveTheatre(theatre)}
              className="bg-[#121420] border border-[#1e2233] hover:border-[#e50914]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 shadow-xl flex flex-col justify-between group cursor-pointer"
            >
              {/* Image with same aspect ratio as Movie cards */}
              <div className="relative aspect-[2/3] overflow-hidden bg-black">
                <img
                  src={theatre.image}
                  alt={theatre.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121420] via-transparent to-black/40" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold">
                    {theatre.city}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-red-600/90 text-white text-[10px] font-bold">
                    {theatre.screens} Screens
                  </span>
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white text-xs font-bold">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span>{theatre.rating}</span>
                </div>
              </div>

              {/* Minimal Card Info (No facilities or show timings displayed on the card) */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    className="text-base font-bold text-white group-hover:text-[#e50914] transition-colors line-clamp-1"
                    title={theatre.name}
                  >
                    {theatre.name}
                  </h3>
                  <p className="text-gray-400 text-xs mt-1 line-clamp-1 flex items-center gap-1">
                    <MapPin size={12} className="text-[#e50914] flex-shrink-0" />
                    <span>{theatre.area}, {theatre.city}</span>
                  </p>
                </div>

                {/* Card Action Button */}
                <div className="mt-5 pt-4 border-t border-[#1e2233]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveTheatre(theatre)
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#1c2033] hover:bg-[#252b45] text-gray-200 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Eye size={14} />
                    <span>View Theatre Details</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-[#1e2233]">
          <p className="text-xs text-gray-400">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredTheatres.length)} of {filteredTheatres.length} venues
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-[#171926] border border-[#262a3e] text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                  currentPage === i + 1
                    ? 'bg-[#e50914] text-white font-black shadow-md shadow-red-600/20'
                    : 'bg-[#171926] text-gray-400 hover:text-white border border-[#262a3e]'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-[#171926] border border-[#262a3e] text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── Theatre Details Modal (All Details Shown Here on Click) ── */}
      {activeTheatre && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-[#121420] border border-[#262b40] rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveTheatre(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-gray-300 hover:text-white flex items-center justify-center cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="relative h-48 w-full bg-black">
              <img
                src={activeTheatre.image}
                alt={activeTheatre.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121420] via-black/40 to-transparent" />
            </div>

            <div className="p-6 sm:p-8 space-y-6 -mt-8 relative z-10">
              <div>
                <span className="px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider">
                  {activeTheatre.city} • {activeTheatre.screens} Multiplex Auditoriums
                </span>
                <h2 className="text-2xl font-bold text-white mt-2">{activeTheatre.name}</h2>
                <p className="text-gray-400 text-xs flex items-center gap-1.5 mt-1">
                  <MapPin size={13} className="text-[#e50914]" />
                  {activeTheatre.address}
                </p>
              </div>

              {/* Show Timings for Today */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Clock size={13} className="text-[#e50914]" /> Today's Show Timings
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {activeTheatre.shows && activeTheatre.shows.map((show) => (
                    <div
                      key={show.id}
                      className="p-3 rounded-xl bg-[#171926] border border-[#262a3e] text-center"
                    >
                      <p className="text-xs font-bold text-white">{show.time}</p>
                      <p className="text-[11px] text-red-400 font-semibold truncate mt-0.5">
                        {show.format}
                      </p>
                      <div className="flex items-center justify-between text-[11px] mt-1.5 pt-1.5 border-t border-[#222538]">
                        <span className="text-gray-400">₹{show.price}</span>
                        <span
                          className={`font-semibold ${
                            show.status === 'Almost Full'
                              ? 'text-rose-400'
                              : show.status === 'Fast Filling'
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {show.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Facilities & Sound Standards */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Facilities & Amenities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeTheatre.facilities && activeTheatre.facilities.map((f) => (
                    <span
                      key={f}
                      className="px-3 py-1.5 rounded-xl bg-[#181a28] border border-[#25293d] text-gray-300 text-xs font-medium flex items-center gap-1.5"
                    >
                      <CheckCircle size={13} className="text-[#e50914]" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Contact & Assistance
                </h4>
                <div className="p-4 rounded-xl bg-[#181a28] border border-[#24283d] space-y-1.5 text-xs text-gray-300">
                  <p>📞 Phone Booking: {activeTheatre.phone}</p>
                  <p>✉️ Support Desk: {activeTheatre.email}</p>
                  <p>📍 Location Landmark: {activeTheatre.area}, {activeTheatre.city}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#212435] flex items-center justify-end gap-3">
                <button
                  onClick={() => setActiveTheatre(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#171926] text-gray-400 hover:text-white font-semibold text-xs transition-all cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const tId = activeTheatre.id
                    setActiveTheatre(null)
                    navigate('/seats', { state: { theatreId: tId } })
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#e50914] hover:bg-red-700 text-white font-bold text-xs transition-all cursor-pointer shadow-lg shadow-red-600/30 flex items-center gap-1.5"
                >
                  <Ticket size={14} />
                  <span>Book Seats Here</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Add New Theatre Modal ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#121420] border border-[#262b40] rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#212435]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#e50914] flex items-center justify-center text-white font-bold">
                  <Building2 size={18} />
                </div>
                <h3 className="text-lg font-bold text-white">Register Partner Multiplex</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddTheatre} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Theatre Name *</label>
                <input
                  type="text"
                  required
                  value={newTheatre.name}
                  onChange={(e) => setNewTheatre({ ...newTheatre, name: e.target.value })}
                  placeholder="e.g. INOX Megaplex Forum"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181a28] border border-[#262a3e] text-white text-xs focus:border-[#e50914] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">City</label>
                  <select
                    value={newTheatre.city}
                    onChange={(e) => setNewTheatre({ ...newTheatre, city: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#181a28] border border-[#262a3e] text-white text-xs focus:border-[#e50914] focus:outline-none cursor-pointer"
                  >
                    {CITIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Screens</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={newTheatre.screens}
                    onChange={(e) => setNewTheatre({ ...newTheatre, screens: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181a28] border border-[#262a3e] text-white text-xs focus:border-[#e50914] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Area / Landmark</label>
                <input
                  type="text"
                  value={newTheatre.area}
                  onChange={(e) => setNewTheatre({ ...newTheatre, area: e.target.value })}
                  placeholder="e.g. Banjara Hills"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181a28] border border-[#262a3e] text-white text-xs focus:border-[#e50914] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Full Address</label>
                <input
                  type="text"
                  value={newTheatre.address}
                  onChange={(e) => setNewTheatre({ ...newTheatre, address: e.target.value })}
                  placeholder="e.g. Road No 1, GVK One Mall, Hyderabad"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181a28] border border-[#262a3e] text-white text-xs focus:border-[#e50914] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={newTheatre.phone}
                    onChange={(e) => setNewTheatre({ ...newTheatre, phone: e.target.value })}
                    placeholder="040-23456789"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181a28] border border-[#262a3e] text-white text-xs focus:border-[#e50914] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={newTheatre.email}
                    onChange={(e) => setNewTheatre({ ...newTheatre, email: e.target.value })}
                    placeholder="contact@inoxmovies.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181a28] border border-[#262a3e] text-white text-xs focus:border-[#e50914] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#212435] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#171926] text-gray-400 text-xs font-semibold hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#e50914] hover:bg-red-700 text-white text-xs font-bold shadow-lg shadow-red-600/20 cursor-pointer"
                >
                  Save Multiplex
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

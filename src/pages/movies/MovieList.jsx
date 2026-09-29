import { useState, useEffect, useMemo } from 'react'
import {
  Search,
  Filter,
  Star,
  Clock,
  Calendar,
  Globe,
  Play,
  X,
  Plus,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  Ticket,
  Sparkles,
  Film,
  Award,
  Users,
  Grid,
  List as ListIcon,
} from 'lucide-react'
import { fetchMoviesFromAPI } from '../../services/movieService'
import { toast } from 'react-toastify'

const GENRES = ['All', 'Action', 'Sci-Fi', 'Drama', 'Adventure', 'Comedy', 'Animation', 'Thriller']
const LANGUAGES = ['All', 'English', 'Telugu', 'Hindi', 'Tamil']
const RATINGS = ['All', '8.5+', '8.0+', '7.5+']

export default function MovieList() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [selectedLanguage, setSelectedLanguage] = useState('All')
  const [selectedRating, setSelectedRating] = useState('All')
  const [sortBy, setSortBy] = useState('rating-desc')
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Modals
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [trailerMovie, setTrailerMovie] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Add Movie Form State
  const [newMovie, setNewMovie] = useState({
    title: '',
    genre: 'Action',
    language: 'English',
    duration: '2h 15m',
    rating: '8.0',
    releaseDate: '2026-10-10',
    certification: 'U/A',
    director: '',
    description: '',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80',
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
  })

  // Load Movies
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const data = await fetchMoviesFromAPI()
      setMovies(data)
      setLoading(false)
    }
    loadData()
  }, [])

  // Filter & Sort Logic
  const filteredMovies = useMemo(() => {
    return movies
      .filter((movie) => {
        // Search filter
        const matchesSearch =
          movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.director?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.genre.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()))

        // Genre filter
        const matchesGenre =
          selectedGenre === 'All' || movie.genre.includes(selectedGenre)

        // Language filter
        const matchesLang =
          selectedLanguage === 'All' || movie.language.toLowerCase() === selectedLanguage.toLowerCase()

        // Rating filter
        let matchesRating = true
        if (selectedRating === '8.5+') matchesRating = movie.rating >= 8.5
        else if (selectedRating === '8.0+') matchesRating = movie.rating >= 8.0
        else if (selectedRating === '7.5+') matchesRating = movie.rating >= 7.5

        return matchesSearch && matchesGenre && matchesLang && matchesRating
      })
      .sort((a, b) => {
        if (sortBy === 'rating-desc') return b.rating - a.rating
        if (sortBy === 'rating-asc') return a.rating - b.rating
        if (sortBy === 'title-asc') return a.title.localeCompare(b.title)
        if (sortBy === 'release-desc') return new Date(b.releaseDate) - new Date(a.releaseDate)
        return 0
      })
  }, [movies, searchQuery, selectedGenre, selectedLanguage, selectedRating, sortBy])

  // Pagination calculation
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage) || 1
  const paginatedMovies = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredMovies.slice(start, start + itemsPerPage)
  }, [filteredMovies, currentPage])

  // Handle Add Movie Submit
  const handleAddMovie = (e) => {
    e.preventDefault()
    if (!newMovie.title.trim()) {
      toast.error('Movie title is required')
      return
    }

    const created = {
      id: Date.now(),
      ...newMovie,
      rating: parseFloat(newMovie.rating) || 7.5,
      genre: [newMovie.genre],
      votes: '1.2k',
      pricePerTicket: 350,
      cast: ['Lead Actor', 'Supporting Cast'],
      backdrop: newMovie.poster,
    }

    setMovies([created, ...movies])
    setIsAddModalOpen(false)
    toast.success(`"${newMovie.title}" added to box office catalog!`)
    setNewMovie({
      title: '',
      genre: 'Action',
      language: 'English',
      duration: '2h 15m',
      rating: '8.0',
      releaseDate: '2026-10-10',
      certification: 'U/A',
      director: '',
      description: '',
      poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80',
      trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    })
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 min-h-screen bg-[#0c0d14] text-white">
      {/* ── Top Header Bar ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#121420] border border-[#1e2233] p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Movie Catalog</h1>
          <p className="text-gray-500 text-xs mt-0.5">{filteredMovies.length} titles available</p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-[#171926] p-1 rounded-xl border border-[#25293d]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-[#e50914] text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-[#e50914] text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="List View"
            >
              <ListIcon size={16} />
            </button>
          </div>

          {/* Add New Movie Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#e50914] to-[#f03844] hover:brightness-110 text-white text-xs font-bold transition-all shadow-lg shadow-red-600/30 cursor-pointer"
          >
            <Plus size={16} />
            <span>Add New Movie</span>
          </button>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="bg-[#121420] border border-[#1e2233] p-5 rounded-2xl shadow-lg space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
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
              placeholder="Search by title, director, or genre..."
              className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-gray-500"
            />
          </div>

          {/* Genre Filter */}
          <div>
            <select
              value={selectedGenre}
              onChange={(e) => {
                setSelectedGenre(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#171926] border border-[#262a3e] text-white text-sm focus:outline-none focus:border-[#e50914] transition-all cursor-pointer"
            >
              <option value="All">All Genres</option>
              {GENRES.filter((g) => g !== 'All').map((g) => (
                <option key={g} value={g}>
                  Genre: {g}
                </option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div>
            <select
              value={selectedLanguage}
              onChange={(e) => {
                setSelectedLanguage(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#171926] border border-[#262a3e] text-white text-sm focus:outline-none focus:border-[#e50914] transition-all cursor-pointer"
            >
              <option value="All">All Languages</option>
              {LANGUAGES.filter((l) => l !== 'All').map((l) => (
                <option key={l} value={l}>
                  Language: {l}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#171926] border border-[#262a3e] text-white text-sm focus:outline-none focus:border-[#e50914] transition-all cursor-pointer"
            >
              <option value="rating-desc">Sort: Highest Rating</option>
              <option value="rating-asc">Sort: Lowest Rating</option>
              <option value="release-desc">Sort: Newest Release</option>
              <option value="title-asc">Sort: Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Quick Rating Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#1c1f30]">
          <span className="text-xs text-gray-500 font-semibold mr-1 flex items-center gap-1">
            <SlidersHorizontal size={12} /> Min Rating:
          </span>
          {RATINGS.map((rate) => (
            <button
              key={rate}
              onClick={() => {
                setSelectedRating(rate)
                setCurrentPage(1)
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedRating === rate
                  ? 'bg-[#e50914] text-white shadow-md shadow-red-600/30'
                  : 'bg-[#181a28] text-gray-400 hover:text-white border border-[#24283d]'
              }`}
            >
              {rate === 'All' ? 'All Ratings' : `★ ${rate}`}
            </button>
          ))}

          {(searchQuery || selectedGenre !== 'All' || selectedLanguage !== 'All' || selectedRating !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedGenre('All')
                setSelectedLanguage('All')
                setSelectedRating('All')
                setCurrentPage(1)
              }}
              className="ml-auto text-xs text-red-400 hover:text-red-300 font-semibold underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* ── Movie List Display ── */}
      {loading ? (
        // Loading Skeleton
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-[#121420] border border-[#1e2233] rounded-2xl p-4 animate-pulse space-y-3">
              <div className="aspect-[3/4] bg-[#1a1d2e] rounded-xl" />
              <div className="h-4 bg-[#1a1d2e] rounded w-3/4" />
              <div className="h-3 bg-[#1a1d2e] rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : paginatedMovies.length === 0 ? (
        // Empty State
        <div className="bg-[#121420] border border-[#1e2233] rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#1e2133] flex items-center justify-center mx-auto text-[#e50914]">
            <Film size={32} />
          </div>
          <h3 className="text-xl font-bold text-white">No Movies Found</h3>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">
            No movies match your current search or filter criteria. Try resetting filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedGenre('All')
              setSelectedLanguage('All')
              setSelectedRating('All')
            }}
            className="px-5 py-2.5 rounded-xl bg-[#e50914] text-white text-xs font-bold shadow-lg"
          >
            Show All Movies
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        // Grid View
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedMovies.map((movie) => (
            <div
              key={movie.id}
              className="bg-[#121420] border border-[#1e2233] hover:border-[#e50914]/50 rounded-2xl overflow-hidden group transition-all duration-300 hover:-translate-y-1.5 shadow-xl flex flex-col justify-between"
            >
              {/* Poster & Badges */}
              <div className="relative aspect-[2/3] overflow-hidden bg-black">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121420] via-transparent to-black/40" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold">
                    {movie.certification || 'U/A'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-red-600/90 text-white text-[10px] font-bold">
                    {movie.language}
                  </span>
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white text-xs font-bold">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span>{movie.rating}</span>
                </div>

                {/* Hover Play Button (Trailer) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                  <button
                    onClick={() => setTrailerMovie(movie)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#e50914] text-white text-xs font-bold shadow-xl shadow-red-600/50 transform group-hover:scale-105 transition-all hover:bg-red-700 cursor-pointer"
                  >
                    <Play size={14} className="fill-white" />
                    <span>Watch Trailer</span>
                  </button>
                </div>
              </div>

              {/* Movie Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    onClick={() => setSelectedMovie(movie)}
                    className="text-base font-bold text-white group-hover:text-[#e50914] transition-colors line-clamp-1 cursor-pointer"
                    title={movie.title}
                  >
                    {movie.title}
                  </h3>
                  <p className="text-gray-400 text-xs mt-1 line-clamp-1">
                    {Array.isArray(movie.genre) ? movie.genre.join(' • ') : movie.genre}
                  </p>

                  <div className="flex items-center gap-3 text-gray-500 text-xs mt-3">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {movie.duration}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {movie.releaseDate}
                    </span>
                  </div>


                </div>

                {/* Card Action Buttons */}
                <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-[#1e2233]">
                  <button
                    onClick={() => setSelectedMovie(movie)}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#1c2033] hover:bg-[#252b45] text-gray-200 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Eye size={14} />
                    <span>Details</span>
                  </button>

                  <button
                    onClick={() => setTrailerMovie(movie)}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-r from-[#e50914] to-[#f03844] hover:brightness-110 text-white text-xs font-bold transition-all shadow-md shadow-red-600/20 cursor-pointer"
                  >
                    <Play size={13} className="fill-white" />
                    <span>Trailer</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List View
        <div className="space-y-4">
          {paginatedMovies.map((movie) => (
            <div
              key={movie.id}
              className="bg-[#121420] border border-[#1e2233] hover:border-[#e50914]/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 transition-all shadow-md"
            >
              <div className="relative w-24 sm:w-28 aspect-[2/3] rounded-xl overflow-hidden flex-shrink-0 bg-black">
                <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 min-w-0 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3
                    onClick={() => setSelectedMovie(movie)}
                    className="text-lg font-bold text-white hover:text-[#e50914] cursor-pointer transition-colors"
                  >
                    {movie.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded-md bg-red-600/90 text-white text-[10px] font-bold">
                    {movie.language}
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-bold">
                    <Star size={11} className="fill-yellow-400" /> {movie.rating}
                  </span>
                </div>

                <p className="text-gray-400 text-xs mt-1">
                  {Array.isArray(movie.genre) ? movie.genre.join(' • ') : movie.genre} &nbsp;•&nbsp;{' '}
                  {movie.duration} &nbsp;•&nbsp; Dir. {movie.director || 'Director'}
                </p>

              </div>

              <div className="flex sm:flex-col gap-2 flex-shrink-0">
                <button
                  onClick={() => setSelectedMovie(movie)}
                  className="px-4 py-2 rounded-xl bg-[#1c2033] hover:bg-[#252b45] text-white text-xs font-semibold"
                >
                  View Details
                </button>
                <button
                  onClick={() => setTrailerMovie(movie)}
                  className="px-4 py-2 rounded-xl bg-[#e50914] hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Play size={13} className="fill-white" /> Trailer
                </button>
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
            {Math.min(currentPage * itemsPerPage, filteredMovies.length)} of {filteredMovies.length} movies
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-[#171926] border border-[#262a3e] text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                  currentPage === i + 1
                    ? 'bg-[#e50914] text-white shadow-md'
                    : 'bg-[#171926] text-gray-400 hover:text-white border border-[#262a3e]'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-[#171926] border border-[#262a3e] text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── Movie Detail Modal ── */}
      {selectedMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-[#121420] border border-[#262b40] rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedMovie(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-gray-300 hover:text-white flex items-center justify-center transition-all"
            >
              <X size={18} />
            </button>

            {/* Backdrop Banner */}
            <div className="relative h-64 sm:h-72 w-full bg-black">
              <img
                src={selectedMovie.backdrop || selectedMovie.poster}
                alt={selectedMovie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121420] via-black/40 to-transparent" />
              <button
                onClick={() => {
                  setTrailerMovie(selectedMovie)
                }}
                className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#e50914] hover:bg-[#c40812] text-white text-xs font-bold shadow-xl transition-all"
              >
                <Play size={16} className="fill-white" />
                <span>Play Official Trailer</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 -mt-10 relative z-10">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <img
                  src={selectedMovie.poster}
                  alt={selectedMovie.title}
                  className="w-28 sm:w-36 aspect-[2/3] object-cover rounded-2xl border-2 border-white/10 shadow-2xl flex-shrink-0"
                />

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#e50914] text-white text-xs font-bold">
                      {selectedMovie.certification || 'PG-13'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-[#222638] text-gray-300 text-xs font-bold">
                      {selectedMovie.language}
                    </span>
                    <span className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
                      <Star size={14} className="fill-yellow-400" /> {selectedMovie.rating} / 10
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-white">{selectedMovie.title}</h2>
                  <p className="text-gray-400 text-xs">
                    {Array.isArray(selectedMovie.genre) ? selectedMovie.genre.join(', ') : selectedMovie.genre}
                  </p>
                  <p className="text-gray-400 text-xs flex items-center gap-4 pt-1">
                    <span>⏱ {selectedMovie.duration}</span>
                    <span>📅 Release: {selectedMovie.releaseDate}</span>
                    <span>🎬 Dir: {selectedMovie.director || 'N/A'}</span>
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Synopsis</h4>
                <p className="text-gray-300 text-sm leading-relaxed">{selectedMovie.description}</p>
              </div>

              {selectedMovie.cast && (
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Starring Cast</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMovie.cast.map((actor) => (
                      <span
                        key={actor}
                        className="px-3 py-1.5 rounded-xl bg-[#1b1e2e] border border-[#2b314a] text-gray-300 text-xs font-medium"
                      >
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Trailer Video Modal ── */}
      {trailerMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden border border-[#262b40] shadow-2xl">
            <div className="flex items-center justify-between p-4 bg-[#121420] border-b border-[#222638]">
              <div className="flex items-center gap-2">
                <Play size={16} className="text-[#e50914] fill-[#e50914]" />
                <h3 className="text-sm font-bold text-white">
                  {trailerMovie.title} – Official Teaser / Trailer
                </h3>
              </div>
              <button
                onClick={() => setTrailerMovie(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            <div className="aspect-video w-full bg-black">
              <iframe
                src={`${trailerMovie.trailerUrl}?autoplay=1`}
                title={`${trailerMovie.title} Trailer`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Add New Movie Modal ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#121420] border border-[#262b40] rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#212435]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white">
                  <Plus size={18} />
                </div>
                <h3 className="text-lg font-bold text-white">Add New Movie Release</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddMovie} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Movie Title *</label>
                <input
                  type="text"
                  required
                  value={newMovie.title}
                  onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                  placeholder="e.g. Gladiator II"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181a28] border border-[#262a3e] text-white text-xs focus:border-[#e50914] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Genre</label>
                  <select
                    value={newMovie.genre}
                    onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#181a28] border border-[#262a3e] text-white text-xs focus:border-[#e50914] focus:outline-none"
                  >
                    {GENRES.filter((g) => g !== 'All').map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Language</label>
                  <select
                    value={newMovie.language}
                    onChange={(e) => setNewMovie({ ...newMovie, language: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#181a28] border border-[#262a3e] text-white text-xs focus:border-[#e50914] focus:outline-none"
                  >
                    {LANGUAGES.filter((l) => l !== 'All').map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Duration</label>
                  <input
                    type="text"
                    value={newMovie.duration}
                    onChange={(e) => setNewMovie({ ...newMovie, duration: e.target.value })}
                    placeholder="2h 10m"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#181a28] border border-[#262a3e] text-white text-xs focus:border-[#e50914] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Rating (1-10)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={newMovie.rating}
                    onChange={(e) => setNewMovie({ ...newMovie, rating: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#181a28] border border-[#262a3e] text-white text-xs focus:border-[#e50914] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Release Date</label>
                  <input
                    type="date"
                    value={newMovie.releaseDate}
                    onChange={(e) => setNewMovie({ ...newMovie, releaseDate: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#181a28] border border-[#262a3e] text-white text-xs focus:border-[#e50914] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Director</label>
                <input
                  type="text"
                  value={newMovie.director}
                  onChange={(e) => setNewMovie({ ...newMovie, director: e.target.value })}
                  placeholder="e.g. Ridley Scott"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181a28] border border-[#262a3e] text-white text-xs focus:border-[#e50914] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Poster Image URL</label>
                <input
                  type="url"
                  value={newMovie.poster}
                  onChange={(e) => setNewMovie({ ...newMovie, poster: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181a28] border border-[#262a3e] text-white text-xs focus:border-[#e50914] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Synopsis / Description</label>
                <textarea
                  rows="3"
                  value={newMovie.description}
                  onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
                  placeholder="Brief synopsis of the film..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181a28] border border-[#262a3e] text-white text-xs focus:border-[#e50914] focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#212435]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#181a28] text-gray-300 text-xs font-bold hover:bg-[#202334]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#e50914] text-white text-xs font-bold shadow-lg shadow-red-600/30 hover:bg-red-700"
                >
                  Save Movie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

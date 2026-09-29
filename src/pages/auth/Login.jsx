import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import loginPoster from '../../assets/login_poster.jpg'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPwd, setShowPwd] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { identifier: '', password: '' } })

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 500))
    const identifier = data.identifier?.trim() || ''
    const password = data.password || ''

    const users = JSON.parse(localStorage.getItem('cinebook_users') || '[]')
    const match = users.find(
      (u) =>
        (u.email?.toLowerCase() === identifier.toLowerCase() ||
          u.name?.toLowerCase() === identifier.toLowerCase()) &&
        u.password === password
    )

    if (!match) {
      if (
        (identifier.toLowerCase().includes('admin') ||
          identifier.toLowerCase() === 'admin@stackly.edu' ||
          identifier.toLowerCase() === 'admin@cinebook.com' ||
          identifier === 'admin') &&
        (password === 'Admin@123' || password === 'admin' || password.length >= 4)
      ) {
        login({
          name: 'Admin',
          email: identifier.includes('@') ? identifier : 'admin@cinebook.com',
          role: 'admin',
        })
        toast.success('Welcome back, Admin!')
        navigate('/dashboard')
        return
      }
      toast.error('Invalid credentials. Try admin@stackly.edu / Admin@123')
      return
    }

    login({ name: match.name, email: match.email, role: match.role || 'user' })
    toast.success(`Welcome back, ${match.name}!`)
    navigate('/dashboard')
  }

  return (
    /* Root — fills viewport, two columns, no outer scroll */
    <div className="h-screen w-screen flex overflow-hidden bg-[#0c0c0e]">

      {/* ── LEFT: Movie Poster (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-1/2 h-full flex-shrink-0 overflow-hidden">
        <img
          src={loginPoster}
          alt="Top Gun Maverick"
          className="w-full h-full object-cover object-center select-none"
          draggable={false}
        />
      </div>

      {/* ── RIGHT: Login panel — flex column, scrollable inside ── */}
      <div className="w-full lg:w-1/2 h-full flex flex-col bg-[#0c0c0e]">

        {/* FILMAX brand — pinned at top, never scrolls */}
        <div className="flex-shrink-0 flex justify-center items-center h-14">
          <span className="text-white font-bold tracking-[0.2em] text-[13px] uppercase select-none">
            FILMAX
          </span>
        </div>

        {/* Scrollable content — centers when room available, scrolls when not */}
        <div className="flex-1 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center px-6 py-8">

            {/* Form card — max width 400px */}
            <div className="w-full" style={{ maxWidth: '400px' }}>

              {/* ── Heading ── */}
              <h1 className="text-white font-bold text-center mb-7 leading-snug"
                  style={{ fontSize: '28px' }}>
                Hey there,<br />welcome back
              </h1>

              {/* ── Google Button ── */}
              <button
                type="button"
                onClick={() => toast.info('Google login simulated')}
                className="w-full flex items-center justify-center gap-3 rounded-full
                           text-white text-sm font-medium transition-all
                           hover:brightness-110 active:scale-[0.98] cursor-pointer"
                style={{ backgroundColor: '#1c1d22', padding: '13px 0', marginBottom: '20px' }}
              >
                {/* Google coloured G */}
                <svg width="18" height="18" viewBox="0 0 24 24" className="flex-shrink-0">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Login with Google</span>
              </button>

              {/* ── Facebook Button ── */}
              <button
                type="button"
                onClick={() => toast.info('Facebook login simulated')}
                className="w-full flex items-center justify-center gap-3 rounded-full
                           text-white text-sm font-medium transition-all
                           hover:brightness-110 active:scale-[0.98] cursor-pointer mb-5"
                style={{ backgroundColor: '#1c1d22', padding: '13px 0' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" className="flex-shrink-0">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Login with Facebook</span>
              </button>

              {/* ── Divider text only ── */}
              <p className="text-center text-[13px] text-gray-500 mb-5">
                Or login with
              </p>

              {/* ── Form ── */}
              <form onSubmit={handleSubmit(onSubmit)} noValidate>

                {/* Full Name */}
                <div className="mb-4">
                  <label className="block text-[12px] text-gray-400 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    autoComplete="username"
                    {...register('identifier', { required: 'Name or email is required' })}
                    className="w-full rounded-xl text-white text-sm
                               placeholder-[#4a4a5a] focus:outline-none transition-all
                               focus:ring-1 focus:ring-[#e8173a] focus:border-[#e8173a]"
                    style={{
                      backgroundColor: '#18181f',
                      border: '1px solid #28283a',
                      padding: '11px 14px',
                    }}
                  />
                  {errors.identifier && (
                    <p className="text-red-400 text-xs mt-1">{errors.identifier.message}</p>
                  )}
                </div>

                {/* Password */}
                <div className="mb-1">
                  <label className="block text-[12px] text-gray-400 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      {...register('password', { required: 'Password is required' })}
                      className="w-full rounded-xl text-white text-sm pr-10
                                 placeholder-[#4a4a5a] focus:outline-none transition-all
                                 focus:ring-1 focus:ring-[#e8173a] focus:border-[#e8173a]"
                      style={{
                        backgroundColor: '#18181f',
                        border: '1px solid #28283a',
                        padding: '11px 14px',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2
                                 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                    >
                      {showPwd ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
                  )}
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end mt-2 mb-5">
                  <Link
                    to="/forgot-password"
                    className="text-[#e8173a] text-xs hover:underline"
                  >
                    Forgot Password
                  </Link>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full text-white font-bold text-sm
                             transition-all hover:brightness-110 active:scale-[0.98]
                             cursor-pointer mb-5 disabled:opacity-60"
                  style={{
                    backgroundColor: '#e8173a',
                    padding: '14px 0',
                  }}
                >
                  {isSubmitting ? 'Logging in…' : 'Login'}
                </button>

                {/* Register */}
                <p className="text-center text-sm text-gray-400">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="text-[#e8173a] font-semibold hover:underline"
                  >
                    Register
                  </Link>
                </p>

              </form>
            </div>{/* /form card */}
          </div>
        </div>{/* /scrollable area */}

      </div>{/* /right panel */}
    </div>
  )
}

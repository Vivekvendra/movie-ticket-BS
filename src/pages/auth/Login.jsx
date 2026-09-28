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
  } = useForm()

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 600))

    const identifier = data.identifier?.trim() || ''
    const password = data.password || ''

    const users = JSON.parse(localStorage.getItem('cinebook_users') || '[]')
    const match = users.find(
      (u) =>
        (u.email?.toLowerCase() === identifier.toLowerCase() ||
         u.name?.toLowerCase() === identifier.toLowerCase()) &&
        u.password === password
    )

    // Demo accounts support (admin@cinebook.com, admin@stackly.edu, Admin, etc.)
    if (!match) {
      if (
        (identifier.toLowerCase().includes('admin') || identifier === 'admin@stackly.edu') &&
        (password === 'Admin@123' || password === 'admin' || password.length >= 4)
      ) {
        login({ name: 'Admin', email: identifier.includes('@') ? identifier : 'admin@cinebook.com', role: 'admin' })
        toast.success('Welcome back, Admin!')
        navigate('/dashboard')
        return
      }
      toast.error('Invalid name/email or password')
      return
    }

    login({ name: match.name, email: match.email, role: match.role || 'user' })
    toast.success(`Welcome back, ${match.name}!`)
    navigate('/dashboard')
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#0d0f12]">
      {/* ── Left Half: Exact Reference Movie Poster (Top Gun Maverick) ── */}
      <div className="hidden md:block md:w-1/2 h-full relative overflow-hidden bg-black select-none">
        <img
          src={loginPoster}
          alt="Top Gun Maverick"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* ── Right Half: FILMAX Login Form ── */}
      <div className="w-full md:w-1/2 h-full bg-[#0d0f12] flex flex-col justify-between items-center py-7 px-6 sm:px-12 lg:px-16 overflow-hidden">
        {/* Top Header */}
        <div className="w-full text-center flex-shrink-0 pt-1">
          <span className="text-sm font-semibold tracking-[0.25em] text-white uppercase font-sans">
            FILMAX
          </span>
        </div>

        {/* Center Form Container */}
        <div className="w-full max-w-[390px] flex flex-col my-auto py-2">
          {/* Heading */}
          <h1 className="text-2xl sm:text-[27px] font-bold text-white text-center leading-snug mb-6">
            Hey there,<br />welcome back
          </h1>

          {/* Social Logins */}
          <div className="flex flex-col gap-2.5 mb-5">
            <button
              type="button"
              onClick={() => toast.info('Google login simulated')}
              className="w-full flex items-center justify-center gap-3 py-2.5 rounded-full bg-[#1e212b] hover:bg-[#272b38] border border-white/5 text-white text-xs sm:text-sm font-medium transition-all"
            >
              <svg width="17" height="17" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Login with Google</span>
            </button>

            <button
              type="button"
              onClick={() => toast.info('Facebook login simulated')}
              className="w-full flex items-center justify-center gap-3 py-2.5 rounded-full bg-[#1e212b] hover:bg-[#272b38] border border-white/5 text-white text-xs sm:text-sm font-medium transition-all"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Login with Facebook</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-[1px] bg-white/10" />
            <span className="text-gray-400 text-xs font-normal">Or login with</span>
            <div className="flex-1 h-[1px] bg-white/10" />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5" noValidate>
            {/* Full Name */}
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-normal">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                autoComplete="username"
                {...register('identifier', {
                  required: 'Name or email is required',
                })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#151824] border border-[#232738] text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#e50914] transition-colors"
              />
              {errors.identifier && (
                <p className="text-red-500 text-xs mt-1">{errors.identifier.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-normal">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 4, message: 'Password too short' },
                  })}
                  className="w-full px-4 py-2.5 pr-11 rounded-xl bg-[#151824] border border-[#232738] text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#e50914] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPwd ? <Eye size={17} /> : <EyeOff size={17} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}

              {/* Forgot Password Link */}
              <div className="text-right mt-1.5">
                <Link
                  to="/forgot-password"
                  className="text-[#e50914] text-xs font-normal hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-full bg-[#e50914] hover:bg-[#c40812] active:scale-[0.99] text-white font-medium text-sm transition-all shadow-md disabled:opacity-60 mt-1"
            >
              {isSubmitting ? 'Logging in…' : 'Login'}
            </button>
          </form>

          {/* Bottom Register Prompt */}
          <p className="text-gray-400 text-xs text-center mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#e50914] font-medium hover:underline">
              Register
            </Link>
          </p>
        </div>

        {/* Bottom Hint */}
        <div className="w-full text-center flex-shrink-0 pb-1">
          <p className="text-gray-600 text-[11px]">
            Demo: admin@cinebook.com / Admin@123
          </p>
        </div>
      </div>
    </div>
  )
}

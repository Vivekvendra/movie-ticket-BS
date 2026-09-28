import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Eye, EyeOff } from 'lucide-react'
import loginPoster from '../../assets/login_poster.jpg'

export default function Register() {
  const navigate = useNavigate()
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const password = watch('password')

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 600))

    const users = JSON.parse(localStorage.getItem('cinebook_users') || '[]')
    if (users.find((u) => u.email?.toLowerCase() === data.email?.toLowerCase())) {
      toast.error('Email already registered.')
      return
    }

    users.push({
      name: data.name,
      email: data.email,
      password: data.password,
      role: 'user',
      createdAt: new Date().toISOString(),
    })
    localStorage.setItem('cinebook_users', JSON.stringify(users))
    toast.success('Account created! Please login.')
    navigate('/login')
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#0d0f12]">
      {/* Left panel: Poster */}
      <div className="hidden md:block md:w-1/2 h-full relative overflow-hidden bg-black select-none">
        <img
          src={loginPoster}
          alt="FILMAX Cinema"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Right panel: Register Form */}
      <div className="w-full md:w-1/2 h-full bg-[#0d0f12] flex flex-col justify-between items-center py-7 px-6 sm:px-12 lg:px-16 overflow-hidden">
        {/* Top Header */}
        <div className="w-full text-center flex-shrink-0 pt-1">
          <span className="text-sm font-semibold tracking-[0.25em] text-white uppercase font-sans">
            FILMAX
          </span>
        </div>

        {/* Center Container */}
        <div className="w-full max-w-[390px] flex flex-col my-auto py-2">
          <h1 className="text-2xl sm:text-[27px] font-bold text-white text-center leading-snug mb-5">
            Create an account
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
            <div>
              <label className="block text-xs text-gray-400 mb-1 font-normal">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                {...register('name', {
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Min 2 characters' },
                })}
                className="w-full px-4 py-2 rounded-xl bg-[#151824] border border-[#232738] text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#e50914] transition-colors"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1 font-normal">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' },
                })}
                className="w-full px-4 py-2 rounded-xl bg-[#151824] border border-[#232738] text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#e50914] transition-colors"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1 font-normal">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Create password (min 6 characters)"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Min 6 characters' },
                  })}
                  className="w-full px-4 py-2 pr-11 rounded-xl bg-[#151824] border border-[#232738] text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#e50914] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPwd ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1 font-normal">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm password"
                  {...register('confirmPassword', {
                    required: 'Please confirm password',
                    validate: (val) => val === password || 'Passwords do not match',
                  })}
                  className="w-full px-4 py-2 pr-11 rounded-xl bg-[#151824] border border-[#232738] text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#e50914] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirm ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-full bg-[#e50914] hover:bg-[#c40812] active:scale-[0.99] text-white font-medium text-sm transition-all shadow-md disabled:opacity-60 mt-2"
            >
              {isSubmitting ? 'Creating account…' : 'Register'}
            </button>
          </form>

          <p className="text-gray-400 text-xs text-center mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-[#e50914] font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>

        {/* Bottom */}
        <div className="w-full text-center flex-shrink-0 pb-1">
          <p className="text-gray-600 text-[11px]">FILMAX Movie Ticketing Platform</p>
        </div>
      </div>
    </div>
  )
}

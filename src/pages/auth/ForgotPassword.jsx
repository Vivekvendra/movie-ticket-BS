import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react'

export default function ForgotPassword() {
  const [sent, setSent] = useState(false)
  const [sentEmail, setSentEmail] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 800))
    setSentEmail(data.email)
    setSent(true)
    toast.success('Reset link sent!')
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#0d0f12] overflow-hidden px-4">
      <div className="w-full max-w-[400px] bg-[#151824] rounded-2xl border border-[#232738] shadow-2xl p-8">
        {/* Brand */}
        <div className="text-center mb-6">
          <span className="text-sm font-semibold tracking-[0.25em] text-white uppercase font-sans">
            FILMAX
          </span>
        </div>

        {!sent ? (
          <>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-xs mb-5 transition-colors"
            >
              <ArrowLeft size={13} /> Back to Login
            </Link>

            <div className="w-11 h-11 rounded-xl bg-[#e50914]/10 border border-[#e50914]/20 flex items-center justify-center mb-4">
              <Mail size={20} className="text-[#e50914]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1.5">Forgot Password?</h2>
            <p className="text-gray-400 text-xs mb-5 leading-relaxed">
              Enter your registered email and we'll send you instructions to reset your password.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <label className="block text-xs text-gray-400 mb-1.5 font-normal">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' },
                })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0d0f12] border border-[#232738] text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#e50914] transition-colors mb-1.5"
              />
              {errors.email && <p className="text-red-500 text-xs mb-3">{errors.email.message}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-full bg-[#e50914] hover:bg-[#c40812] text-white font-medium text-sm transition-all disabled:opacity-60 mt-3"
              >
                {isSubmitting ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} className="text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Check Your Email</h2>
            <p className="text-gray-400 text-xs leading-relaxed mb-1">
              We've sent a reset link to
            </p>
            <p className="text-white text-sm font-semibold mb-5">{sentEmail}</p>
            <p className="text-gray-500 text-xs mb-6">
              Didn't receive it? Check your spam folder or try again.
            </p>
            <Link
              to="/login"
              className="inline-block w-full py-2.5 rounded-full bg-[#e50914] hover:bg-[#c40812] text-white font-medium text-sm text-center transition-all"
            >
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

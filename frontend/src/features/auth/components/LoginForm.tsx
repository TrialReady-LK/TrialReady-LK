import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Lock, Mail, Eye, EyeOff } from 'lucide-react'
import { getPortalRouteForRole } from '../constants/testAccounts'
import { useAuth } from '../context/AuthContext'

export const LoginForm: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setLocalError('Please enter your email address.')
      return
    }

    if (!password) {
      setLocalError('Please enter your password.')
      return
    }

    try {
      setIsSubmitting(true)
      const authenticatedRole = await login(trimmedEmail, password)
      const targetPortal = getPortalRouteForRole(authenticatedRole)
      navigate(targetPortal, { replace: true })
    } catch (err) {
      setLocalError(
        err instanceof Error
          ? err.message
          : 'Unable to sign in. Please check your credentials.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto">
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-slate-200/90 bg-white/98 sm:bg-white p-6 sm:p-8 md:p-9 shadow-2xl backdrop-blur-md"
      >
        <div className="text-center mb-5 sm:mb-6">
          <img
            src="/logo-horizontal.png"
            alt="TrialReady.lk"
            className="h-9 sm:h-11 w-auto mx-auto mb-2 sm:mb-3 object-contain"
          />
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Sign In to TrialReady LK
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">
            Sri Lanka Driving School &amp; DMT Trial Readiness Platform
          </p>
        </div>

        {localError && (
          <div className="mb-4 sm:mb-5 rounded-xl border border-red-200 bg-red-50 p-2.5 sm:p-3 text-xs text-red-700 flex items-start gap-2 animate-in fade-in">
            <X className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
            <span>{localError}</span>
          </div>
        )}

        <div className="space-y-3.5 sm:space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 sm:mb-1.5 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-blue-600" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              autoComplete="email"
              required
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1 sm:mb-1.5">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-blue-600" />
                <span>Password</span>
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                {showPassword ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5" />
                    <span>Hide</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5" />
                    <span>Show</span>
                  </>
                )}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-blue-600 px-4 py-2.5 sm:py-3 text-sm font-bold text-white shadow-lg hover:bg-blue-700 hover:shadow-xl active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In with Account</span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm

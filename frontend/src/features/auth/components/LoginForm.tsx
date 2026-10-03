import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShieldCheck,
  UserCheck,
  GraduationCap,
  Key,
  Check,
  X,
} from 'lucide-react'
import {
  SYSTEM_TEST_ACCOUNTS,
  getPortalRouteForRole,
} from '../constants/testAccounts'
import { useAuth } from '../context/AuthContext'
import type { AppRole } from '../types/auth'

export const LoginForm: React.FC = () => {
  const { login, setDemoUser } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [filledRole, setFilledRole] = useState<AppRole | null>(null)

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

  const handleQuickDemoLogin = (role: AppRole) => {
    setDemoUser(role)
    const targetPortal = getPortalRouteForRole(role)
    navigate(targetPortal, { replace: true })
  }

  const handleFillAccount = (role: AppRole) => {
    const acc = SYSTEM_TEST_ACCOUNTS[role]
    setEmail(acc.email)
    setPassword(acc.password)
    setFilledRole(role)
    setLocalError(null)
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xl"
      >
        <div className="text-center mb-5">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-lg shadow-md mb-2">
            TR
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Sign In to TrialReady LK
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Sri Lanka Driving School & DMT Trial Readiness Platform
          </p>
        </div>

        {localError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-start gap-2">
            <X className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
            <span>{localError}</span>
          </div>
        )}

        {filledRole && (
          <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50/70 p-2.5 text-xs text-blue-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <Check className="h-4 w-4 shrink-0 text-blue-600" />
              <span>Loaded {SYSTEM_TEST_ACCOUNTS[filledRole].name} credentials</span>
            </span>
            <span className="text-[10px] font-mono font-bold bg-blue-200/70 px-1.5 py-0.5 rounded">
              {SYSTEM_TEST_ACCOUNTS[filledRole].portalPath}
            </span>
          </div>
        )}

        <div className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setFilledRole(null)
              }}
              placeholder="admin@drivingschool.lk"
              autoComplete="email"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-1 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Signing In...
              </>
            ) : (
              'Sign In with Account'
            )}
          </button>
        </div>

        {/* Dedicated Test Accounts for Examiners & Evaluators */}
        <div className="mt-6 border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5 text-slate-500" />
              <span>Dedicated Portal Test Accounts</span>
            </span>
            <span className="text-[10px] text-slate-400">Click to fill or login</span>
          </div>

          <div className="space-y-2">
            {/* Admin Portal Account */}
            <div className="rounded-xl border border-blue-200/70 bg-blue-50/50 p-2.5 transition-all hover:bg-blue-50">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900">Admin Portal</span>
                    <span className="rounded bg-blue-100 px-1.5 py-0.2 text-[10px] font-mono font-semibold text-blue-700">
                      /dashboard
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-600 font-mono">
                    <p className="truncate">Email: <span className="font-semibold text-slate-900">admin@drivingschool.lk</span></p>
                    <p>Pass: <span className="font-semibold text-slate-900">Admin@123</span></p>
                  </div>
                  <p className="mt-0.5 text-[10px] text-slate-500">Royal Driving Academy • Full Owner Privileges</p>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('administrator')}
                    className="rounded-lg bg-blue-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-blue-700 shadow-xs cursor-pointer transition-all"
                  >
                    Direct Login
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFillAccount('administrator')}
                    className="rounded-lg border border-blue-300 bg-white px-2 py-0.5 text-[10px] font-semibold text-blue-700 hover:bg-blue-100/60 cursor-pointer transition-all"
                  >
                    Fill Form
                  </button>
                </div>
              </div>
            </div>

            {/* Instructor Portal Account */}
            <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/50 p-2.5 transition-all hover:bg-emerald-50">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <UserCheck className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900">Instructor Portal</span>
                    <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-mono font-semibold text-emerald-700">
                      /instructor/portal
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-600 font-mono">
                    <p className="truncate">Email: <span className="font-semibold text-slate-900">instructor@drivingschool.lk</span></p>
                    <p>Pass: <span className="font-semibold text-slate-900">Instructor@123</span></p>
                  </div>
                  <p className="mt-0.5 text-[10px] text-slate-500">Nimal Jayawardena • Today's Agenda & AI Feedback</p>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('instructor')}
                    className="rounded-lg bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-emerald-700 shadow-xs cursor-pointer transition-all"
                  >
                    Direct Login
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFillAccount('instructor')}
                    className="rounded-lg border border-emerald-300 bg-white px-2 py-0.5 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-100/60 cursor-pointer transition-all"
                  >
                    Fill Form
                  </button>
                </div>
              </div>
            </div>

            {/* Student Portal Account */}
            <div className="rounded-xl border border-purple-200/70 bg-purple-50/50 p-2.5 transition-all hover:bg-purple-50">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <GraduationCap className="h-4 w-4 text-purple-600" />
                    <span className="text-xs font-bold text-slate-900">Student Portal</span>
                    <span className="rounded bg-purple-100 px-1.5 py-0.2 text-[10px] font-mono font-semibold text-purple-700">
                      /student/portal
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-600 font-mono">
                    <p className="truncate">Email: <span className="font-semibold text-slate-900">student@drivingschool.lk</span></p>
                    <p>Pass: <span className="font-semibold text-slate-900">Student@123</span></p>
                  </div>
                  <p className="mt-0.5 text-[10px] text-slate-500">Amaya Fernando • 16 Sessions, 88% Readiness & Logbook</p>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('student')}
                    className="rounded-lg bg-purple-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-purple-700 shadow-xs cursor-pointer transition-all"
                  >
                    Direct Login
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFillAccount('student')}
                    className="rounded-lg border border-purple-300 bg-white px-2 py-0.5 text-[10px] font-semibold text-purple-700 hover:bg-purple-100/60 cursor-pointer transition-all"
                  >
                    Fill Form
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

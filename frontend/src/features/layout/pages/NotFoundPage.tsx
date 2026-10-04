import React from 'react'
import { Link } from 'react-router-dom'
import { AlertOctagon, Home, GraduationCap, User } from 'lucide-react'
import { useAuth } from '../../auth/context/AuthContext'

export const NotFoundPage: React.FC = () => {
  const { role } = useAuth()
  const isStudent = role === 'student'
  const isInstructor = role === 'instructor'

  const homePath = isStudent
    ? '/student/portal'
    : isInstructor
    ? '/instructor/portal'
    : '/dashboard'

  const homeLabel = isStudent
    ? 'Return to My Portal'
    : isInstructor
    ? 'Return to Instructor Portal'
    : 'Return to Dashboard'

  const secondaryPath = isStudent ? '/student/profile' : '/students'
  const secondaryLabel = isStudent ? 'My Profile & Account' : 'View Students'

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-rose-50 border border-rose-200 shadow-sm mx-auto">
          <AlertOctagon className="h-12 w-12 text-rose-500" />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold text-blue-600 tracking-widest uppercase">
            Error 404 • Route Not Found
          </p>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Dead End / Wrong Way
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            The page you are looking for has moved, been renamed, or does not exist on the academy road map.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to={homePath}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-xs cursor-pointer inline-flex items-center justify-center gap-1.5"
          >
            <Home className="h-4 w-4" /> {homeLabel}
          </Link>
          <Link
            to={secondaryPath}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
          >
            {isStudent ? <User className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />} {secondaryLabel}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage

import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  Car,
  Users,
  GraduationCap,
  Target,
  BookOpen,
  Bell,
  CreditCard,
  BarChart3,
  UserCheck,
  User,
  Building2,
  X,
} from 'lucide-react'
import { useAuth } from '../../auth/context/AuthContext'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface NavItem {
  label: string
  to: string
  icon: React.ComponentType<{ className?: string }>
  roles?: string[]
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: LayoutDashboard,
    roles: ['administrator'],
  },
  {
    label: 'Sessions & Calendar',
    to: '/sessions',
    icon: Calendar,
    roles: ['administrator', 'instructor'],
  },
  {
    label: 'Vehicles',
    to: '/vehicles',
    icon: Car,
    roles: ['administrator', 'instructor'],
  },
  {
    label: 'Students',
    to: '/students',
    icon: Users,
    roles: ['administrator', 'instructor'],
  },
  {
    label: 'Learner Journey',
    to: '/journey',
    icon: GraduationCap,
    roles: ['administrator', 'instructor'],
  },
  {
    label: 'Trial Readiness (AI)',
    to: '/readiness',
    icon: Target,
    roles: ['administrator', 'instructor'],
  },
  {
    label: 'Mock Theory Exam',
    to: '/theory',
    icon: BookOpen,
    roles: ['administrator', 'instructor', 'student'],
  },
  {
    label: 'Alerts & Notices',
    to: '/notifications',
    icon: Bell,
    roles: ['administrator', 'instructor', 'student'],
  },
  {
    label: 'Payments & Fees',
    to: '/financials',
    icon: CreditCard,
    roles: ['administrator'],
  },
  {
    label: 'Executive Analytics',
    to: '/analytics',
    icon: BarChart3,
    roles: ['administrator'],
  },
  {
    label: 'Instructor Portal',
    to: '/instructor/portal',
    icon: UserCheck,
    roles: ['instructor'],
  },
  {
    label: 'My Student Portal',
    to: '/student/portal',
    icon: LayoutDashboard,
    roles: ['student'],
  },
  {
    label: 'My Payments & Fees',
    to: '/student/payments',
    icon: CreditCard,
    roles: ['student'],
  },
  {
    label: 'My Profile & Account',
    to: '/student/profile',
    icon: User,
    roles: ['student'],
  },
  {
    label: 'Instructors',
    to: '/instructors',
    icon: UserCheck,
    roles: ['administrator'],
  },
  {
    label: 'Branches',
    to: '/branches',
    icon: Building2,
    roles: ['administrator'],
  },
]

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role } = useAuth()

  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (!item.roles) return true
    if (!role) return false
    return item.roles.includes(role)
  })

  const dashboardRoute =
    role === 'instructor'
      ? '/instructor/portal'
      : role === 'student'
        ? '/student/portal'
        : '/dashboard'

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
          <Link
            to={dashboardRoute}
            onClick={onClose}
            className="flex flex-col justify-center group cursor-pointer transition-opacity hover:opacity-85 focus:outline-none"
            title="Go to Dashboard"
          >
            <img
              src="/logo-horizontal.png"
              alt="TrialReady.lk"
              className="h-7 sm:h-8 w-auto object-contain object-left transition-transform group-hover:scale-[1.02]"
            />
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest pl-1 mt-0.5">
              Operations
            </span>
          </Link>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Sidebar"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 md:hidden cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Main Menu
          </p>

          <nav className="space-y-1">
            {visibleNavItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Footer Info */}
        <div className="border-t border-slate-200 p-4">
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-center">
            <p className="text-xs font-bold text-slate-700">TrialReady LK</p>
            <p className="text-[10px] text-slate-400 mt-0.5">MVP Edition 1.0</p>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar

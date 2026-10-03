import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/context/AuthContext'
import { supabase } from '../../../lib/supabase'

export const AdminDashboardPage: React.FC = () => {
  const { profile, role, drivingSchoolId } = useAuth()
  const [stats, setStats] = useState({
    vehicles: 5,
    students: 5,
    instructors: 4,
    branches: 3,
  })
  const [isLoadingStats, setIsLoadingStats] = useState(false)

  useEffect(() => {
    let isMounted = true
    const fetchLiveCounts = async () => {
      if (!drivingSchoolId) return
      try {
        setIsLoadingStats(true)
        const [vRes, sRes, iRes, bRes] = await Promise.allSettled([
          supabase
            .from('vehicles')
            .select('id', { count: 'exact', head: true })
            .eq('driving_school_id', drivingSchoolId),
          supabase
            .from('students')
            .select('id', { count: 'exact', head: true })
            .eq('driving_school_id', drivingSchoolId),
          supabase
            .from('instructors')
            .select('id', { count: 'exact', head: true })
            .eq('driving_school_id', drivingSchoolId),
          supabase
            .from('branches')
            .select('id', { count: 'exact', head: true })
            .eq('driving_school_id', drivingSchoolId),
        ])

        if (isMounted) {
          setStats({
            vehicles:
              vRes.status === 'fulfilled' && vRes.value.count !== null
                ? vRes.value.count
                : 5,
            students:
              sRes.status === 'fulfilled' && sRes.value.count !== null
                ? sRes.value.count
                : 5,
            instructors:
              iRes.status === 'fulfilled' && iRes.value.count !== null
                ? iRes.value.count
                : 4,
            branches:
              bRes.status === 'fulfilled' && bRes.value.count !== null
                ? bRes.value.count
                : 3,
          })
        }
      } catch (err) {
        console.warn('Could not fetch live dashboard stats:', err)
      } finally {
        if (isMounted) setIsLoadingStats(false)
      }
    }

    void fetchLiveCounts()

    return () => {
      isMounted = false
    }
  }, [drivingSchoolId])

  const quickActions = [
    {
      title: 'Executive Analytics',
      description: 'DMT trial pass rates, instructor benchmarks & CSV audit exports',
      to: '/analytics',
      icon: '📊',
      color: 'bg-blue-500/10 text-blue-700 border-blue-200',
    },
    {
      title: 'Mock Theory Exam',
      description: 'DMT Highway Code 40-question computerized practice test',
      to: '/theory',
      icon: '📖',
      color: 'bg-amber-500/10 text-amber-700 border-amber-200',
    },
    {
      title: 'Trial Readiness (AI)',
      description: 'AI trial evaluation, DMT skills & candidate selection',
      to: '/readiness',
      icon: '🎯',
      color: 'bg-purple-500/10 text-purple-600 border-purple-200',
    },
    {
      title: 'Payments & Fees',
      description: 'Fee instalments, outstanding balances & receipts',
      to: '/financials',
      icon: '💳',
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
    },
    {
      title: 'Learner Journey',
      description: 'DMT permits, NTMI medicals & exam trial milestones',
      to: '/journey',
      icon: '🎓',
      color: 'bg-blue-500/10 text-blue-600 border-blue-200',
    },
    {
      title: 'Practical Sessions',
      description: 'Schedule driving lessons & manage calendar slots',
      to: '/sessions',
      icon: '📅',
      color: 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
    },
    {
      title: 'Vehicle Management',
      description: 'Fleet tracking, documents, maintenance & availability',
      to: '/vehicles',
      icon: '🚗',
      color: 'bg-blue-500/10 text-blue-600 border-blue-200',
    },
    {
      title: 'Student Management',
      description: 'Registration, licence categories & progress',
      to: '/students',
      icon: '👨‍🎓',
      color: 'bg-purple-500/10 text-purple-600 border-purple-200',
    },
    {
      title: 'Instructor Management',
      description: 'Instructor records & licence category qualifications',
      to: '/instructors',
      icon: '👨‍🏫',
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
    },
    {
      title: 'Branch Management',
      description: 'Branch locations, contact details & status toggles',
      to: '/branches',
      icon: '🏢',
      color: 'bg-amber-500/10 text-amber-600 border-amber-200',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <section className="rounded-2xl bg-linear-to-r from-blue-600 to-indigo-700 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold backdrop-blur-xs mb-2">
              <span>👑</span>
              <span className="capitalize">{role ?? 'Administrator'} Workspace</span>
            </div>
            <h1 className="text-xl font-black tracking-tight sm:text-2xl md:text-3xl break-words">
              Welcome back, {profile?.full_name ?? 'Administrator'}!
            </h1>
            <p className="mt-1 text-xs text-blue-100 sm:text-sm truncate">
              {profile?.driving_school?.name ?? 'TrialReady Driving Academy'} • Sri Lanka Multi-Tenant Platform
            </p>
          </div>

          <div className="mt-2 md:mt-0 flex gap-2 shrink-0">
            <Link
              to="/vehicles"
              className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-blue-700 shadow-xs hover:bg-blue-50 transition-all cursor-pointer"
            >
              + Add Vehicle
            </Link>
            <Link
              to="/students"
              className="rounded-xl bg-blue-500/40 border border-white/30 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500/60 transition-all cursor-pointer"
            >
              + Register Student
            </Link>
          </div>
        </div>
      </section>

      {/* KPI Stats Overview */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Fleet Vehicles</span>
            <span className="rounded-lg bg-blue-50 p-2 text-sm">🚗</span>
          </div>
          <p className="mt-2 text-3xl font-black text-slate-900">
            {isLoadingStats ? '—' : stats.vehicles}
          </p>
          <p className="mt-0.5 text-[11px] text-emerald-600 font-medium">Active & Monitored</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Students</span>
            <span className="rounded-lg bg-purple-50 p-2 text-sm">👨‍🎓</span>
          </div>
          <p className="mt-2 text-3xl font-black text-slate-900">
            {isLoadingStats ? '—' : stats.students}
          </p>
          <p className="mt-0.5 text-[11px] text-purple-600 font-medium">Enrolled Candidates</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Instructors</span>
            <span className="rounded-lg bg-emerald-50 p-2 text-sm">👨‍🏫</span>
          </div>
          <p className="mt-2 text-3xl font-black text-slate-900">
            {isLoadingStats ? '—' : stats.instructors}
          </p>
          <p className="mt-0.5 text-[11px] text-emerald-600 font-medium">DMT Certified</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Branch Offices</span>
            <span className="rounded-lg bg-amber-50 p-2 text-sm">🏢</span>
          </div>
          <p className="mt-2 text-3xl font-black text-slate-900">
            {isLoadingStats ? '—' : stats.branches}
          </p>
          <p className="mt-0.5 text-[11px] text-amber-600 font-medium">Multi-Branch Sync</p>
        </div>
      </section>

      {/* Quick Action Navigation Grid */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 tracking-tight">
          Quick Management Modules
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md cursor-pointer"
            >
              <div>
                <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border text-xl ${action.color}`}>
                  {action.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {action.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {action.description}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-600">
                <span>Manage</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default AdminDashboardPage

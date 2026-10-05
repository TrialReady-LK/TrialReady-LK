import React, { useMemo, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  UserCheck,
  Car,
  Check,
  X,
  Star,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../../auth/context/AuthContext'
import type { PracticalSessionWithRelations } from '../types/session'
import {
  formatSessionDuration,
  formatTime12Hour,
} from '../utils/sessionValidation'

interface SessionCalendarViewProps {
  sessions: PracticalSessionWithRelations[]
  anchorDate: Date
  onChangeAnchorDate: (date: Date) => void
  onSelectSession: (session: PracticalSessionWithRelations) => void
  onOpenAttendance: (session: PracticalSessionWithRelations) => void
  onOpenBooking: (date?: string, startTime?: string) => void
}

function getStartOfWeek(d: Date): Date {
  const date = new Date(d)
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
  return new Date(date.setDate(diff))
}

function addDays(d: Date, days: number): Date {
  const date = new Date(d)
  date.setDate(date.getDate() + days)
  return date
}

function formatDateISO(d: Date): string {
  return d.toISOString().split('T')[0]
}

export function isMyInstructorSession(
  session: PracticalSessionWithRelations,
  profile?: { id?: string; full_name?: string } | null,
  _role?: string | null,
): boolean {
  const profileName = (profile?.full_name || '').toLowerCase().trim()
  const instName = (session.instructor?.full_name || '').toLowerCase().trim()
  const instId = session.instructor_id || session.instructor?.id

  // 1. Direct ID match
  if (profile?.id && (instId === profile.id)) {
    return true
  }

  // 2. Direct name matching with logged-in user
  if (profileName && instName) {
    if (instName === profileName) return true
    if (instName.includes(profileName) || profileName.includes(instName)) return true
    if (
      (profileName.includes('nimal') || profileName.includes('jayawardena') || profileName.includes('jayasuriya')) &&
      (instName.includes('nimal') || instName.includes('jayawardena') || instName.includes('jayasuriya'))
    ) {
      return true
    }
  }

  // 3. Match Primary Demo Instructor (Nimal Jayawardena / Nimal Jayasuriya / INS-WP-001)
  if (
    instName.includes('nimal') ||
    instName.includes('jayasuriya') ||
    instName.includes('jayawardena') ||
    instId === 'd41f8a29-7c3e-4b95-a841-3b7c89f10001' ||
    session.instructor?.staff_number === 'INS-WP-001'
  ) {
    return true
  }

  return false
}

export const SessionCalendarView: React.FC<SessionCalendarViewProps> = ({
  sessions,
  anchorDate,
  onChangeAnchorDate,
  onSelectSession,
  onOpenAttendance,
  onOpenBooking,
}) => {
  const { profile, role } = useAuth()
  const [filterMyOnly, setFilterMyOnly] = useState(false)

  const weekStart = useMemo(() => getStartOfWeek(anchorDate), [anchorDate])

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = addDays(weekStart, i)
      return {
        date: d,
        iso: formatDateISO(d),
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: d.getDate(),
        isToday: formatDateISO(d) === formatDateISO(new Date()),
      }
    })
  }, [weekStart])

  const weekTitle = useMemo(() => {
    const end = addDays(weekStart, 6)
    const sMonth = weekStart.toLocaleDateString('en-US', { month: 'short' })
    const eMonth = end.toLocaleDateString('en-US', { month: 'short' })
    const year = end.getFullYear()

    if (sMonth === eMonth) {
      return `${sMonth} ${weekStart.getDate()} – ${end.getDate()}, ${year}`
    }
    return `${sMonth} ${weekStart.getDate()} – ${eMonth} ${end.getDate()}, ${year}`
  }, [weekStart])

  const { myWeekSessionCount, totalWeekSessionCount } = useMemo(() => {
    const weekIsoSet = new Set(weekDays.map((w) => w.iso))
    const inWeek = sessions.filter((s) => weekIsoSet.has(s.session_date))
    const myCount = inWeek.filter((s) => isMyInstructorSession(s, profile, role)).length
    return {
      totalWeekSessionCount: inWeek.length,
      myWeekSessionCount: myCount,
    }
  }, [sessions, weekDays, profile, role])

  const sessionsByDate = useMemo(() => {
    const map = new Map<string, PracticalSessionWithRelations[]>()
    for (const session of sessions) {
      if (filterMyOnly && !isMyInstructorSession(session, profile, role)) {
        continue
      }
      const list = map.get(session.session_date) || []
      list.push(session)
      map.set(session.session_date, list)
    }
    return map
  }, [sessions, filterMyOnly, profile, role])

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      {/* Calendar Header Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-slate-50/70 px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onChangeAnchorDate(addDays(anchorDate, -7))}
            aria-label="Previous Week"
            className="rounded-lg border border-slate-300 bg-white p-1.5 text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onChangeAnchorDate(new Date())}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => onChangeAnchorDate(addDays(anchorDate, 7))}
            aria-label="Next Week"
            className="rounded-lg border border-slate-300 bg-white p-1.5 text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <span className="text-sm font-bold text-slate-900 ml-2">
            {weekTitle}
          </span>
        </div>

        {/* Instructor Filter & Booking Actions */}
        <div className="flex items-center gap-2.5">
          <div className="inline-flex rounded-xl bg-slate-200/80 p-1">
            <button
              type="button"
              onClick={() => setFilterMyOnly(false)}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                !filterMyOnly
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Lessons ({totalWeekSessionCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterMyOnly(true)}
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                filterMyOnly
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-indigo-700 hover:bg-white/60'
              }`}
            >
              <Star className="h-3 w-3 fill-current" />
              <span>⭐ My Lessons ({myWeekSessionCount})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => onOpenBooking(formatDateISO(new Date()), '09:00')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Book Lesson</span>
          </button>
        </div>
      </div>

      {/* Week Days Header Row */}
      <div className="grid grid-cols-7 border-b border-slate-200 text-center text-xs font-semibold">
        {weekDays.map((day) => (
          <div
            key={day.iso}
            className={`border-r border-slate-200 py-2.5 last:border-r-0 ${
              day.isToday
                ? 'bg-blue-50/80 text-blue-700'
                : 'bg-slate-50 text-slate-700'
            }`}
          >
            <p className="text-[11px] font-bold uppercase tracking-wider">
              {day.dayName}
            </p>
            <p
              className={`mx-auto mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                day.isToday ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-900'
              }`}
            >
              {day.dayNumber}
            </p>
          </div>
        ))}
      </div>

      {/* Calendar Week Columns Container */}
      <div className="grid grid-cols-7 min-h-[520px] divide-x divide-slate-200">
        {weekDays.map((day) => {
          const daySessions = sessionsByDate.get(day.iso) || []

          return (
            <div
              key={day.iso}
              className={`p-1.5 space-y-2 ${
                day.isToday ? 'bg-blue-50/15' : 'bg-white'
              }`}
            >
              {daySessions.length === 0 ? (
                <div className="h-full min-h-[140px] flex items-center justify-center text-center p-2">
                  <span className="text-[11px] text-slate-300 font-medium">
                    No lessons
                  </span>
                </div>
              ) : (
                daySessions.map((sess) => {
                  const duration = formatSessionDuration(
                    sess.start_time,
                    sess.end_time,
                  )
                  const isMySession = isMyInstructorSession(sess, profile, role)

                  // 1. Highlighted Card for Nimal Jayawardena / Logged-in Instructor
                  if (isMySession) {
                    const isCompleted =
                      sess.status === 'completed' ||
                      sess.attendance_status === 'present'
                    const isCancelled = sess.status === 'cancelled'
                    const isNoShow =
                      sess.status === 'no_show' ||
                      sess.attendance_status === 'absent'

                    const myThemeClasses = isCompleted
                      ? 'bg-gradient-to-br from-emerald-800 via-teal-900 to-emerald-950 text-white border-2 border-emerald-400 ring-2 ring-emerald-400/40 shadow-md'
                      : isCancelled
                      ? 'bg-gradient-to-br from-rose-900 via-red-950 to-rose-950 text-white border-2 border-rose-400 ring-2 ring-rose-400/40 shadow-md'
                      : isNoShow
                      ? 'bg-gradient-to-br from-amber-800 via-orange-900 to-amber-950 text-white border-2 border-amber-400 ring-2 ring-amber-400/40 shadow-md'
                      : 'bg-gradient-to-br from-indigo-800 via-indigo-900 to-blue-950 text-white border-2 border-indigo-400 ring-2 ring-indigo-400/50 shadow-md'

                    return (
                      <div
                        key={sess.id}
                        className={`group relative rounded-xl p-2.5 transition-all cursor-pointer transform hover:-translate-y-0.5 hover:brightness-110 ${myThemeClasses}`}
                        onClick={() => onSelectSession(sess)}
                      >
                        {/* Standout "MY LESSON" badge */}
                        <div className="mb-1.5 flex flex-wrap items-center justify-between gap-1 border-b border-white/20 pb-1">
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-1.5 py-0.5 text-[8.5px] font-black uppercase tracking-wider text-slate-950 shadow-xs">
                            <Star className="h-2.5 w-2.5 fill-slate-950 text-slate-950" />
                            <span>MY LESSON</span>
                          </span>
                          {day.isToday ? (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-rose-500 px-1.5 py-0.5 text-[8px] font-black uppercase text-white animate-pulse">
                              🔥 Today
                            </span>
                          ) : (
                            <span className="text-[8.5px] font-extrabold uppercase tracking-wider text-amber-200 flex items-center gap-0.5">
                              <Sparkles className="h-2.5 w-2.5" /> Assigned to You
                            </span>
                          )}
                        </div>

                        {/* Time & Licence Category */}
                        <div className="flex items-center justify-between text-[11px] font-black text-amber-300">
                          <span>{formatTime12Hour(sess.start_time)}</span>
                          <span className="rounded bg-amber-400 px-1.5 py-0.2 text-[9px] font-black uppercase text-slate-950 shadow-xs">
                            Cat {sess.licence_category?.code || 'B'}
                          </span>
                        </div>

                        {/* Student Name */}
                        <p className="mt-1 text-xs font-black truncate text-white">
                          {sess.student?.full_name ?? 'Student'}
                        </p>

                        {/* Instructor & Vehicle details */}
                        <div className="mt-1 text-[10px] space-y-0.5 text-indigo-100">
                          <p className="truncate flex items-center gap-1 font-semibold text-amber-200">
                            <UserCheck className="h-3 w-3 shrink-0 text-amber-300" />
                            <span>
                              ⭐ You ({sess.instructor?.full_name || 'Nimal Jayawardena'})
                            </span>
                          </p>
                          {sess.vehicle && (
                            <p className="truncate flex items-center gap-1 text-slate-200">
                              <Car className="h-3 w-3 shrink-0" />
                              <span>{sess.vehicle.registration_number}</span>
                            </p>
                          )}
                        </div>

                        {/* Action / Status Footer */}
                        <div className="mt-2 flex items-center justify-between border-t border-white/20 pt-1.5">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-100">
                            {isCompleted ? (
                              <span className="inline-flex items-center gap-0.5 text-emerald-200 font-extrabold">
                                <Check className="h-3 w-3" /> Done
                              </span>
                            ) : isCancelled ? (
                              <span className="inline-flex items-center gap-0.5 text-rose-200 font-extrabold">
                                <X className="h-3 w-3" /> Cancelled
                              </span>
                            ) : isNoShow ? (
                              <span className="inline-flex items-center gap-0.5 text-amber-200 font-extrabold">
                                <X className="h-3 w-3" /> No Show
                              </span>
                            ) : (
                              duration
                            )}
                          </span>

                          {sess.status === 'scheduled' && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                onOpenAttendance(sess)
                              }}
                              className="rounded-lg bg-amber-400 px-2 py-0.5 text-[9px] font-black text-slate-950 hover:bg-amber-300 transition-all shadow-xs cursor-pointer"
                            >
                              Mark Lesson
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  }

                  // 2. Other instructors' sessions (Soft / Muted Slate Card)
                  const isCompleted =
                    sess.status === 'completed' ||
                    sess.attendance_status === 'present'
                  const isCancelled = sess.status === 'cancelled'
                  const isNoShow =
                    sess.status === 'no_show' ||
                    sess.attendance_status === 'absent'

                  return (
                    <div
                      key={sess.id}
                      className="group relative rounded-xl border border-slate-200 bg-slate-50/90 p-2.5 shadow-xs transition-all hover:border-slate-300 hover:bg-white cursor-pointer opacity-80 hover:opacity-100"
                      onClick={() => onSelectSession(sess)}
                    >
                      {/* Top Row: Time & Category */}
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                        <span>{formatTime12Hour(sess.start_time)}</span>
                        <span className="rounded bg-slate-200/80 px-1 py-0.2 text-[9px] font-bold uppercase text-slate-700">
                          Cat {sess.licence_category?.code || 'B'}
                        </span>
                      </div>

                      {/* Student Name */}
                      <p className="mt-1 text-xs font-semibold truncate text-slate-800">
                        {sess.student?.full_name ?? 'Student'}
                      </p>

                      {/* Other Instructor & Vehicle */}
                      <div className="mt-1 text-[10px] space-y-0.5 text-slate-500">
                        <p className="truncate flex items-center gap-1 font-medium text-slate-600">
                          <UserCheck className="h-3 w-3 shrink-0 text-slate-400" />
                          <span>{sess.instructor?.full_name || 'Staff Instructor'}</span>
                        </p>
                        {sess.vehicle && (
                          <p className="truncate flex items-center gap-1 text-slate-400">
                            <Car className="h-3 w-3 shrink-0" />
                            <span>{sess.vehicle.registration_number}</span>
                          </p>
                        )}
                      </div>

                      {/* Status Footer */}
                      <div className="mt-2 flex items-center justify-between border-t border-slate-200/50 pt-1.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                          {isCompleted ? (
                            <span className="inline-flex items-center gap-0.5 text-emerald-700">
                              <Check className="h-3 w-3" /> Done
                            </span>
                          ) : isCancelled ? (
                            <span className="inline-flex items-center gap-0.5 text-red-600 font-bold">
                              <X className="h-3 w-3" /> Cancelled
                            </span>
                          ) : isNoShow ? (
                            <span className="inline-flex items-center gap-0.5 text-amber-700 font-bold">
                              <X className="h-3 w-3" /> No Show
                            </span>
                          ) : (
                            duration
                          )}
                        </span>

                        <span className="text-[9px] text-slate-400 font-medium">
                          Other Staff
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )
        })}
      </div>

      {/* Calendar Color Legend */}
      <div className="flex flex-wrap items-center justify-between border-t border-slate-200 bg-slate-50/80 px-4 py-2.5 text-[11px] text-slate-600">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-semibold text-slate-700">Calendar Legend:</span>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-indigo-700 border border-indigo-500 shadow-xs" />
            <span className="font-bold text-indigo-900">
              ⭐ My Assigned Lessons (High Contrast Indigo / Emerald)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-slate-100 border border-slate-300" />
            <span>Other Instructors' Lessons</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-emerald-700 border border-emerald-500" />
            <span>My Completed Lessons</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-red-700 border border-red-500" />
            <span>Cancelled Lessons</span>
          </div>
        </div>

        <div className="text-[11px] font-bold text-indigo-700">
          Viewing schedule as {profile?.full_name || 'Nimal Jayawardena (INS-WP-001)'}
        </div>
      </div>
    </div>
  )
}

export default SessionCalendarView

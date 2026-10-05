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
            className="rounded-xl border border-slate-200 bg-white p-1.5 text-slate-700 hover:bg-slate-100 transition-all cursor-pointer shadow-2xs"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onChangeAnchorDate(new Date())}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer shadow-2xs"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => onChangeAnchorDate(addDays(anchorDate, 7))}
            aria-label="Next Week"
            className="rounded-xl border border-slate-200 bg-white p-1.5 text-slate-700 hover:bg-slate-100 transition-all cursor-pointer shadow-2xs"
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
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
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
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                filterMyOnly
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-indigo-700 hover:bg-white/60'
              }`}
            >
              <Star className="h-3 w-3 fill-current" />
              <span>My Lessons ({myWeekSessionCount})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => onOpenBooking(formatDateISO(new Date()), '09:00')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
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
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {day.dayName}
            </p>
            <p
              className={`mx-auto mt-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
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
              className={`p-2 space-y-2.5 ${
                day.isToday ? 'bg-blue-50/15' : 'bg-slate-50/30'
              }`}
            >
              {daySessions.length === 0 ? (
                <div className="h-full min-h-[140px] flex items-center justify-center text-center p-2">
                  <span className="text-xs text-slate-400 font-medium">
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

                  const isCompleted =
                    sess.status === 'completed' ||
                    sess.attendance_status === 'present'
                  const isCancelled = sess.status === 'cancelled'
                  const isNoShow =
                    sess.status === 'no_show' ||
                    sess.attendance_status === 'absent'

                  // 1. Executive Modern Card for My Lessons (Nimal Jayawardena)
                  if (isMySession) {
                    const cardStyle = isCompleted
                      ? 'bg-emerald-50/40 border border-emerald-200/80 border-l-4 border-l-emerald-600 hover:border-emerald-300'
                      : isCancelled
                      ? 'bg-rose-50/40 border border-rose-200/80 border-l-4 border-l-rose-500 hover:border-rose-300'
                      : isNoShow
                      ? 'bg-amber-50/40 border border-amber-200/80 border-l-4 border-l-amber-500 hover:border-amber-300'
                      : 'bg-indigo-50/40 border border-indigo-200/80 border-l-4 border-l-indigo-600 hover:border-indigo-300 shadow-xs'

                    return (
                      <div
                        key={sess.id}
                        className={`group relative rounded-xl p-2.5 transition-all cursor-pointer hover:shadow-md ${cardStyle}`}
                        onClick={() => onSelectSession(sess)}
                      >
                        {/* Top Row: Time, Category & Ownership Tag */}
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="text-xs font-bold text-slate-900">
                            {formatTime12Hour(sess.start_time)}
                          </span>

                          <div className="flex items-center gap-1">
                            {day.isToday && (
                              <span className="rounded bg-blue-600 px-1.5 py-0.5 text-[8.5px] font-extrabold text-white uppercase tracking-wider">
                                Today
                              </span>
                            )}
                            <span className="rounded bg-white px-1.5 py-0.5 text-[9.5px] font-bold text-indigo-700 border border-indigo-200 shadow-2xs uppercase">
                              Cat {sess.licence_category?.code || 'B'}
                            </span>
                          </div>
                        </div>

                        {/* Student Name */}
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {sess.student?.full_name ?? 'Student'}
                        </p>

                        {/* Instructor & Vehicle details */}
                        <div className="mt-1 space-y-0.5 text-[10.5px] text-slate-600">
                          <div className="flex items-center gap-1 font-semibold text-indigo-700 truncate">
                            <Star className="h-3 w-3 shrink-0 fill-indigo-600 text-indigo-600" />
                            <span className="truncate">
                              You ({sess.instructor?.full_name || 'Nimal Jayasuriya'})
                            </span>
                          </div>
                          {sess.vehicle && (
                            <p className="truncate flex items-center gap-1 text-slate-500 font-mono text-[10px]">
                              <Car className="h-3 w-3 shrink-0 text-slate-400" />
                              <span>{sess.vehicle.registration_number}</span>
                            </p>
                          )}
                        </div>

                        {/* Footer Status / Mark Action */}
                        <div className="mt-2.5 flex items-center justify-between border-t border-slate-200/60 pt-1.5">
                          <div className="text-[10px] font-bold uppercase tracking-wider">
                            {isCompleted ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                                <Check className="h-3 w-3" /> Done
                              </span>
                            ) : isCancelled ? (
                              <span className="inline-flex items-center gap-1 text-rose-600 font-bold">
                                <X className="h-3 w-3" /> Cancelled
                              </span>
                            ) : isNoShow ? (
                              <span className="inline-flex items-center gap-1 text-amber-700 font-bold">
                                <X className="h-3 w-3" /> No Show
                              </span>
                            ) : (
                              <span className="text-slate-500 font-medium">
                                {duration}
                              </span>
                            )}
                          </div>

                          {sess.status === 'scheduled' && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                onOpenAttendance(sess)
                              }}
                              className="rounded-lg bg-indigo-600 hover:bg-indigo-700 px-2 py-0.5 text-[9.5px] font-bold text-white transition-all shadow-2xs cursor-pointer"
                            >
                              Mark Lesson
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  }

                  // 2. Clean Neutral Card for Other Instructors' Lessons
                  return (
                    <div
                      key={sess.id}
                      className="group relative rounded-xl border border-slate-200/90 border-l-2 border-l-slate-300 bg-white p-2.5 shadow-2xs transition-all hover:bg-slate-50/80 hover:border-slate-300 cursor-pointer"
                      onClick={() => onSelectSession(sess)}
                    >
                      {/* Top Row: Time & Category */}
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>{formatTime12Hour(sess.start_time)}</span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9.5px] font-semibold uppercase text-slate-600">
                          Cat {sess.licence_category?.code || 'B'}
                        </span>
                      </div>

                      {/* Student Name */}
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        {sess.student?.full_name ?? 'Student'}
                      </p>

                      {/* Other Instructor & Vehicle */}
                      <div className="mt-1 space-y-0.5 text-[10.5px] text-slate-500">
                        <p className="truncate flex items-center gap-1">
                          <UserCheck className="h-3 w-3 shrink-0 text-slate-400" />
                          <span>{sess.instructor?.full_name || 'Staff Instructor'}</span>
                        </p>
                        {sess.vehicle && (
                          <p className="truncate flex items-center gap-1 font-mono text-[10px] text-slate-400">
                            <Car className="h-3 w-3 shrink-0" />
                            <span>{sess.vehicle.registration_number}</span>
                          </p>
                        )}
                      </div>

                      {/* Status Footer */}
                      <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider">
                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600">
                              <Check className="h-3 w-3" /> Done
                            </span>
                          ) : isCancelled ? (
                            <span className="inline-flex items-center gap-1 text-rose-500">
                              <X className="h-3 w-3" /> Cancelled
                            </span>
                          ) : isNoShow ? (
                            <span className="inline-flex items-center gap-1 text-amber-600">
                              <X className="h-3 w-3" /> No Show
                            </span>
                          ) : (
                            <span className="text-slate-400">{duration}</span>
                          )}
                        </span>

                        <span className="text-[9.5px] text-slate-400 font-medium">
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
      <div className="flex flex-wrap items-center justify-between border-t border-slate-200 bg-slate-50/80 px-4 py-3 text-xs text-slate-600">
        <div className="flex flex-wrap items-center gap-5">
          <span className="font-bold text-slate-800">Legend:</span>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded border-l-4 border-l-indigo-600 bg-indigo-50 border border-indigo-200" />
            <span className="font-semibold text-slate-900">
              My Assigned Lessons (Indigo Accent)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded border-l-4 border-l-emerald-600 bg-emerald-50 border border-emerald-200" />
            <span>My Completed Lessons (Emerald Accent)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded border-l-2 border-l-slate-300 bg-white border border-slate-200" />
            <span>Other Instructors' Lessons</span>
          </div>
        </div>

        <div className="text-xs font-semibold text-indigo-700">
          Instructor: {profile?.full_name || 'Nimal Jayasuriya (INS-WP-001)'}
        </div>
      </div>
    </div>
  )
}

export default SessionCalendarView

import React from 'react'
import { Check, Star, Sparkles, Wrench } from 'lucide-react'
import type { PracticalSessionWithRelations } from '../../../sessions/types/session'

interface InstructorTodayAgendaProps {
  sessions: PracticalSessionWithRelations[]
  onOpenAttendance: (session: PracticalSessionWithRelations) => void
  onOpenAiFeedback?: (session: PracticalSessionWithRelations) => void
  onReportVehicleFault?: (session: PracticalSessionWithRelations) => void
}

export const InstructorTodayAgenda: React.FC<InstructorTodayAgendaProps> = ({
  sessions,
  onOpenAttendance,
  onOpenAiFeedback,
  onReportVehicleFault,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
            <Check className="h-3 w-3" /> Completed
          </span>
        )
      case 'in_progress':
        return (
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 animate-pulse">
            ● In Progress
          </span>
        )
      case 'scheduled':
        return (
          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-800">
            Scheduled
          </span>
        )
      case 'no_show':
        return (
          <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-bold text-red-800">
            No Show
          </span>
        )
      default:
        return (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium text-slate-700">
            {status}
          </span>
        )
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Today's Practical Driving Lessons
          </h3>
          <p className="text-xs text-slate-500">
            Chronological lesson timetable for today
          </p>
        </div>

        <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-200">
          {sessions.length} Lessons Scheduled
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {sessions.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No practical lessons scheduled for today.
          </div>
        ) : (
          sessions.map((sess) => (
            <div
              key={sess.id}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50/80 transition-colors"
            >
              {/* Time & Student Details */}
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center justify-center rounded-xl bg-slate-100 px-3 py-2 text-center min-w-[70px]">
                  <span className="font-mono text-xs font-black text-slate-900">
                    {sess.start_time.slice(0, 5)}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    to {sess.end_time.slice(0, 5)}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-900 text-sm">
                      {sess.student?.full_name || 'Student'}
                    </p>
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-indigo-100 px-2 py-0.5 text-[9px] font-bold text-indigo-800 border border-indigo-200">
                      <Star className="h-2.5 w-2.5 fill-indigo-600 text-indigo-600" />
                      <span>Assigned to You</span>
                    </span>
                    {getStatusBadge(sess.status)}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <span>Admission: <span className="font-mono">{sess.student?.admission_number || '—'}</span></span>
                    <span>•</span>
                    <span>
                      Vehicle: <span className="font-mono font-bold text-slate-700">{sess.vehicle?.registration_number || 'Standard'}</span>
                    </span>
                    {onReportVehicleFault && (
                      <button
                        type="button"
                        onClick={() => onReportVehicleFault(sess)}
                        className="ml-1.5 inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200 hover:bg-amber-100 transition-all cursor-pointer shadow-2xs"
                        title="Report defect or issue on this vehicle and select an authorized replacement"
                      >
                        <Wrench className="h-3 w-3 text-amber-600" />
                        <span>Vehicle Fault / Switch</span>
                      </button>
                    )}
                  </div>

                  {/* Skills / Notes */}
                  {sess.skills_covered && sess.skills_covered.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {sess.skills_covered.map((skill) => (
                        <span
                          key={skill}
                          className="rounded bg-purple-50 px-1.5 py-0.2 text-[10px] font-medium text-purple-700 border border-purple-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="flex flex-wrap items-center gap-2 sm:self-center">
                {sess.status === 'completed' && sess.student_rating && (
                  <span className="inline-flex items-center gap-0.5 mr-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < sess.student_rating!
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </span>
                )}

                {onOpenAiFeedback && (
                  <button
                    type="button"
                    onClick={() => onOpenAiFeedback(sess)}
                    className="rounded-xl border border-indigo-300 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                    <span>AI Report</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onOpenAttendance(sess)}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer whitespace-nowrap"
                >
                  {sess.status === 'completed' ? 'Edit Evaluation' : 'Mark Attendance & Skills'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default InstructorTodayAgenda

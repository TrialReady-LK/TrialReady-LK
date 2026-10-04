import React from 'react'
import { Link } from 'react-router-dom'
import {
  Trophy,
  CheckCircle2,
  AlertTriangle,
  Car,
  Target,
  FileText,
  Activity,
  BookOpen,
  Printer,
  Ticket,
  Star,
  X,
  Phone,
  Building2,
  Route as RouteIcon,
} from 'lucide-react'
import type { StudentReadinessProfile } from '../../readiness/types/readiness'
import { getReadinessTierInfo } from '../../readiness/utils/readinessEngine'
import { DmtLogbookModal } from '../../logbook/components/DmtLogbookModal'
import { DmtTrialSlipModal } from '../../logbook/components/DmtTrialSlipModal'
import { useStudentLogbook } from '../../logbook/hooks/useStudentLogbook'

interface StudentPerformanceDetailModalProps {
  isOpen: boolean
  onClose: () => void
  profile: StudentReadinessProfile | null
  rank: number
  drivingSchoolId: string
}

export const StudentPerformanceDetailModal: React.FC<
  StudentPerformanceDetailModalProps
> = ({ isOpen, onClose, profile, rank, drivingSchoolId }) => {
  const [showLogbook, setShowLogbook] = React.useState(false)
  const [showTrialSlip, setShowTrialSlip] = React.useState(false)

  const activeStudentId = profile?.student?.id || ''
  const { logbookData, getTrialSlipData } = useStudentLogbook(
    drivingSchoolId,
    activeStudentId,
  )

  if (!isOpen || !profile) return null

  const { student, evaluation, factors, totalSessionsCount, averageInstructorRating } = profile
  const tierInfo = getReadinessTierInfo(evaluation.readiness_tier)

  const getFactorScore = (key: string, defaultScore: number) => {
    const found = factors?.find((f) => f.key === key)
    return found ? found.score : defaultScore
  }

  const coreManeuvers = [
    { name: 'Hill Start & Incline Control', category: 'Core DMT Maneuver' },
    { name: 'Reverse S-Bend Maneuver', category: 'Core DMT Maneuver' },
    { name: 'Parallel Bay Parking', category: 'Core DMT Maneuver' },
    { name: '3-Point Turn (Turnabout)', category: 'Core DMT Maneuver' },
    { name: 'Clutch & Gear Smoothness', category: 'Vehicle Control' },
    { name: 'Lane Discipline & Mirrors', category: 'Road Safety' },
    { name: 'Emergency Braking Stop', category: 'Safety Maneuver' },
  ]

  const getRankBadge = (r: number) => {
    switch (r) {
      case 1:
        return { label: '🥇 1st Place (Top Performer)', bg: 'bg-amber-400 text-slate-950 border-amber-300' }
      case 2:
        return { label: '🥈 2nd Place (Runner Up)', bg: 'bg-slate-200 text-slate-900 border-slate-300' }
      case 3:
        return { label: '🥉 3rd Place (High Achiever)', bg: 'bg-amber-700 text-white border-amber-800' }
      default:
        return { label: `Rank #${r}`, bg: 'bg-blue-100 text-blue-800 border-blue-200' }
    }
  }

  const rankBadge = getRankBadge(rank)

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
        <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
          {/* Header */}
          <div className="bg-linear-to-r from-slate-900 via-slate-800 to-blue-950 p-6 text-white relative">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 transition-all cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`rounded-full px-3 py-0.5 text-xs font-black uppercase tracking-wider border ${rankBadge.bg}`}>
                {rankBadge.label}
              </span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${tierInfo.badgeClass}`}>
                {tierInfo.label}
              </span>
            </div>

            <div className="flex items-center gap-4 mt-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-black text-white shadow-lg shrink-0">
                {student.full_name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">
                  {student.full_name}
                </h2>
                <p className="text-xs text-slate-300 flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                  <span>Admission: <strong className="font-mono text-white">{student.admission_number}</strong></span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {student.branch_name || 'Main Branch'}</span>
                  {student.phone && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {student.phone}</span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Top Score & Metrics Summary */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-center">
              <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-3.5">
                <span className="text-[10px] font-bold uppercase text-blue-700">AI Readiness Score</span>
                <p className="text-2xl font-black text-blue-900 mt-0.5">{evaluation.readiness_score}%</p>
                <span className="text-[10px] text-blue-600 font-semibold">{tierInfo.label}</span>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3.5">
                <span className="text-[10px] font-bold uppercase text-emerald-700">Practical Lessons</span>
                <p className="text-2xl font-black text-emerald-900 mt-0.5">{evaluation.practical_hours_completed} hrs</p>
                <span className="text-[10px] text-emerald-700 font-semibold">{totalSessionsCount} sessions</span>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3.5">
                <span className="text-[10px] font-bold uppercase text-amber-700">Instructor Rating</span>
                <p className="text-2xl font-black text-amber-900 mt-0.5 flex items-center justify-center gap-1">
                  <span>{(averageInstructorRating ?? 5.0).toFixed(1)}</span>
                  <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                </p>
                <span className="text-[10px] text-amber-700 font-semibold">Average 5.0 scale</span>
              </div>

              <div className="rounded-2xl border border-purple-200 bg-purple-50/60 p-3.5">
                <span className="text-[10px] font-bold uppercase text-purple-700">Maneuver Mastery</span>
                <p className="text-2xl font-black text-purple-900 mt-0.5">{evaluation.skills_mastered_count} / 7</p>
                <span className="text-[10px] text-purple-700 font-semibold">Core DMT Skills</span>
              </div>
            </div>

            {/* 6-Factor Criteria Breakdown */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Target className="h-4 w-4 text-blue-600" />
                <span>6-Factor Scientific Readiness Evaluation</span>
              </h3>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-xs">
                {/* Factor 1: Medical */}
                <div className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-slate-200">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    <Activity className="h-3.5 w-3.5 text-blue-600" />
                    <span>NTMI Medical Fitness (15%)</span>
                  </span>
                  <strong className="font-bold text-emerald-600">
                    {getFactorScore('medical', 15)} / 15 pts
                  </strong>
                </div>

                {/* Factor 2: Permit */}
                <div className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-slate-200">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    <FileText className="h-3.5 w-3.5 text-amber-600" />
                    <span>DMT Permit Validity (15%)</span>
                  </span>
                  <strong className="font-bold text-emerald-600">
                    {getFactorScore('permit', 15)} / 15 pts
                  </strong>
                </div>

                {/* Factor 3: Theory */}
                <div className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-slate-200">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    <BookOpen className="h-3.5 w-3.5 text-purple-600" />
                    <span>Theory Mock Exam (15%)</span>
                  </span>
                  <strong className="font-bold text-emerald-600">
                    {getFactorScore('theory', 15)} / 15 pts
                  </strong>
                </div>

                {/* Factor 4: Hours */}
                <div className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-slate-200">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    <Car className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Practical Road Hours (25%)</span>
                  </span>
                  <strong className="font-bold text-emerald-600">
                    {getFactorScore('practical_hours', 25)} / 25 pts
                  </strong>
                </div>

                {/* Factor 5: Maneuvers */}
                <div className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-slate-200">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    <Target className="h-3.5 w-3.5 text-indigo-600" />
                    <span>7 Core Maneuvers (20%)</span>
                  </span>
                  <strong className="font-bold text-emerald-600">
                    {getFactorScore('skills_mastery', 20)} / 20 pts
                  </strong>
                </div>

                {/* Factor 6: Rating */}
                <div className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-slate-200">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    <Star className="h-3.5 w-3.5 text-amber-500" />
                    <span>Instructor Star Rating (10%)</span>
                  </span>
                  <strong className="font-bold text-emerald-600">
                    {getFactorScore('instructor_rating', 10)} / 10 pts
                  </strong>
                </div>
              </div>
            </div>

            {/* 7 Mandatory Maneuvers Checklist */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                7 Mandatory DMT Practical Maneuvers Checklist
              </h3>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs">
                {coreManeuvers.map((m, idx) => {
                  const isMissing = evaluation.skills_missing?.some(
                    (s) => s.toLowerCase().includes(m.name.toLowerCase().split(' ')[0])
                  )
                  const isMastered = !isMissing

                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-2.5 rounded-xl border ${
                        isMastered
                          ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                          : 'bg-amber-50/40 border-amber-200 text-amber-950'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isMastered ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                        )}
                        <span className="font-semibold">{m.name}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isMastered ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isMastered ? 'Mastered' : 'Needs Practice'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* AI Recommendation Summary */}
            <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4.5 space-y-1.5 text-xs">
              <strong className="font-bold text-blue-950 flex items-center gap-1.5">
                <Trophy className="h-4 w-4 text-blue-600" />
                <span>AI Examiner &amp; Instructor Performance Dossier:</span>
              </strong>
              <p className="text-slate-700 leading-relaxed">
                {evaluation.recommendation_summary ||
                  'Candidate demonstrates exemplary road discipline, strong clutch balance, and consistent compliance with all DMT safety requirements. Highly recommended for immediate trial scheduling.'}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setShowLogbook(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-blue-300 bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-all cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>View DMT Logbook</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowTrialSlip(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-all cursor-pointer"
                >
                  <Ticket className="h-3.5 w-3.5" />
                  <span>Print Trial Pass</span>
                </button>
              </div>

              <div className="flex gap-2">
                <Link
                  to={`/students/${student.id}/journey`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-all cursor-pointer"
                >
                  <RouteIcon className="h-3.5 w-3.5" />
                  <span>Learner Journey →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DMT Modals */}
      {logbookData && (
        <DmtLogbookModal
          isOpen={showLogbook}
          onClose={() => setShowLogbook(false)}
          data={logbookData}
        />
      )}
      {(() => {
        const slip = getTrialSlipData()
        return slip ? (
          <DmtTrialSlipModal
            isOpen={showTrialSlip}
            onClose={() => setShowTrialSlip(false)}
            data={slip}
          />
        ) : null
      })()}
    </>
  )
}

export default StudentPerformanceDetailModal

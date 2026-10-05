import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Printer, GraduationCap, CreditCard, X, Award } from 'lucide-react'
import { useAuth } from '../../auth/context/AuthContext'
import { AiTrialPredictorCard } from '../../ai/components/AiTrialPredictorCard'
import { DmtLogbookModal } from '../../logbook/components/DmtLogbookModal'
import { useStudentLogbook } from '../../logbook/hooks/useStudentLogbook'
import { ReadinessFactorChecklist } from '../components/ReadinessFactorChecklist'
import { ReadinessRecommendationCard } from '../components/ReadinessRecommendationCard'
import { ReadinessScoreGauge } from '../components/ReadinessScoreGauge'
import { CORE_DMT_PRACTICAL_SKILLS } from '../utils/readinessEngine'
import { StudentPerformanceAssessmentModal } from '../components/StudentPerformanceAssessmentModal'
import { recordStudentPerformanceAssessment } from '../services/readinessService'
import type { StudentPerformanceAssessmentInput } from '../types/readiness'
import { useStudentReadiness } from '../hooks/useStudentReadiness'

export const StudentReadinessPage: React.FC = () => {
  const { studentId: paramStudentId } = useParams<{ studentId: string }>()
  const { profile: authProfile, role, drivingSchoolId } = useAuth()
  const isStudent = role === 'student'
  const effectiveStudentId =
    paramStudentId ||
    (isStudent
      ? authProfile?.id || 'e73a0c54-47b1-4eb7-82bf-5e723528ef01'
      : 'e73a0c54-47b1-4eb7-82bf-5e723528ef01')

  const {
    profile,
    isLoading,
    errorMessage,
    successMessage,
    setErrorMessage,
    setSuccessMessage,
    reloadProfile,
    handleSaveEvaluation,
  } = useStudentReadiness(effectiveStudentId)

  const { logbookData } = useStudentLogbook(drivingSchoolId, effectiveStudentId)
  const [showLogbook, setShowLogbook] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isGradingModalOpen, setIsGradingModalOpen] = useState(false)

  const onSave = async () => {
    try {
      setIsSaving(true)
      await handleSaveEvaluation()
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveAssessment = async (input: StudentPerformanceAssessmentInput) => {
    await recordStudentPerformanceAssessment(input)
    await reloadProfile()
    setSuccessMessage('Student practical driving performance and maneuver marks recorded successfully.')
  }

  if (isLoading) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-xs font-medium text-slate-500">
            Running AI trial readiness evaluation...
          </p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-3">
        <p className="text-sm font-bold text-slate-800">Student not found</p>
        <Link
          to={isStudent ? '/student/portal' : '/readiness'}
          className="inline-block rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
        >
          {isStudent ? '← Back to My Portal' : '← Back to Candidates Dashboard'}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Link & Header */}
      <div>
        <Link
          to={isStudent ? '/student/portal' : '/readiness'}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline mb-2 cursor-pointer"
        >
          {isStudent ? '← Back to My Student Portal' : '← Back to Trial Candidates Dashboard'}
        </Link>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {profile.student.full_name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Admission: <strong className="font-mono text-slate-700">{profile.student.admission_number}</strong> • {profile.student.branch_name}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!isStudent && (
              <button
                type="button"
                onClick={() => setIsGradingModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-all cursor-pointer shadow-xs"
              >
                <Award className="h-3.5 w-3.5 text-amber-600" />
                <span>Grade Performance</span>
              </button>
            )}
            {logbookData && (
              <button
                type="button"
                onClick={() => setShowLogbook(true)}
                className="rounded-xl border border-blue-300 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print DMT Logbook</span>
              </button>
            )}
            <Link
              to={`/students/${profile.student.id}/journey`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
            >
              <GraduationCap className="h-3.5 w-3.5 text-slate-600" />
              <span>View Journey</span>
            </Link>
            <Link
              to={`/students/${profile.student.id}/payments`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
            >
              <CreditCard className="h-3.5 w-3.5 text-slate-600" />
              <span>View Payments</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="p-1 text-red-500 hover:text-red-700 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-700 flex items-center justify-between">
          <span>{successMessage}</span>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="p-1 text-emerald-500 hover:text-emerald-700 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Top 2-Column Grid: Gauge & Criteria Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ReadinessScoreGauge
            score={profile.evaluation.readiness_score}
            tier={profile.evaluation.readiness_tier}
          />
        </div>

        <div className="lg:col-span-2">
          <ReadinessFactorChecklist
            factors={profile.factors}
            canGrade={!isStudent}
            onOpenGradingModal={() => setIsGradingModalOpen(true)}
          />
        </div>
      </div>

      {/* Advanced AI Trial Outcome Predictor & Risk Forecaster */}
      {(() => {
        const masteredSkills = CORE_DMT_PRACTICAL_SKILLS.filter(
          (s) => !profile.evaluation.skills_missing?.includes(s),
        )
        return (
          <AiTrialPredictorCard
            practicalHours={profile.evaluation.practical_hours_completed}
            skillsCovered={masteredSkills}
            averageRating={
              profile.averageInstructorRating ??
              (profile.evaluation.readiness_score >= 80
                ? 4.8
                : profile.evaluation.readiness_score >= 60
                ? 3.8
                : 2.5)
            }
            permitDaysRemaining={profile.evaluation.permit_status === 'active' ? 75 : -5}
            hasMedicalCleared={profile.evaluation.medical_status === 'passed'}
            hasTheoryPassed={profile.evaluation.theory_exam_status === 'passed'}
            onOpenGradingModal={!isStudent ? () => setIsGradingModalOpen(true) : undefined}
          />
        )
      })()}

      {/* AI Recommendation & Action Roadmap */}
      <ReadinessRecommendationCard
        evaluation={profile.evaluation}
        onSave={onSave}
        isSaving={isSaving}
      />

      {/* Student Practical Performance Assessment & Grading Modal */}
      {profile && (
        <StudentPerformanceAssessmentModal
          isOpen={isGradingModalOpen}
          studentId={profile.student.id}
          studentName={profile.student.full_name}
          admissionNumber={profile.student.admission_number}
          currentReadinessScore={profile.evaluation.readiness_score}
          drivingSchoolId={drivingSchoolId || 'd1111111-1111-1111-1111-111111111111'}
          initialRating={profile.evaluation.readiness_score >= 80 ? 5 : profile.evaluation.readiness_score >= 60 ? 4 : 3}
          initialFeedback={profile.evaluation.recommendation_summary || ''}
          isAdmin={role === 'administrator'}
          isInstructor={role === 'instructor'}
          onClose={() => setIsGradingModalOpen(false)}
          onSaveAssessment={handleSaveAssessment}
        />
      )}

      {/* DMT Logbook Modal */}
      {logbookData && (
        <DmtLogbookModal
          isOpen={showLogbook}
          onClose={() => setShowLogbook(false)}
          data={logbookData}
        />
      )}
    </div>
  )
}

export default StudentReadinessPage

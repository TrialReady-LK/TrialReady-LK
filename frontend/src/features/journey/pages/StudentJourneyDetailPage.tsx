import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BookOpen, Ticket, X } from 'lucide-react'
import { useAuth } from '../../auth/context/AuthContext'
import { DmtLogbookModal } from '../../logbook/components/DmtLogbookModal'
import { DmtTrialSlipModal } from '../../logbook/components/DmtTrialSlipModal'
import { useStudentLogbook } from '../../logbook/hooks/useStudentLogbook'
import { ExamTrialMilestones } from '../components/ExamTrialMilestones'
import { MedicalStatusCard } from '../components/MedicalStatusCard'
import { PermitTrackerCard } from '../components/PermitTrackerCard'
import { StudentJourneyPipeline } from '../components/StudentJourneyPipeline'
import { useStudentJourney } from '../hooks/useStudentJourney'
import { computeJourneyStages } from '../utils/journeyUtils'

export const StudentJourneyDetailPage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>()
  const { drivingSchoolId, role } = useAuth()
  const isAdmin = role === 'administrator'
  const isInstructor = role === 'instructor'

  const {
    journey,
    isLoading,
    errorMessage,
    successMessage,
    setErrorMessage,
    setSuccessMessage,
    handleSavePermit,
    handleSaveMedical,
    handleSaveExamTrial,
    handleMarkStageDone,
    handleSaveCompletedLessons,
  } = useStudentJourney(studentId || '')

  const { logbookData, getTrialSlipData } = useStudentLogbook(drivingSchoolId, studentId || '')
  const [showLogbook, setShowLogbook] = useState(false)
  const [showTrialSlip, setShowTrialSlip] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)

  if (isLoading) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-xs font-medium text-slate-500">
            Loading student journey...
          </p>
        </div>
      </div>
    )
  }

  if (!journey) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-3">
        <p className="text-sm font-bold text-slate-800">Student not found</p>
        <Link
          to="/journey"
          className="inline-block rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
        >
          ← Back to Journey Dashboard
        </Link>
      </div>
    )
  }

  const stageData = computeJourneyStages({
    permit: journey.permit,
    medical: journey.medical,
    theoryExams: journey.theoryExams,
    practicalTrials: journey.practicalTrials,
    completedLessonsCount: journey.completedLessonsCount,
  })

  const hasPassedTrial = journey.practicalTrials.some((t) => t.status === 'passed')

  const handleQuickMarkComplete = async (stageKey: any) => {
    try {
      setIsActionLoading(true)
      await handleMarkStageDone(stageKey, drivingSchoolId)
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleStepLessons = async (delta: number) => {
    const current = journey.completedLessonsCount || 0
    const nextCount = Math.max(0, Math.min(20, current + delta))
    try {
      setIsActionLoading(true)
      await handleSaveCompletedLessons(nextCount, drivingSchoolId)
    } finally {
      setIsActionLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Back Navigation & Header */}
      <div>
        <Link
          to="/journey"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline mb-2 cursor-pointer"
        >
          ← Back to Learner Journey Dashboard
        </Link>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {journey.student.full_name}
              </h1>
              {isAdmin ? (
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-extrabold text-blue-800 border border-blue-200">
                  Full Admin Permissions
                </span>
              ) : (
                <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-extrabold text-indigo-800 border border-indigo-200">
                  Instructor Permissions
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Admission: <strong className="font-mono text-slate-700">{journey.student.admission_number}</strong> • Registered: {journey.student.registration_date} • {journey.student.branch_name}
            </p>
          </div>

          <div className="flex gap-2">
            {logbookData && (
              <>
                <button
                  type="button"
                  onClick={() => setShowLogbook(true)}
                  className="rounded-xl border border-blue-300 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>View DMT Logbook</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowTrialSlip(true)}
                  className="rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Ticket className="h-4 w-4" />
                  <span>Print Trial Pass</span>
                </button>
              </>
            )}
            <Link
              to="/students"
              className="rounded-xl border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
            >
              View Student Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Role Access Scope Info Bar */}
      <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs text-slate-600">
        <div>
          {isAdmin ? (
            <span>
              🛡️ <strong>Administrator Mode:</strong> You can edit and mark as done all 7 learner journey milestones (Medical, Permit, Theory Exam, Practical Lessons, DMT Trial, and Final Licence).
            </span>
          ) : (
            <span>
              🚗 <strong>Instructor Mode:</strong> You are authorized to log <strong>Practical Driving Lessons</strong> and record <strong>DMT Practical Trial</strong> milestones. Administrative records (Medical, Permit, Theory) are read-only.
            </span>
          )}
        </div>
        <span className="font-semibold text-slate-500">
          Stage {stageData.currentStageNumber} of 7
        </span>
      </div>

      {/* Alerts */}
      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="p-1 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
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
            className="p-1 text-emerald-500 hover:text-emerald-700 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 1. Visual 7-Stage Pipeline with Quick Mark-Done Buttons */}
      <StudentJourneyPipeline
        stages={stageData.stages}
        overallPercentage={stageData.completionPercentage}
        currentStageName={stageData.currentStageName}
        isAdmin={isAdmin}
        isInstructor={isInstructor}
        onQuickMarkDone={handleQuickMarkComplete}
      />

      {/* 2. Permits & Medical Records Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <PermitTrackerCard
          studentId={journey.student.id}
          drivingSchoolId={drivingSchoolId}
          permit={journey.permit}
          isAdmin={isAdmin}
          onSavePermit={handleSavePermit}
        />

        <MedicalStatusCard
          studentId={journey.student.id}
          drivingSchoolId={drivingSchoolId}
          medical={journey.medical}
          isAdmin={isAdmin}
          onSaveMedical={handleSaveMedical}
        />
      </div>

      {/* 3. Theory & Practical Trial Milestones */}
      <ExamTrialMilestones
        studentId={journey.student.id}
        drivingSchoolId={drivingSchoolId}
        theoryExams={journey.theoryExams}
        practicalTrials={journey.practicalTrials}
        isAdmin={isAdmin}
        isInstructor={isInstructor}
        onSaveExamTrial={handleSaveExamTrial}
      />

      {/* 4. Practical Driving Lessons & Licence Issuance Summary Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Stage 5: Practical Lessons Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Stage 5: Practical Driving Lessons
              </h3>
              <p className="text-xs text-slate-500">
                Logged practical training sessions & digital logbook
              </p>
            </div>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                journey.completedLessonsCount >= 10
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : 'bg-blue-100 text-blue-800 border-blue-200'
              }`}
            >
              {journey.completedLessonsCount >= 10
                ? 'Curriculum Completed'
                : `${journey.completedLessonsCount} / 10 Lessons`}
            </span>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Required Curriculum Threshold:</span>
              <strong className="text-slate-900">10 Completed Practical Sessions</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Current Completed Count:</span>
              <strong className="text-blue-700">{journey.completedLessonsCount} Sessions Logged</strong>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden mt-2">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (journey.completedLessonsCount / 10) * 100)}%` }}
              />
            </div>
          </div>

          {/* Quick Controls for Stage 5 */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={isActionLoading || journey.completedLessonsCount <= 0}
                onClick={() => handleStepLessons(-1)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
              >
                - 1 Lesson
              </button>
              <button
                type="button"
                disabled={isActionLoading}
                onClick={() => handleStepLessons(1)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
              >
                + 1 Lesson
              </button>
            </div>

            <div className="flex items-center gap-2">
              {journey.completedLessonsCount < 10 && (
                <button
                  type="button"
                  disabled={isActionLoading}
                  onClick={() => handleQuickMarkComplete('lessons')}
                  className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>✔ Mark 10/10 Done</span>
                </button>
              )}
              <Link
                to="/sessions"
                className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
              >
                Sessions View →
              </Link>
            </div>
          </div>
        </div>

        {/* Stage 7: Driving Licence Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Stage 7: Driving Licence Issuance
              </h3>
              <p className="text-xs text-slate-500">
                Department of Motor Traffic (DMT) Official Card
              </p>
            </div>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                hasPassedTrial
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {hasPassedTrial ? 'Licence Granted' : 'Pending Trial Exam'}
            </span>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-2 text-xs">
            <p className="text-slate-600">
              {hasPassedTrial
                ? 'Student has successfully cleared the DMT Practical Trial examination. The official Smart Card Driving Licence is approved and issued by DMT Sri Lanka.'
                : 'Student must clear all 6 preceding stages (Medical, Learner Permit, Theory Exam, Practical Lessons, and DMT Practical Trial) to be issued the official driving licence.'}
            </p>
          </div>

          <div className="flex justify-end items-center gap-2 pt-1 border-t border-slate-100">
            {hasPassedTrial ? (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                ✔ 100% Journey Completed
              </span>
            ) : isAdmin ? (
              <button
                type="button"
                disabled={isActionLoading}
                onClick={() => handleQuickMarkComplete('licence')}
                className="rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1"
              >
                <span>✔ Mark Licence Issued (Pass Trial & Issue)</span>
              </button>
            ) : (
              <span className="text-[11px] text-slate-400 italic">
                Awaiting Stage 6 Practical Trial Pass
              </span>
            )}
          </div>
        </div>
      </div>

      {/* DMT Logbook & Trial Slip Modals */}
      {logbookData && (
        <>
          <DmtLogbookModal
            isOpen={showLogbook}
            onClose={() => setShowLogbook(false)}
            data={logbookData}
          />
          {(() => {
            const slipData = getTrialSlipData()
            return slipData ? (
              <DmtTrialSlipModal
                isOpen={showTrialSlip}
                onClose={() => setShowTrialSlip(false)}
                data={slipData}
              />
            ) : null
          })()}
        </>
      )}
    </div>
  )
}

export default StudentJourneyDetailPage

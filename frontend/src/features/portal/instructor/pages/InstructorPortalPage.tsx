import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Target, X } from 'lucide-react'
import { AiSessionFeedbackModal } from '../../../ai/components/AiSessionFeedbackModal'
import { SessionAttendanceModal } from '../../../sessions/components/SessionAttendanceModal'
import { VehicleDefectSwitchModal } from '../../../vehicles/components/VehicleDefectSwitchModal'
import { getVehicles } from '../../../vehicles/services/vehicleService'
import type {
  VehicleTransmissionType,
  VehicleWithRelations,
} from '../../../vehicles/types/vehicle'
import { useAuth } from '../../../auth/context/AuthContext'
import type {
  PracticalSessionWithRelations,
  RecordAttendanceInput,
} from '../../../sessions/types/session'
import type {
  StudentPerformanceAssessmentInput,
  StudentReadinessProfile,
} from '../../../readiness/types/readiness'
import { recordStudentPerformanceAssessment } from '../../../readiness/services/readinessService'
import { StudentPerformanceAssessmentModal } from '../../../readiness/components/StudentPerformanceAssessmentModal'
import { InstructorStatsCards } from '../components/InstructorStatsCards'
import { InstructorStudentsRoster } from '../components/InstructorStudentsRoster'
import { InstructorTodayAgenda } from '../components/InstructorTodayAgenda'
import { useInstructorPortal } from '../hooks/useInstructorPortal'

interface InstructorPortalPageProps {
  drivingSchoolId: string
}

export const InstructorPortalPage: React.FC<InstructorPortalPageProps> = ({
  drivingSchoolId,
}) => {
  const { profile } = useAuth()
  const {
    todaySessions,
    students,
    stats,
    isLoading,
    errorMessage,
    successMessage,
    setErrorMessage,
    setSuccessMessage,
    reloadData,
    handleUpdateAttendance,
  } = useInstructorPortal(drivingSchoolId)

  const [allVehicles, setAllVehicles] = useState<VehicleWithRelations[]>([])
  const [selectedSessionForAttendance, setSelectedSessionForAttendance] =
    useState<PracticalSessionWithRelations | null>(null)
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false)

  const [selectedSessionForAi, setSelectedSessionForAi] =
    useState<PracticalSessionWithRelations | null>(null)
  const [isAiModalOpen, setIsAiModalOpen] = useState(false)

  const [selectedSessionForVehicleDefect, setSelectedSessionForVehicleDefect] =
    useState<PracticalSessionWithRelations | null>(null)
  const [activeDefectVehicle, setActiveDefectVehicle] =
    useState<VehicleWithRelations | null>(null)
  const [isDefectModalOpen, setIsDefectModalOpen] = useState(false)

  const [gradingStudent, setGradingStudent] =
    useState<StudentReadinessProfile | null>(null)
  const [isGradingModalOpen, setIsGradingModalOpen] = useState(false)

  useEffect(() => {
    getVehicles(drivingSchoolId)
      .then((data) => setAllVehicles(data))
      .catch((err) => console.warn('Vehicles load notice:', err))
  }, [drivingSchoolId])

  useEffect(() => {
    const handleSessionsUpdateEvent = () => {
      void reloadData()
      getVehicles(drivingSchoolId)
        .then((data) => setAllVehicles(data))
        .catch(() => {})
    }
    window.addEventListener('trialready-sessions-updated', handleSessionsUpdateEvent)
    window.addEventListener('trialready-vehicles-updated', handleSessionsUpdateEvent)
    return () => {
      window.removeEventListener('trialready-sessions-updated', handleSessionsUpdateEvent)
      window.removeEventListener('trialready-vehicles-updated', handleSessionsUpdateEvent)
    }
  }, [reloadData, drivingSchoolId])

  const handleOpenAttendance = (session: PracticalSessionWithRelations) => {
    setSelectedSessionForAttendance(session)
    setIsAttendanceModalOpen(true)
  }

  const handleOpenAiFeedback = (session: PracticalSessionWithRelations) => {
    setSelectedSessionForAi(session)
    setIsAiModalOpen(true)
  }

  const handleOpenVehicleDefect = (session: PracticalSessionWithRelations) => {
    // Resolve vehicle object from session or allVehicles
    let targetVeh = allVehicles.find((v) => v.id === session.vehicle_id)
    if (!targetVeh && session.vehicle) {
      targetVeh = allVehicles.find(
        (v) => v.registration_number === session.vehicle?.registration_number,
      )
    }
    if (!targetVeh && session.vehicle) {
      // Create fallback relation representation
      targetVeh = {
        id: session.vehicle_id || 'veh-active',
        driving_school_id: drivingSchoolId,
        branch_id: session.branch_id || 'b1a789c2-5d41-4e89-9b12-8f7a63450001',
        licence_category_id: session.licence_category_id || 'c1a789c2-5d41-4e89-9b12-8f7a63450001',
        registration_number: session.vehicle.registration_number || 'WP CAB-4921',
        display_name: `${session.vehicle.make || 'Toyota'} ${session.vehicle.model || 'Vitz'}`,
        manufacturer: session.vehicle.make || 'Toyota',
        model: session.vehicle.model || 'Vitz Dual-Control',
        year_of_manufacture: 2022,
        transmission_type: (session.vehicle.transmission_type as VehicleTransmissionType) || 'manual',
        fuel_type: 'petrol',
        photo_path: null,
        date_added: '2025-01-15',
        training_use_enabled: true,
        operational_status: 'active',
        availability_status: 'available',
        current_odometer_km: 42150,
        next_service_date: null,
        internal_notes: null,
        deactivation_reason: null,
        deactivated_at: null,
        branch: session.branch,
        licence_category: session.licence_category,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    }

    setSelectedSessionForVehicleDefect(session)
    setActiveDefectVehicle(targetVeh ?? allVehicles[0] ?? null)
    setIsDefectModalOpen(true)
  }

  const handleSaveAttendanceDirect = async (input: RecordAttendanceInput) => {
    if (!selectedSessionForAttendance) return
    await handleUpdateAttendance(selectedSessionForAttendance.id, input)
  }

  if (isLoading) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-xs font-medium text-slate-500">
            Loading instructor dashboard...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Instructor Dashboard
            </h1>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
              Active On-Duty
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Daily practical driving lessons, student attendance logs, and DMT skill mastery assessments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/sessions"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Full Calendar</span>
          </Link>
          <Link
            to="/readiness"
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
          >
            <Target className="h-3.5 w-3.5" />
            <span>Trial Candidates Hub</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <InstructorStatsCards stats={stats} />

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

      {/* 1. Today's Lesson Agenda */}
      <InstructorTodayAgenda
        sessions={todaySessions}
        onOpenAttendance={handleOpenAttendance}
        onOpenAiFeedback={handleOpenAiFeedback}
        onReportVehicleFault={handleOpenVehicleDefect}
      />

      {/* 2. Assigned Students Roster */}
      <InstructorStudentsRoster
        students={students}
        onGradeStudent={(student) => {
          setGradingStudent(student)
          setIsGradingModalOpen(true)
        }}
      />

      {/* Practical Performance Grading Modal */}
      {gradingStudent && (
        <StudentPerformanceAssessmentModal
          isOpen={isGradingModalOpen}
          studentId={gradingStudent.student.id}
          studentName={gradingStudent.student.full_name}
          admissionNumber={gradingStudent.student.admission_number}
          currentReadinessScore={gradingStudent.evaluation.readiness_score}
          drivingSchoolId={drivingSchoolId}
          initialSkills={gradingStudent.evaluation.skills_missing.length === 0 ? ['Hill Start', 'Reverse S-Bend', 'Parallel Parking', '3-Point Turn', 'Traffic Discipline', 'Emergency Braking', 'Clutch & Gear Shift'] : ['Hill Start', 'Reverse S-Bend', 'Parallel Parking', '3-Point Turn']}
          initialRating={gradingStudent.evaluation.readiness_score >= 80 ? 5 : gradingStudent.evaluation.readiness_score >= 60 ? 4 : 3}
          initialFeedback={gradingStudent.evaluation.recommendation_summary || ''}
          isAdmin={profile?.role === 'administrator'}
          isInstructor={true}
          onClose={() => {
            setIsGradingModalOpen(false)
            setGradingStudent(null)
          }}
          onSaveAssessment={async (input: StudentPerformanceAssessmentInput) => {
            await recordStudentPerformanceAssessment(input)
            await reloadData()
            setSuccessMessage(
              `Performance marks and maneuver evaluation updated for ${gradingStudent.student.full_name}.`,
            )
          }}
        />
      )}

      {/* Attendance Modal */}
      <SessionAttendanceModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        session={selectedSessionForAttendance}
        onSaveAttendance={async (_id, input) => {
          await handleSaveAttendanceDirect(input)
        }}
      />

      {/* AI Session Feedback Synthesizer Modal */}
      {selectedSessionForAi && (
        <AiSessionFeedbackModal
          isOpen={isAiModalOpen}
          onClose={() => {
            setIsAiModalOpen(false)
            setSelectedSessionForAi(null)
          }}
          studentName={selectedSessionForAi.student?.full_name || 'Student'}
          sessionDate={selectedSessionForAi.session_date}
          durationMinutes={90}
          skillsCovered={selectedSessionForAi.skills_covered || ['Basic Vehicle Control']}
          studentRating={selectedSessionForAi.student_rating || 4}
          vehicleReg={selectedSessionForAi.vehicle?.registration_number || 'WP CAB-4921'}
          instructorName={profile?.full_name || 'Principal Instructor'}
        />
      )}

      {/* Vehicle Defect & Replacement Switch Modal */}
      {isDefectModalOpen && activeDefectVehicle && (
        <VehicleDefectSwitchModal
          isOpen={isDefectModalOpen}
          onClose={() => {
            setIsDefectModalOpen(false)
            setSelectedSessionForVehicleDefect(null)
            setActiveDefectVehicle(null)
          }}
          vehicle={activeDefectVehicle}
          availableVehicles={allVehicles}
          instructorName={profile?.full_name || 'Instructor'}
          sessionId={selectedSessionForVehicleDefect?.id}
          sessionStudentName={selectedSessionForVehicleDefect?.student?.full_name}
          onSuccess={(defectiveReg, replacementReg) => {
            setSuccessMessage(
              replacementReg
                ? `Vehicle fault logged for ${defectiveReg}. Session successfully switched to spare vehicle ${replacementReg}.`
                : `Vehicle fault logged for ${defectiveReg}. Defective vehicle moved to maintenance.`,
            )
            void reloadData()
          }}
        />
      )}
    </div>
  )
}

export default InstructorPortalPage

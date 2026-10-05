import { supabase } from '../../../lib/supabase'
import { getStoredData, setStoredData, STORAGE_KEYS } from '../../../lib/persistentStorage'
import type { PracticalSessionWithRelations } from '../../sessions/types/session'
import type { StudentExamTrial, StudentMedicalRecord, StudentPermit } from '../../journey/types/journey'
import {
  evaluateStudentTrialReadiness,
} from '../utils/readinessEngine'
import type {
  ReadinessEvaluation,
  SaveReadinessEvaluationInput,
  StudentPerformanceAssessmentInput,
  StudentReadinessProfile,
} from '../types/readiness'

import {
  DEMO_STUDENT_AMAYA_ID,
  generateRealisticUuid,
} from '../../demo/data/generateDemo100Data'

export async function saveReadinessEvaluation(
  input: SaveReadinessEvaluationInput,
): Promise<ReadinessEvaluation> {
  const { data, error } = await supabase
    .from('student_readiness_evaluations')
    .insert([
      {
        driving_school_id: input.driving_school_id,
        student_id: input.student_id,
        readiness_score: input.readiness_score,
        readiness_tier: input.readiness_tier,
        recommendation_summary: input.recommendation_summary,
        skills_mastered_count: input.skills_mastered_count,
        skills_missing: input.skills_missing,
        practical_hours_completed: input.practical_hours_completed,
        permit_status: input.permit_status,
        medical_status: input.medical_status,
        theory_exam_status: input.theory_exam_status,
        risk_warnings: input.risk_warnings,
        action_items: input.action_items,
        evaluator_type: input.evaluator_type ?? 'rule_engine',
        evaluated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to save readiness evaluation: ${error.message}`)
  }

  return data as ReadinessEvaluation
}

export async function getStudentReadinessProfile(
  studentId: string,
): Promise<StudentReadinessProfile> {
  const localStudents = getStoredData<any[]>(STORAGE_KEYS.STUDENTS, [])
  const localStudent = localStudents.find(
    (s) =>
      s.id === studentId ||
      (s.student_code && s.student_code.toLowerCase() === studentId.toLowerCase()),
  )
  const targetId = localStudent ? localStudent.id : studentId

  const [studentRes, permitRes, medicalRes, examsRes, sessionsRes, paymentsRes, enrolRes] =
    await Promise.all([
      supabase
        .from('students')
        .select('id, full_name, student_code, phone, email, driving_school_id, branches(name)')
        .eq('id', targetId)
        .maybeSingle(),
      supabase
        .from('student_permits')
        .select('*')
        .eq('student_id', targetId)
        .order('issue_date', { ascending: false })
        .maybeSingle(),
      supabase
        .from('student_medical_records')
        .select('*')
        .eq('student_id', targetId)
        .order('created_at', { ascending: false })
        .maybeSingle(),
      supabase
        .from('student_exam_trials')
        .select('*')
        .eq('student_id', targetId)
        .eq('exam_type', 'theory')
        .order('scheduled_date', { ascending: false }),
      supabase
        .from('practical_sessions')
        .select('*, vehicles(registration_number), instructors(full_name)')
        .eq('student_id', targetId)
        .eq('status', 'completed'),
      supabase
        .from('student_payments')
        .select('amount')
        .eq('student_id', targetId),
      supabase
        .from('student_package_enrolments')
        .select('agreed_total_fee, discount_amount')
        .eq('student_id', targetId)
        .eq('status', 'active')
        .maybeSingle(),
    ])

  const student = studentRes.data ?? localStudent ?? {
    id: targetId,
    full_name: 'Amaya Fernando',
    student_code: 'ADM-2026-0101',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    phone: null,
    email: null,
    branches: { name: 'Main Branch' },
  }

  const localPermits = getStoredData<StudentPermit[]>(STORAGE_KEYS.PERMITS, [])
  const permit =
    (permitRes.data as StudentPermit) ??
    localPermits.find((p) => p.student_id === targetId) ??
    null

  const localMedicals = getStoredData<StudentMedicalRecord[]>(STORAGE_KEYS.MEDICALS, [])
  const medical =
    (medicalRes.data as StudentMedicalRecord) ??
    localMedicals.find((m) => m.student_id === targetId) ??
    null

  const localExams = getStoredData<StudentExamTrial[]>(STORAGE_KEYS.EXAMS, [])
  const theoryExams =
    examsRes.data && examsRes.data.length > 0
      ? (examsRes.data as StudentExamTrial[])
      : localExams.filter((e) => e.student_id === targetId && e.exam_type === 'theory')

  const localSessions = getStoredData<PracticalSessionWithRelations[]>(STORAGE_KEYS.SESSIONS, [])
  const completedSessions =
    sessionsRes.data && sessionsRes.data.length > 0
      ? (sessionsRes.data as PracticalSessionWithRelations[])
      : localSessions.filter((s) => s.student_id === targetId && s.status === 'completed')

  const localPayments = getStoredData<any[]>(STORAGE_KEYS.PAYMENTS, [])
  const paymentsList =
    paymentsRes.data && paymentsRes.data.length > 0
      ? paymentsRes.data
      : localPayments.filter((p) => p.student_id === targetId)

  const localEnrolments = getStoredData<any[]>(STORAGE_KEYS.ENROLMENTS, [])
  const enrolmentData =
    enrolRes.data ??
    localEnrolments.find((e) => e.student_id === targetId) ??
    null

  // Financial balance
  const agreedFee = enrolmentData
    ? Number(enrolmentData.agreed_total_fee) - Number(enrolmentData.discount_amount || 0)
    : 65000
  const totalPaid = paymentsList.reduce((sum, p) => sum + Number(p.amount || 0), 0)
  const balance = Math.max(0, agreedFee - totalPaid)

  const { evaluation, factors, averageRating } = evaluateStudentTrialReadiness({
    studentId: student.id,
    drivingSchoolId: student.driving_school_id,
    permit,
    medical,
    theoryExams,
    completedSessions,
    financialBalance: balance,
  })

  return {
    student: {
      id: student.id,
      full_name: student.full_name,
      admission_number: (student as any).student_code ?? (student as any).admission_number ?? '—',
      phone: student.phone ?? null,
      email: student.email ?? null,
      branch_name: (student.branches as any)?.name ?? student.branch?.name ?? 'Main Branch',
    },
    evaluation,
    factors,
    totalSessionsCount: completedSessions.length,
    averageInstructorRating: averageRating,
  }
}

export async function getSchoolReadinessOverview(
  drivingSchoolId: string,
): Promise<StudentReadinessProfile[]> {
  const localStudents = getStoredData<any[]>(STORAGE_KEYS.STUDENTS, [])
  const fallbackIds =
    localStudents.length > 0
      ? localStudents.map((s) => s.id)
      : [
          DEMO_STUDENT_AMAYA_ID,
          generateRealisticUuid('student', 2),
          generateRealisticUuid('student', 3),
          generateRealisticUuid('student', 4),
          generateRealisticUuid('student', 5),
        ]

  try {
    const { data: students, error } = await supabase
      .from('students')
      .select('id')
      .eq('driving_school_id', drivingSchoolId)
      .eq('is_active', true)

    if (error || !students || students.length === 0) {
      const profiles = await Promise.all(
        fallbackIds.map((id) => getStudentReadinessProfile(id)),
      )
      return profiles.sort(
        (a, b) => b.evaluation.readiness_score - a.evaluation.readiness_score,
      )
    }

    const combinedIds = Array.from(
      new Set([...students.map((s) => s.id), ...fallbackIds]),
    )
    const profiles = await Promise.all(
      combinedIds.map((id) => getStudentReadinessProfile(id)),
    )

    // Sort descending by readiness score
    return profiles.sort(
      (a, b) => b.evaluation.readiness_score - a.evaluation.readiness_score,
    )
  } catch {
    const profiles = await Promise.all(
      fallbackIds.map((id) => getStudentReadinessProfile(id)),
    )
    return profiles.sort(
      (a, b) => b.evaluation.readiness_score - a.evaluation.readiness_score,
    )
  }
}

export async function recordStudentPerformanceAssessment(
  input: StudentPerformanceAssessmentInput,
): Promise<StudentReadinessProfile> {
  const localSessions = getStoredData<PracticalSessionWithRelations[]>(
    STORAGE_KEYS.SESSIONS,
    [],
  )
  const assessmentDate =
    input.session_date || new Date().toISOString().split('T')[0]

  const newAssessmentSession: PracticalSessionWithRelations = {
    id: `eval-sess-${Date.now()}`,
    driving_school_id: input.driving_school_id,
    branch_id: 'b1a789c2-5d41-4e89-9b12-8f7a63450001',
    student_id: input.student_id,
    instructor_id: 'd41f8a29-7c3e-4b95-a841-3b7c89f10001',
    vehicle_id: 'f1a789c2-5d41-4e89-9b12-8f7a63450001',
    licence_category_id: 'c1a789c2-5d41-4e89-9b12-8f7a63450001',
    session_date: assessmentDate,
    start_time: '10:00:00',
    end_time: '11:30:00',
    status: 'completed',
    attendance_status: 'present',
    instructor_feedback: input.instructor_feedback,
    student_rating: input.student_rating,
    cancellation_reason: null,
    skills_covered: input.skills_covered,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    instructor: {
      id: 'd41f8a29-7c3e-4b95-a841-3b7c89f10001',
      full_name:
        input.evaluator_name ||
        (input.evaluator_role === 'admin'
          ? 'Nimal Jayawardena (Chief Examiner)'
          : 'Nimal Jayasuriya (Senior Instructor)'),
      staff_number: 'INS-WP-001',
      phone: '+94 77 234 5678',
    },
    student: {
      id: input.student_id,
      full_name: 'Student Candidate',
      admission_number: 'TR-2026-0042',
      phone: '+94 77 123 4567',
    },
    vehicle: {
      id: 'f1a789c2-5d41-4e89-9b12-8f7a63450001',
      registration_number: 'WP CAB-4921',
      make: 'Toyota',
      model: 'Vitz Dual-Control',
      transmission_type: 'manual',
    },
    licence_category: {
      id: 'c1a789c2-5d41-4e89-9b12-8f7a63450001',
      code: 'B',
      name: 'Dual-Control Light Motor Vehicle',
    },
    branch: {
      id: 'b1a789c2-5d41-4e89-9b12-8f7a63450001',
      name: 'Nugegoda Main Campus',
      code: 'NUG-01',
    },
  }

  // Find existing completed sessions for this student
  const studentCompletedIdx = localSessions.findIndex(
    (s) => s.student_id === input.student_id && s.status === 'completed',
  )

  let updatedSessions: PracticalSessionWithRelations[]
  if (studentCompletedIdx !== -1) {
    const existing = localSessions[studentCompletedIdx]
    const mergedSkills = Array.from(
      new Set([...(existing.skills_covered || []), ...input.skills_covered]),
    )
    localSessions[studentCompletedIdx] = {
      ...existing,
      student_rating: input.student_rating,
      instructor_feedback: input.instructor_feedback,
      skills_covered: mergedSkills,
      updated_at: new Date().toISOString(),
    }
    // Also append the new evaluation session for history if needed
    updatedSessions = [newAssessmentSession, ...localSessions]
  } else {
    updatedSessions = [newAssessmentSession, ...localSessions]
  }

  setStoredData(STORAGE_KEYS.SESSIONS, updatedSessions)

  // Re-calculate and return fresh readiness profile
  return getStudentReadinessProfile(input.student_id)
}

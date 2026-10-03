import { supabase } from '../../../lib/supabase'
import {
  getStoredData,
  setStoredData,
  STORAGE_KEYS,
  upsertStoredItem,
} from '../../../lib/persistentStorage'
import type {
  SaveExamTrialInput,
  SaveMedicalInput,
  SavePermitInput,
  StudentExamTrial,
  StudentJourneyOverview,
  StudentMedicalRecord,
  StudentPermit,
} from '../types/journey'
import { computeJourneyStages } from '../utils/journeyUtils'

export const DEFAULT_PERMITS: StudentPermit[] = [
  {
    id: 'per-001',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    student_id: '11111111-1111-1111-1111-111111111111',
    permit_number: 'DMT-WP-2026-08129',
    issue_date: '2026-01-20',
    expiry_date: '2027-01-20',
    dmt_reference: 'WER-2026-PER-0042',
    status: 'active',
    is_current: true,
    notes: 'Valid DMT Learner Permit (Dual Control Category B & A)',
    created_at: '2026-01-20T08:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'per-002',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    student_id: '11111111-1111-1111-1111-222222222222',
    permit_number: 'DMT-WP-2026-09412',
    issue_date: '2026-02-10',
    expiry_date: '2027-02-10',
    dmt_reference: 'WER-2026-PER-0058',
    status: 'active',
    is_current: true,
    notes: 'Valid DMT Learner Permit (Category B)',
    created_at: '2026-02-10T08:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'per-003',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    student_id: '11111111-1111-1111-1111-333333333333',
    permit_number: 'DMT-CP-2026-04189',
    issue_date: '2026-03-05',
    expiry_date: '2027-03-05',
    dmt_reference: 'GAM-2026-PER-0071',
    status: 'active',
    is_current: true,
    notes: 'Valid DMT Learner Permit (Category B1 Three Wheeler)',
    created_at: '2026-03-05T08:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
]

export const DEFAULT_MEDICALS: StudentMedicalRecord[] = [
  {
    id: 'med-001',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    student_id: '11111111-1111-1111-1111-111111111111',
    status: 'passed',
    appointment_date: '2026-01-15',
    certificate_number: 'NTMI-COL-2026-01824',
    issued_date: '2026-01-15',
    expiry_date: '2026-07-15',
    ntmi_branch: 'Nugegoda NTMI Center',
    blood_group: 'A+',
    restrictions: 'Corrective lenses required for driving',
    notes: 'Fitness certificate cleared with eye check.',
    created_at: '2026-01-15T08:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'med-002',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    student_id: '11111111-1111-1111-1111-222222222222',
    status: 'passed',
    appointment_date: '2026-02-05',
    certificate_number: 'NTMI-COL-2026-02910',
    issued_date: '2026-02-05',
    expiry_date: '2026-08-05',
    ntmi_branch: 'Werahera Main Medical Institute',
    blood_group: 'B+',
    restrictions: 'None',
    notes: 'Standard fit for light vehicle training.',
    created_at: '2026-02-05T08:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'med-003',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    student_id: '11111111-1111-1111-1111-333333333333',
    status: 'passed',
    appointment_date: '2026-03-02',
    certificate_number: 'NTMI-GAM-2026-03118',
    issued_date: '2026-03-02',
    expiry_date: '2026-09-02',
    ntmi_branch: 'Gampaha Hospital Medical Unit',
    blood_group: 'O+',
    restrictions: 'None',
    notes: 'Clear medical assessment.',
    created_at: '2026-03-02T08:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
]

export const DEFAULT_EXAMS: StudentExamTrial[] = [
  {
    id: 'ex-001',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    student_id: '11111111-1111-1111-1111-111111111111',
    exam_type: 'theory',
    attempt_number: 1,
    scheduled_date: '2026-03-10',
    status: 'passed',
    score: 38,
    location: 'DMT Werahera Computerized Hall',
    examiner_notes: 'Passed with high score (38/40)',
    created_at: '2026-03-10T08:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'ex-002',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    student_id: '11111111-1111-1111-1111-111111111111',
    exam_type: 'practical_trial',
    attempt_number: 1,
    scheduled_date: '2026-10-18',
    status: 'scheduled',
    score: null,
    location: 'Werahera DMT Trial Ground',
    examiner_notes: 'Eligible for final practical trial assessment.',
    created_at: '2026-09-01T08:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'ex-003',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    student_id: '11111111-1111-1111-1111-222222222222',
    exam_type: 'theory',
    attempt_number: 1,
    scheduled_date: '2026-04-12',
    status: 'passed',
    score: 35,
    location: 'DMT Werahera Computerized Hall',
    examiner_notes: 'Passed theory test on first attempt.',
    created_at: '2026-04-12T08:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
]

// ==========================================
// Permits
// ==========================================

export async function getCurrentPermit(
  studentId: string,
): Promise<StudentPermit | null> {
  const localPermits = getStoredData<StudentPermit[]>(
    STORAGE_KEYS.PERMITS,
    DEFAULT_PERMITS,
  )
  const cached = localPermits.find(
    (p) => p.student_id === studentId && p.is_current,
  )

  try {
    const { data } = await supabase
      .from('student_permits')
      .select('*')
      .eq('student_id', studentId)
      .eq('is_current', true)
      .maybeSingle()

    if (data) {
      upsertStoredItem(STORAGE_KEYS.PERMITS, data as StudentPermit)
      return data as StudentPermit
    }
  } catch {
    // fallback
  }

  return cached ?? null
}

export async function saveStudentPermit(
  input: SavePermitInput,
): Promise<StudentPermit> {
  const generatedId = crypto.randomUUID ? crypto.randomUUID() : `per-${Date.now()}`
  const newPermit: StudentPermit = {
    id: generatedId,
    driving_school_id: input.driving_school_id,
    student_id: input.student_id,
    permit_number: input.permit_number,
    issue_date: input.issue_date,
    expiry_date: input.expiry_date,
    dmt_reference: input.dmt_reference ?? null,
    notes: input.notes ?? null,
    status: 'active',
    is_current: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  // Deactivate prior permits for this student locally
  const localPermits = getStoredData<StudentPermit[]>(
    STORAGE_KEYS.PERMITS,
    DEFAULT_PERMITS,
  ).map((p) => (p.student_id === input.student_id ? { ...p, is_current: false } : p))
  setStoredData(STORAGE_KEYS.PERMITS, [newPermit, ...localPermits])

  try {
    await supabase
      .from('student_permits')
      .update({ is_current: false })
      .eq('student_id', input.student_id)

    await supabase.from('student_permits').insert([newPermit])
  } catch (err) {
    console.warn('Supabase permit save notice:', err)
  }

  return newPermit
}

// ==========================================
// Medical Records
// ==========================================

export async function getStudentMedical(
  studentId: string,
): Promise<StudentMedicalRecord | null> {
  const localMedicals = getStoredData<StudentMedicalRecord[]>(
    STORAGE_KEYS.MEDICALS,
    DEFAULT_MEDICALS,
  )
  const cached = localMedicals.find((m) => m.student_id === studentId)

  try {
    const { data } = await supabase
      .from('student_medical_records')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .maybeSingle()

    if (data) {
      upsertStoredItem(STORAGE_KEYS.MEDICALS, data as StudentMedicalRecord)
      return data as StudentMedicalRecord
    }
  } catch {
    // fallback
  }

  return cached ?? null
}

export async function saveStudentMedical(
  input: SaveMedicalInput,
): Promise<StudentMedicalRecord> {
  const generatedId = crypto.randomUUID ? crypto.randomUUID() : `med-${Date.now()}`
  const newMedical: StudentMedicalRecord = {
    id: generatedId,
    driving_school_id: input.driving_school_id,
    student_id: input.student_id,
    status: input.status,
    appointment_date: input.appointment_date ?? null,
    certificate_number: input.certificate_number ?? null,
    issued_date: input.issued_date ?? null,
    expiry_date: input.expiry_date ?? null,
    ntmi_branch: input.ntmi_branch ?? null,
    blood_group: input.blood_group ?? null,
    restrictions: input.restrictions ?? null,
    notes: input.notes ?? null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  upsertStoredItem(STORAGE_KEYS.MEDICALS, newMedical)

  try {
    const existing = await getStudentMedical(input.student_id)
    if (existing) {
      await supabase
        .from('student_medical_records')
        .update(newMedical)
        .eq('id', existing.id)
    } else {
      await supabase.from('student_medical_records').insert([newMedical])
    }
  } catch (err) {
    console.warn('Supabase medical save notice:', err)
  }

  return newMedical
}

// ==========================================
// Exams & Practical Trials
// ==========================================

export async function getStudentExamTrials(
  studentId: string,
): Promise<StudentExamTrial[]> {
  const localExams = getStoredData<StudentExamTrial[]>(
    STORAGE_KEYS.EXAMS,
    DEFAULT_EXAMS,
  )
  const studentLocal = localExams.filter((e) => e.student_id === studentId)

  try {
    const { data } = await supabase
      .from('student_exam_trials')
      .select('*')
      .eq('student_id', studentId)
      .order('scheduled_date', { ascending: true })

    if (data && data.length > 0) {
      return data as StudentExamTrial[]
    }
  } catch {
    // fallback
  }

  return studentLocal
}

export async function saveStudentExamTrial(
  input: SaveExamTrialInput,
): Promise<StudentExamTrial> {
  const generatedId = crypto.randomUUID ? crypto.randomUUID() : `ex-${Date.now()}`
  const newExam: StudentExamTrial = {
    id: generatedId,
    driving_school_id: input.driving_school_id,
    student_id: input.student_id,
    exam_type: input.exam_type,
    attempt_number: input.attempt_number,
    scheduled_date: input.scheduled_date,
    status: input.status,
    score: input.score ?? null,
    location: input.location ?? null,
    examiner_notes: input.examiner_notes ?? null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  upsertStoredItem(STORAGE_KEYS.EXAMS, newExam)

  try {
    await supabase.from('student_exam_trials').insert([newExam])
  } catch (err) {
    console.warn('Supabase exam schedule notice:', err)
  }

  return newExam
}

export async function updateStudentExamTrial(
  id: string,
  updates: Partial<SaveExamTrialInput>,
): Promise<StudentExamTrial> {
  const localExams = getStoredData<StudentExamTrial[]>(
    STORAGE_KEYS.EXAMS,
    DEFAULT_EXAMS,
  )
  const existing = localExams.find((e) => e.id === id) || DEFAULT_EXAMS[0]

  const updated: StudentExamTrial = {
    ...existing,
    ...updates,
    updated_at: new Date().toISOString(),
  }

  upsertStoredItem(STORAGE_KEYS.EXAMS, updated)

  try {
    await supabase.from('student_exam_trials').update(updates).eq('id', id)
  } catch (err) {
    console.warn('Supabase exam update notice:', err)
  }

  return updated
}

// ==========================================
// Comprehensive Student Journey Overview
// ==========================================

export async function getStudentJourneyOverview(
  studentId: string,
): Promise<StudentJourneyOverview> {
  const [permit, medical, exams] = await Promise.all([
    getCurrentPermit(studentId),
    getStudentMedical(studentId),
    getStudentExamTrials(studentId),
  ])

  let studentData = {
    id: studentId,
    full_name: 'Amaya Fernando',
    admission_number: 'ADM-2026-0042',
    phone: '+94 77 123 4567',
    email: 'amaya.fernando@gmail.com',
    registration_date: '2026-01-10',
    branch_name: 'Colombo Central (Nugegoda)',
  }

  let completedLessonsCount = 12

  try {
    const { data: s } = await supabase
      .from('students')
      .select(
        'id, full_name, student_code, phone, email, registration_date, branches(name)',
      )
      .eq('id', studentId)
      .single()

    if (s) {
      studentData = {
        id: s.id,
        full_name: s.full_name,
        admission_number: (s as any).student_code ?? 'ADM-2026-0042',
        phone: s.phone ?? null,
        email: s.email ?? null,
        registration_date: s.registration_date ?? '2026-01-10',
        branch_name: (s.branches as any)?.name ?? 'Colombo Central (Nugegoda)',
      }
    }

    const { count } = await supabase
      .from('practical_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('student_id', studentId)
      .eq('status', 'completed')

    if (count !== null && count !== undefined) {
      completedLessonsCount = count
    }
  } catch {
    // fallback
  }

  const theoryExams = exams.filter((e) => e.exam_type === 'theory')
  const practicalTrials = exams.filter((e) => e.exam_type === 'practical_trial')

  const stageAnalysis = computeJourneyStages({
    permit,
    medical,
    theoryExams,
    practicalTrials,
    completedLessonsCount,
  })

  return {
    student: {
      id: studentData.id,
      full_name: studentData.full_name,
      admission_number: studentData.admission_number,
      phone: studentData.phone,
      email: studentData.email,
      registration_date: studentData.registration_date,
      branch_name: studentData.branch_name,
    },
    permit,
    medical,
    theoryExams,
    practicalTrials,
    completedLessonsCount,
    overallStage: stageAnalysis.currentStageNumber,
    stageName: stageAnalysis.currentStageName,
    percentage: stageAnalysis.completionPercentage,
  }
}

export async function getAllStudentJourneys(
  drivingSchoolId: string,
): Promise<StudentJourneyOverview[]> {
  try {
    const { data: students, error: studError } = await supabase
      .from('students')
      .select(
        'id, full_name, student_code, phone, email, registration_date, branches(name)',
      )
      .eq('driving_school_id', drivingSchoolId)
      .eq('is_active', true)
      .order('full_name', { ascending: true })

    if (studError || !students || students.length === 0) {
      const defaultIds = [
        '11111111-1111-1111-1111-111111111111',
        '11111111-1111-1111-1111-222222222222',
        '11111111-1111-1111-1111-333333333333',
        '11111111-1111-1111-1111-444444444444',
        '11111111-1111-1111-1111-555555555555',
      ]
      return Promise.all(defaultIds.map((id) => getStudentJourneyOverview(id)))
    }

    return Promise.all(students.map((s) => getStudentJourneyOverview(s.id)))
  } catch {
    const defaultIds = [
      '11111111-1111-1111-1111-111111111111',
      '11111111-1111-1111-1111-222222222222',
      '11111111-1111-1111-1111-333333333333',
      '11111111-1111-1111-1111-444444444444',
      '11111111-1111-1111-1111-555555555555',
    ]
    return Promise.all(defaultIds.map((id) => getStudentJourneyOverview(id)))
  }
}
